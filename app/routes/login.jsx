import { Form, Link, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import styles from "~/styles/login.css";
import { useActionData } from "@remix-run/react";
import { login, createUserSession } from "~/utils/session.server";

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
    const fields = { email, password };
    const fieldError = {
      email: validateUser(email),
      password: validateUser(password),
    };
    if (Object.values(fieldError).some(Boolean)) {
      return badRequest({ fieldError, fields });
    }

    const user = await login({ email, password });

    if (!user) {
      return badRequest({
        fieldError: {
          email: "Invalid credentials",
          password: "Invalid credentials",
        },
        fields,
      });
    }
    // Successfully logged in
    return createUserSession(user.id, "/");
  } catch (error) {
    console.error("Error in login action:", error);
    return json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export default function LoginPage() {
  const actionData = useActionData();
  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <Form method="post">
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
        <button type="submit">Login</button>
      </Form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
}
export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
