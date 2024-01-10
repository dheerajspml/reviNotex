import { Link, useParams } from "@remix-run/react";
import homeStyles from "~/styles/home.css";
import mainNavigationStyle from "~/components/mainNavigation.css";
import MainNavigation from "~/components/MainNavigation";
import { getUser } from "~/utils/session.server";
import { useLoaderData } from "@remix-run/react";
import { useSearchParams } from "@remix-run/react";


export default function Index() {

  const data = useLoaderData();
  const user=data.user
  const searchTerm=data.searchTerm
 
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
      <div className="search-container">
      <form action='/search' >
          <input type="text" name="q" placeholder="Search..." defaultValue={searchTerm}/>
          <button type="submit">Search</button>
        </form>
      </div>
    </main>
  );
}
export const loader = async ({ request }) => {
  const { query: searchTerm } = Object.fromEntries(
    new URL(request.url).searchParams
  );
  const user = await getUser(request);
  if (!user) {
    return null;
  }
  
  return {
    user:user,
    searchTerm:searchTerm ||"",

  };
};
export function links() {
  return [
    { rel: "stylesheet", href: homeStyles },
    { rel: "stylesheet", href: mainNavigationStyle },
  ];
}