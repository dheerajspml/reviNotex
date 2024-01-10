import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch } from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
export default function NotesPage() {
  return (
    <main>
      <NewNote />
    </main>
  );
}

export const action = async ({ request, params }) => {
  try {
    const user = await getUser(request);
    if (!user) {
      return json({ message: "User not authenticated" }, { status: 401 });
    }
    const formData = await request.formData();
    const title = formData.get("title");
    const keyword = formData.get("keyword");
    const content = formData.get("content");
    const userId = user.id; // Use the ID of the logged-in user
    const folderId = params.folderId;
    const subjectId = params.subjectId;
    console.log("folder id "+folderId)
    const fields = { userId, folderId, title, keyword, content };
    if (title.trim().length < 5) {
      return { message: "Invalid title - must be at least 5 characters long." };
    }
    const post = await db.note.create({ data: fields });
    return redirect(`/myNote/${subjectId}/${folderId}`);
  } catch (error) {
    console.error("Error creating note:", error);
    return json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export function links() {
  return [...newNoteLinks()];
}



