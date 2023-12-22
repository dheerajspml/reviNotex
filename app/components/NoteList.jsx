import { Link } from "@remix-run/react";
import styles from "./NoteList.css";

function NoteList({ notes }) {
  return (
    <div>
      <ul id="note-list">
        {notes.map((note, index) => (
          <li key={note.id} className="note">
            <Link to={note.id}>
              <article>
                <header>
                  <h2>{note.title}</h2>
                </header>
                <p>{note.content}</p>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoteList;

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
