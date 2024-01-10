import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action=async({params}) =>{
    await db.note.delete({ where: { id: params.noteId } });
    return redirect(`/myNote/${params.subjectId}/${params.folderId}`);
}
