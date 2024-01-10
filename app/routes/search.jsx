import { Link, useParams } from "@remix-run/react";
import { getUser } from "~/utils/session.server";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import NoteList, { links as noteListLinks } from "~/components/NoteList";



export default function search() {
  const data = useLoaderData();
  const notes = data.notes;
  return (
    <div>
       <div>
        <nav className="top-left">
          <Link to={`/`}>
            <span className="back-arrow">← Back</span>
          </Link>
        </nav>
      </div>
      {notes ? (
        <div>
          <ul id="note-list">
            {notes.map((note) => (
              <li key={note.id} className="note">
                <Link to={`/searchs/${data.searchTerm}/${note.id}`}>
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
      ) : null}
    </div>
  );
}


export const loader = async ({ request }) => {
  const { q: searchTerm } = Object.fromEntries(
    new URL(request.url).searchParams
  );
  if (searchTerm === "") {
    return {
      notes: null,
      searchTerm: searchTerm ||"",
    };
  }
  const notes = await db.note.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm } },
        { keyword: { contains: searchTerm } },
        { content: { contains: searchTerm } },
      ],
    },
    include:{
      folder:true
    }
  });


  return {
    notes: notes,
    searchTerm: searchTerm ||"",
  };
};

export function links() {
  return [...noteListLinks()];
}
