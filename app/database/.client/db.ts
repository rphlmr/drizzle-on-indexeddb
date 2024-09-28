import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { PgDialect } from "drizzle-orm/pg-core/dialect";
import { drizzle } from "drizzle-orm/pglite";
import migrations from "./migrations/export.json";
import * as schema from "./schema";

const isDev = process.env.NODE_ENV === "development";

const dbName = isDev ? "remix-contacts-dev" : "remix-contacts";

// create the new local db if not already created
const client = await PGlite.create({
  dataDir: `idb://${dbName}`,
  extensions: { vector },
});

const _db = drizzle(client, {
  schema,
  logger: isDev,
});

// prevent multiple schema migrations to be run
let isLocalDBSchemaSynced = false;

if (!isLocalDBSchemaSynced) {
  const start = performance.now();
  try {
    // @ts-expect-error 🤷 don't know why db._.session is not a Session
    await new PgDialect().migrate(migrations, _db._.session, dbName);
    isLocalDBSchemaSynced = true;
    console.info(`✅ Local database ready in ${performance.now() - start}ms`);
  } catch (cause) {
    console.error("❌ Local database schema migration failed", cause);
    throw cause;
  }
}

const db = Object.assign(_db, {
  schema,
});

export { db };
