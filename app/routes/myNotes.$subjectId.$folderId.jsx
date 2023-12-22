import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import addNotesIcon from "~/icons/images3.jpeg";
import { Link } from "@remix-run/react";

export default function folderPage() {
  const data = useLoaderData();
  const notes = data.notes;
  const subjectId = data.subjectId;
  const folderId = data.folderId;
  return (
    <div>
      <div>
        <nav className="top-left">
          <Link to={`/myNotes/${subjectId}`}>
            <span className="back-arrow">← Back</span>
          </Link>
        </nav>
      </div>
      <div className="add-new-note">
        <Link to={`/myNotes/${subjectId}/${folderId}/createNew`}>
          <img
            src={addNotesIcon}
            alt="add note Icon"
            className="add-note-icon"
          />
        </Link>
      </div>
      <div className="note-list">
        {!notes ? (
          <p className="empty-folder">
            {" "}
            You don't have any notes . Please create new notes
          </p>
        ) : (
          <div>
            <NoteList notes={notes} />
          </div>
        )}
      </div>
    </div>
  );
}

export const loader = async ({ params }) => {
  try {
    const notes = await db.note.findMany({
      where: { folderId: params.folderId },
      select: { id: true, title: true, keyword: true, content: true },
    });

    if (!notes || notes.length === 0) {
      return {
        notes: null,
        subjectId: params.subjectId,
        folderId: params.folderId,
      };
    }
    return {
      notes: notes,
      subjectId: params.subjectId,
      folderId: params.folderId,
    };
  } catch (error) {
    console.error("Loader Error:", error);
    throw error;
  }
};

export function links() {
  return [...noteListLinks()];
}
