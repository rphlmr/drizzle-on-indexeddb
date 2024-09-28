import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  redirect,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { assert, matchSchema } from "comply";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { db } from "~/database/.client/db";
import { guard } from "~/guard";

const emptyContact = {
  id: undefined,
  avatar: "",
  first: "",
  last: "",
  twitter: "",
  notes: "",
} satisfies typeof db.schema.contact.$inferInsert & { id: undefined };

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  assert(guard.policy("has valid params"), params);

  if (params.contactId === "new") {
    return {
      contact: emptyContact,
    };
  }

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
  const payload = Object.fromEntries(formData) as unknown;

  assert(
    "has expected payload",
    matchSchema(
      createInsertSchema(db.schema.contact).omit({ fts: true, id: true })
    ),
    payload
  );

  if (params.contactId === "new") {
    const [{ contactId }] = await db
      .insert(db.schema.contact)
      .values(payload)
      .returning({ contactId: db.schema.contact.id });

    return redirect(`/contacts/${contactId}`);
  }

  await db
    .update(db.schema.contact)
    .set(payload)
    .where(eq(db.schema.contact.id, Number(params.contactId)));

  return redirect(`/contacts/${params.contactId}`);
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          defaultValue={contact.first ?? undefined}
          aria-label="First name"
          name="first"
          type="text"
          placeholder="First"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last ?? undefined}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter ?? undefined}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar ?? undefined}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          defaultValue={contact.notes ?? undefined}
          name="notes"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
