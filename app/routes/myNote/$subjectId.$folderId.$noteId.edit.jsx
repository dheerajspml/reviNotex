import { Form, useActionData, useParams } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import styles from "~/styles/editNotes.css";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { Link } from "@remix-run/react";

export async function loader({ params }) {
  const noteId = params.noteId;
  const selectedNote = await db.note.findUnique({
    where: {
      id: noteId,
    },
  });
  if (!selectedNote) {
    return { message: `Note with id ${noteId} not found.` };
  }
  return selectedNote;
}

export default function EditNotes() {
  const selectedNote = useLoaderData();
  const data = useActionData();
  const params = useParams();

  return (
    <div>
<Form method="PUT" id="note-form">
        <div>
        {data?.message && <p>{data.message}</p>}
      <p>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          defaultValue={selectedNote.title}
          id="title"
          name="title"
          required
        />
      </p>
      <p>
        <label htmlFor="keyword">Keyword</label>
        <textarea
          defaultValue={selectedNote.keyword}
          id="keyword"
          name="keyword"
          rows="3"
          required
        />
      </p>
      <p>
        <label htmlFor="content">Content</label>
        <textarea
          defaultValue={selectedNote.content}
          id="content"
          name="content"
          rows="10"
          required
        />
      </p>
      <div className="form-actions">
        <button className="bottom-right" type="submit">
          Save
        </button>
        <Link
          to={`/myNote/${params.subjectId}/${params.folderId}/${params.noteId}`}
        >
          <button className="bottom-left" type="button">
            Cancel
          </button>
        </Link>
      </div>
        </div>
      
     
    </Form>
    </div>
    
  );
}

export const action = async ({ request, params }) => {
  const user = await getUser(request);
  const formData = await request.formData();
  const title = formData.get("title");
  const keyword = formData.get("keyword");
  const content = formData.get("content");

  const fields = { title, keyword, content };
  if (title.trim().length < 5) {
    return { message: "Invalid title - must be at least 5 characters long." };
  }
  const noteId = params.noteId;
  const existingNote = await db.note.findUnique({
    where: {
      id: noteId,
    },
  });
  if (!existingNote) {
    return { message: `Note with id ${noteId} not found.` };
  }
  await db.note.update({
    where: {
      userId: user.id,
      folderId: params.folderId,
      id: noteId,
    },
    data: fields,
  });
  return redirect(
    `/myNote/${params.subjectId}/${params.folderId}/${params.noteId}`
  );
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
