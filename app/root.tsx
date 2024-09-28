import type { LinksFunction } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Form,
  Links,
  Meta,
  NavLink,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { asc, sql } from "drizzle-orm";
import { useEffect } from "react";
import appStylesHref from "./app.css?url";
import { db } from "./database/.client/db";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const contacts = await db.query.contact.findMany({
    where: q
      ? sql`${db.schema.contact.fts} @@ to_tsquery(${q
          .split(" ")
          .filter((word) => word.length > 0)
          .map((word) => word + ":*")
          .join(" | ")}
      )`
      : undefined,
    orderBy: asc(db.schema.contact.first),
  });

  return { contacts, q };
};

export const clientAction = async () => {
  return redirect(`/contacts/new/edit`);
};

export default function App() {
  const { contacts, q } = useLoaderData<typeof clientLoader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form
              id="search-form"
              role="search"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
            >
              <input
                id="q"
                aria-label="Search contacts"
                className={searching ? "loading" : ""}
                defaultValue={q || ""}
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive ? "active" : isPending ? "pending" : ""
                      }
                      to={`contacts/${contact.id}`}
                    >
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? <span>★</span> : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div
          className={
            navigation.state === "loading" && !searching ? "loading" : ""
          }
          id="detail"
        >
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
