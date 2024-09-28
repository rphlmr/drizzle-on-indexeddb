import { sql, SQL } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

const tsVector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const contact = pgTable(
  "contact",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    first: text("first"),
    last: text("last"),
    avatar: text("avatar"),
    twitter: text("twitter"),
    notes: text("notes"),
    favorite: boolean("favorite"),
    fts: tsVector("fts").generatedAlwaysAs(
      (): SQL =>
        sql`to_tsvector('english',coalesce(${contact.first}, '') || ' ' || coalesce(${contact.last}, ''))`
    ),
  },
  (t) => ({
    searchIdx: index("contact_search_index").using("gin", t.fts),
  })
);
