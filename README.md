# Welcome to Drizzle ORM + PGLite in the browser featuring Remix
- [Remix Docs](https://remix.run/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [PGLite Docs](https://pglite.dev/)

> [!IMPORTANT]
> This demo shows how to use Drizzle ORM + PGLite in the browser, thanks to Vite and Remix Run
> 
> If you are not familiar with Remix, please refer to their [docs](https://remix.run/docs).
> Some of the concepts used here are specific to Remix (e.g. `clientLoader`, `clientAction` and `.client/` folder).

> [!TIP]
> This app works 100% local-first with `clientLoader` and `clientAction`

## How it works

You define your Drizzle schema like you would do for a server-side only app.

> [!NOTE]  
> All our client-side code is in the `.client` folder, so you can mix server-side and client-side code as you like and still preserve a clear boundary between them.
> 
> 👉 [app/database/.client/schema.ts](app/database/.client/schema.ts)

You create a client with PGLite, setting the `dataDir` to `idb://{dbName}`.

PGLite will create a real Postgres database in your browser's IndexedDB. This is what powers [Drizzle Run](https://drizzle.run). Check out all their [extensions](https://pglite.dev/extensions/) 🔥

> [!NOTE]  
> 👉 [app/database/.client/db.ts](app/database/.client/db.ts)

> [!IMPORTANT]  
> This is where the magic happens

You can see a `"./migrations/export.json"` import.

This file is generated by running `npm run db:client:migration:export` (automatically run when you run `npm run db:migration:generate`) and is a compilation of all your Drizzle migrations in [app/database/.client/migrations](app/database/.client/migrations).

👉 [app/database/scripts/export-local-db-migrations.ts](app/database/scripts/export-local-db-migrations.ts)

**It a JSON export of all your SQL migrations.**

This file is loaded by Vite in dev mode and automatically fetched in production. Then it is applied to your local database as drizzle-kit migrate would do.

This migration happens in the module file (require top-level await / esm), so it is guaranteed to be applied before any queries are run.

Every time you change your schema, use `npm run db:migration:generate` to generate a new migration and its JSON export.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Generating a migration

```sh
npm run db:migration:generate
```

This will generate a new migration file in [app/database/.client/migrations](app/database/.client/migrations) and a JSON export in [app/database/.client/migrations/export.json](app/database/.client/migrations/export.json).

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/server`
- `build/client`
