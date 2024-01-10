import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { Link } from "@remix-run/react";
import styles from "~/styles/subjectPage.css";
import folderIcon from "~/icons/Places-folder-blue-icon.png";
import addFolderIcon from "~/icons/Folder-Add-icon.png";
import React, { useState } from "react";
import { Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";

export async function action({ request }) {
  const user = await getUser(request);
  const form = await request.formData();
  const newFolderName = form.get("folderName");
  await db.subject.create({
    data: {
      name: newFolderName,
      userId: user.id,
    },
  });
  return redirect("/myNotes");
}

export default function MyNotePage() {
  const subjects = useLoaderData();
  return (
    <div className="container">
      <nav className="top-left">
        <Link to="/">
          <span className="back-arrow">← Back</span>
        </Link>
      </nav>
      <div className="subject-list">
        {!subjects ? (
          <p>You don't have any subjects. Please create a subject folder.</p>
        ) : (
          subjects.map((subject) => (
            <div key={subject.id} className="subject-item">
              <img src={folderIcon} alt="Folder Icon" className="folder-icon" />
              <Link className="subject-name" to={`/myNote/${subject.id}`}>{subject.name}</Link>
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

export const loader = async ({ request }) => {
  try {
    const user = await getUser(request);
    const subjects = await db.subject.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
    });
    if (!subjects || subjects.length === 0) {
      return null;
    }
    return subjects;
  } catch (error) {
    console.error("Loader Error:", error);
    throw error;
  }
};
export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
