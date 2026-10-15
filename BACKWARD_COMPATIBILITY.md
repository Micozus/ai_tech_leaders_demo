# Backward compatibility contract

What this repository treats as a protected public surface, and the required path for changing it. Review skills (`om-code-review`, `om-auto-review-pr`) check diffs against this file; implementation skills warn when a change is not compliant. Generated from an inventory of the repository's actual surfaces — update this file in the same PR that changes one of them.

## 1. HTTP API (`apps/shell/src/server`)

Current surface, mounted in `src/server.ts`:

| Route        | Method | Request                                                                                    | Response                                                                                                              |
| ------------ | ------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `/api/tasks` | `GET`  | —                                                                                          | `200` JSON array of task records (`TaskRecord` — `id`, `title`, `createdAt`)                                          |
| `/api/tasks` | `POST` | JSON body `{ title: string }` (≤ `MAX_TASK_TITLE_LENGTH`, parsed by `parseCreateTaskBody`) | `201` created task record, or `400` `ValidationError` envelope `{ message, code?, fieldErrors? }` on an invalid title |

Error responses for `/api/*` are produced by the single `apiErrorHandler` middleware: non-`AppError` failures return a generic `500` with no stack trace.

**Breaking changes** (removing a field, renaming a route, narrowing an accepted request shape, changing a success status code, changing an error envelope shape) require:

- a documented reason in the PR body under "Decisions touched" or equivalent,
- the consuming side (the `Http<Concept>Api` client and any SSR `Server<Concept>Api` caller) updated in the same PR — this is a single-deployable app, so there is no separate external consumer to version against today,
- when this project grows external API consumers, a deprecation window and a version bump before removal.

**Additive, non-breaking:** a new route, a new optional request field, a new response field. No special process required beyond the normal review.

## 2. Database schema (`apps/shell/src/server/database`, `*.entity.ts`)

Schema is currently bootstrapped with MikroORM's `schema.update()` (see `.ai/docs/engineering-standards.md` §4, "Still open") rather than versioned migrations — there is no migration history to preserve yet, but the **shape** of each `EntitySchema` is still a contract for anything reading the table directly (seed scripts, ad-hoc queries, the repository layer).

Current entities: `Task` (table `tasks`: `id bigint PK autoincrement`, `title varchar(MAX_TASK_TITLE_LENGTH)`, `created_at timestamptz`).

**Breaking changes** (dropping/renaming a column or table, narrowing a column type, adding a `NOT NULL` column without a default) require:

- a stated rollback plan in the PR body,
- a data backfill plan when existing rows would violate a new constraint,
- once MikroORM migrations are introduced (tracked in `.ai/docs/engineering-standards.md`), an up/down migration pair and a migration test, per the `risk-high` → "Schema migrations" row in `SDLC.md`.

**Additive, non-breaking:** a new nullable column, a new table, a new index.

## 3. Library public exports (`libs/ui`, `libs/form-engine`)

Both libraries are consumed only inside this monorepo today via the path aliases `@org/ui` and `@org/form-engine` (`tsconfig.base.json`), re-exported through each library's `src/index.ts`. The exported surface is the contract — internal `src/lib/**` files are not.

Current exports:

- `@org/ui`: `CardComponent` (`libs/ui/src/lib/components/card/card.component.ts`).
- `@org/form-engine`: the form-config model (`form-config.model.ts`), `form-group.helper.ts`, and `FormRendererComponent`.

**Breaking changes** (removing an export, changing a component's `input()`/`output()` signature, changing the shape of an exported model/type) require:

- every in-repo consumer updated in the same PR (enforced in practice by the build and lint gate, since both libraries are only consumed internally),
- a note in the PR body when a change narrows an `@Input`/`@Output` contract, even though no external semver consumer exists yet.

**Additive, non-breaking:** a new export, a new optional input, a new component.

## 4. Configuration file formats

- `DATABASE_URL` (env var) — connection string shape is a MikroORM Postgres connection string; changing its expected format (e.g. requiring new query params) needs a note in the PR and a README/AGENTS.md update.
- `.ai/agentic.config.json` — the agent pipeline configuration schema (documented by the `om-setup-agent-pipeline` skill). A field rename or removal breaks every skill that reads it; re-run `om-setup-agent-pipeline` after a schema change.
- `openmercato.toml` — sandbox prepare/preview commands; treated as internal tooling config, not a public contract.

## 5. CLI / npm scripts (`package.json`)

`start`, `build`, `lint`, `test`, `test:coverage`, `e2e`, `integration`, `storybook`, `format` are relied on by CI (`.github/workflows/ci.yml`) and the agent pipeline's validation gate (`.ai/agentic.config.json`). Renaming or changing the meaning of one of these scripts is a breaking change to both; update the CI workflow and `.ai/agentic.config.json` validation commands in the same PR.

## Not yet applicable

No published events/webhooks exist in this repository today. Add a section here the first time one ships.
