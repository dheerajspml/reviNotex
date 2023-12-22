import { Link } from "@remix-run/react";
import homeStyles from "~/styles/home.css";
import mainNavigationStyle from "~/components/mainNavigation.css";
import MainNavigation from "~/components/MainNavigation";
import { getUser } from "~/utils/session.server";
import { useLoaderData } from "@remix-run/react";


export default function Index() {
  const user = useLoaderData();
  return (
    <main>
      <MainNavigation user={user} />
      <div id="content" className="centered-content">
        <h1 className="custom-h1">
          A better way of keeping track of your notes
        </h1>
        <p className="custom-p">
          Try this and never lose track of your notes again!
        </p>
      </div>
      <div className="footer">

      </div>
    </main>
  );
}

export const loader = async ({ request }) => {
  const user = await getUser(request); // Add await here
  if (!user) {
    return null;
  }
  return user;
};

export function links() {
  return [
    { rel: "stylesheet", href: homeStyles },
    { rel: "stylesheet", href: mainNavigationStyle },
 
   
  ];
}
