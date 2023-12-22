import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useNavigate } from "react-router-dom";
import styles from "~/styles/note-details.css";
import { db } from "~/utils/db.server";
import { useParams } from "@remix-run/react";
import editIcon from "~/icons/edit_icon.png";
import deleteIcon from "~/icons/delete-icon.png";

export default function NoteDetailsPage() {
  const note = useLoaderData();
  const params = useParams();

  // Function to highlight keywords in content
  const highlightKeywords = (content, keywords) => {
    if (!keywords || typeof keywords !== "string" || keywords.trim() === "") {
      return <p>{content}</p>;
    }
    const escapedKeywords = keywords
      .split(",")
      .map((keyword) => keyword.trim());
    const keywordString = escapedKeywords.join("|");
    const highlightedContent = content.replace(
      new RegExp(keywordString, "gi"),
      (match) => {
        return `<span class="highlighted">${match}</span>`;
      }
    );
    return (
      <p
        id="note-details-content"
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />
    );
  };

  return (
    <div>
      <main id="note-details">
        <header>
          <nav className="top-left">
            <Link to={`/myNotes/${params.subjectId}/${params.folderId}`}>
              <span className="back-arrow">← Back</span>
            </Link>
          </nav>
          <nav className="top-right">
            <Link
              to={`/myNotes/${params.subjectId}/${params.folderId}/${params.noteId}/edit`}
            >
              <img src={editIcon} alt="edit Icon" className="edit-icon" />
            </Link>
          </nav>
          <h1 className="title">{note.title}</h1>
          <hr></hr>
        </header>
        {highlightKeywords(note.content, note.keyword)}
        <nav className="bottom-right">
          <Link
            to={`/myNotes/${params.subjectId}/${params.folderId}/${params.noteId}/delete`}
          >
            <img src={deleteIcon} alt="delete Icon" className="delete-icon" />
          </Link>
        </nav>
      </main>
    </div>
  );
}
export const loader = async ({ params }) => {
  const notes = await db.note.findMany();
  const noteId = params.noteId;
  const selectedNote = notes.find((note) => note.id === noteId);

  if (!selectedNote) {
    throw json(
      { message: "Could not find note for id " + noteId },
      { status: 404 }
    );
  }

  return selectedNote;
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function meta({ data }) {
  return {
    title: data.title,
    description: "Manage your notes with ease.",
  };
}
