import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const loader = async ({ params }) => {
  await db.note.delete({ where: { id: params.noteId } });
  return redirect(`/myNotes/${params.subjectId}/${params.folderId}`);
};

export function action() {
  return json({ success: true });
}
