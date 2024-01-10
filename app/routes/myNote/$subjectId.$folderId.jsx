import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import addNotesIcon from "~/icons/images3.jpeg";
import { Link, Form } from "@remix-run/react";
import addFolderIcon from "~/icons/Folder-Add-icon.png";
import { redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
export default function FolderPage() {
  const data = useLoaderData();
  const notes = data.notes;
  const subfolders = data.subfolders;
  const parentId=data.parentId;
  const params = useParams();
  const backPage=parentId?(`/myNote/${params.subjectId}/${parentId}`):(`/myNote/${params.subjectId}`)
  
  return (
    <div>
      <div>
        <nav className="top-left">
          <Link to={backPage}>
            <span className="back-arrow">← Back</span>
          </Link>
        </nav>
      </div>
      <div className="add-new-note">
        <Link to={`/myNote/${params.subjectId}/${params.folderId}/createNew`}>
          <img src={addNotesIcon} alt="add note Icon" className="add-note-icon" />
        </Link>
      </div>
      <div className="note-list">
        {!data || !notes.length ? (
          <p className="empty-folder">
            You don't have any notes. Please create new notes.
          </p>
        ) : (
          <>
            <div>
  {!data ? (
    <p className="empty-folder">
      You don't have any notes. Please create new notes.
    </p>
  ) : (
    <>
      {subfolders && subfolders.length ? (
        <div className="sub_folder-item">
          {subfolders.map((folder) => (
            <div key={folder.id}>
              <Link
                to={`/myNote/${params.subjectId}/${folder.id}`}
                className="sub_folder-name"
              >
                <h1>{folder.name}</h1>
              </Link>
            </div>
          ))}
        </div>
      ) : null}
      {notes && notes.length ? (
        <div className="note-list">
          <NoteList notes={notes} />
        </div>
      ) : null}
    </>
  )}
</div>
          </>
        )}
      </div>
      <div className="add-folder">
        <Form method="post">
          <input type="text" name="folderName" placeholder="Folder name" required />
          <button type="submit">
            <img src={addFolderIcon} alt="Folder Icon" className="add-folder-icon" />
          </button>
        </Form>
      </div>
    </div>
  );
}
export async function action({ request, params }) {
  const form = await request.formData();
  const newFolderName = form.get("folderName");
  await db.folder.create({
    data: {
      name: newFolderName,
      subjectId: params.subjectId,
      parentId: params.folderId,
    },
  });
  return redirect(`/myNote/${params.subjectId}/${params.folderId}`);
}
export const loader = async ({ params }) => {
  try {
  
    const folderId=params.folderId;
    const folder= await db.folder.findUnique({
      where: { id: folderId },
    });
    const parentId=folder.parentId;
  
    const subfolders = await db.folder.findMany({
      where: { parentId: params.folderId },
      select: { id: true, subjectId: true, parentId: true, name: true },
    });
    const notes = await db.note.findMany({
      where: { folderId: params.folderId },
      select: { id: true, title: true, keyword: true, content: true },
    });
    return {
      parentId:parentId,
      subfolders: subfolders,
      notes: notes,
    };
  } catch (error) {
    console.error("Loader Error:", error);
    throw error;
  }
};
export function links() {
  return [...noteListLinks()];
}
