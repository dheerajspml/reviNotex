import { Form, Link, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import styles from "~/styles/login.css"; // Adjust the path to your register stylesheet
import { db } from "~/utils/db.server";
import { register } from "~/utils/session.server";
import { redirect } from "@remix-run/node";
function badRequest(data) {
  return json(data, { status: 400 });
}
function validateUser(value) {
  return !value ? "Field is required" : "";
}

export const action = async ({ request }) => {
  try {
    const form = await request.formData();
    const email = form.get("email");
    const password = form.get("password");
    const username = form.get("username");
    const fields = { username, email, password };
    const fieldError = {
      email: validateUser(email),
      password: validateUser(password),
      username: validateUser(username),
    };
    if (Object.values(fieldError).some(Boolean)) {
      return badRequest({ fieldError, fields });
    }
    await register({ username, email, password });
    return redirect("/login");
  } catch (error) {
    console.error("Error in registration action:", error);
    return json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export default function RegisterPage() {
  const actionData = useActionData();

  return (
    <div className={styles.container}>
      <h1>Register</h1>
      <Form method="post">
        <label>
          UserName:
          <input type="username" name="username" required />
          {actionData?.fieldError?.username && (
            <div className={styles.error}>{actionData.fieldError.username}</div>
          )}
        </label>
        <label>
          Email:
          <input type="email" name="email" required />
          {actionData?.fieldError?.email && (
            <div className={styles.error}>{actionData.fieldError.email}</div>
          )}
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
          {actionData?.fieldError?.password && (
            <div className={styles.error}>{actionData.fieldError.password}</div>
          )}
        </label>
        <button type="submit">Register</button>
      </Form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
}
export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
