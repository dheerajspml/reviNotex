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
    const fields = { userId, folderId, title, keyword, content };
    if (title.trim().length < 5) {
      return { message: "Invalid title - must be at least 5 characters long." };
    }
    console.log("field " + fields);
    const post = await db.note.create({ data: fields });
    return redirect(`/myNotes/${subjectId}/${folderId}`);
  } catch (error) {
    console.error("Error creating note:", error);
    return json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export function links() {
  return [...newNoteLinks()];
}

export function meta() {
  return {
    title: "All Notes",
    description: "Manage your notes with ease.",
  };
}

export function CatchBoundary() {
  const caughtResponse = useCatch();

  const message = caughtResponse.data?.message || "Data not found.";

  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to="/myNotes">safety</Link>!
      </p>
    </main>
  );
}
