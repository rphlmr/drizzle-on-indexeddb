import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { assert } from "comply";
import { eq } from "drizzle-orm";
import type { FunctionComponent } from "react";
import { db } from "~/database/.client/db";
import { guard } from "~/guard";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  assert(guard.policy("has valid params"), params);

  const contact = await db.query.contact.findFirst({
    where: eq(db.schema.contact.id, Number(params.contactId)),
  });

  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }

  return { contact };
};

export const clientAction = async ({
  params,
  request,
}: ClientActionFunctionArgs) => {
  assert(guard.policy("has valid params"), params);

  const formData = await request.formData();

  await db
    .update(db.schema.contact)
    .set({
      favorite: formData.get("favorite") === "true",
    })
    .where(eq(db.schema.contact.id, Number(params.contactId)));

  return null;
};

export default function Contact() {
  const { contact } = useLoaderData<typeof clientLoader>();

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar ?? undefined}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<typeof db.schema.contact.$inferSelect, "favorite">;
}> = ({ contact }) => {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};
