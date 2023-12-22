import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import folderIcon from "~/icons/Places-folder-blue-icon.png";
import addFolderIcon from "~/icons/Folder-Add-icon.png";
import { Link } from "@remix-run/react";
import styles from "~/styles/subjectPage.css";
import { Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";

export async function action({ request, params }) {
  const form = await request.formData();
  const newFolderName = form.get("folderName");
  await db.folder.create({
    data: {
      name: newFolderName,
      subjectId: params.subjectId,
    },
  });
  return redirect(`/myNotes/${params.subjectId}`);
}

export default function SubjectPage() {
  const data = useLoaderData();
  const folders = data.folders;

  return (
    <div className="container">
      <nav className="top-left">
        <Link to="/myNotes">
          <span className="back-arrow">← Back</span>
        </Link>
      </nav>
      <div className="subject-list">
        {!folders ? (
          <p>You don't have any folders. Please add a folder.</p>
        ) : (
          folders.map((folder) => (
            <div key={folder.id} className="subject-item">
              <img src={folderIcon} alt="Folder Icon" className="folder-icon" />
              <Link to={folder.id}>{folder.name}</Link>
            </div>
          ))
        )}
        <div className="add-subject">
          <Form method="post">
            <input
              type="foldername"
              name="folderName"
              placeholder="folder name"
              required
            />
            <button type="submit">
              <img
                src={addFolderIcon}
                alt="Folder Icon"
                className="add-folder-icon"
              />
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export const loader = async ({ params }) => {
  try {
    const subjectId = params.subjectId; // Extract subjectId from params
    const folders = await db.folder.findMany({
      where: { subjectId: subjectId },
      select: { id: true, name: true },
    });
    if (!folders || folders.length === 0) {
      return { folders: null, subjectId: subjectId };
    }
    return { folders: folders, subjectId: subjectId };
  } catch (error) {
    console.error("Loader Error:", error);
    throw error;
  }
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
