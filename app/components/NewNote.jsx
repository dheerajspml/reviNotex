import {
  Form,
  useActionData,
  useTransition as useNavigation,
} from "@remix-run/react";

import styles from "./NewNote.css";
import { Link } from "@remix-run/react";
import { useParams } from "@remix-run/react";

function NewNote() {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const params = useParams();

  return (
    <div>
      <nav className="top-left">
        <Link to={`/myNote/${params.subjectId}/${params.folderId}`}>
          <span className="back-arrow">← Back</span>
        </Link>
      </nav>
      <Form method="post" id="note-form">
        {data?.message && <p>{data.message}</p>}
        <p>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="add title"
            required
          />
        </p>
        <p>
          <label htmlFor="keywords">keywords</label>
          <textarea
            id="keywords"
            name="keyword"
            rows="3"
            placeholder="add word to highlight"
            required
          />
        </p>
        <p>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows="5"
            placeholder="write here"
            required
          />
        </p>
        <div className="form-actions">
          <button disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Note"}
          </button>
        </div>
      </Form>
    </div>
  );
}

export default NewNote;

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
