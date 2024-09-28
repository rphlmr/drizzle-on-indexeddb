import { ClientActionFunctionArgs, redirect } from "@remix-run/react";
import { assert } from "comply";
import { eq } from "drizzle-orm";
import { db } from "~/database/.client/db";
import { guard } from "~/guard";

export const clientAction = async ({ params }: ClientActionFunctionArgs) => {
  assert(guard.policy("has valid params"), params);
  await db
    .delete(db.schema.contact)
    .where(eq(db.schema.contact.id, Number(params.contactId)));
  return redirect("/");
};
