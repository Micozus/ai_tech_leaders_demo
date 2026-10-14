# Integration/SSR runs need NG_ALLOWED_HOSTS and Chrome system libraries

Context: booting the built SSR server for black-box tests.

Root cause: Angular SSR rejects unknown `Host` headers and silently falls back to client-side rendering ("Header host ... is not allowed"), so server-rendered assertions fail. Separately, `agent-browser` cannot start Chrome on a bare Linux image (missing `libnspr4` etc.).

Fix / rule: `apps/shell-integration` sets `NG_ALLOWED_HOSTS=127.0.0.1,localhost` for the spawned server (production deployments need the same setting). Run `npx agent-browser install --with-deps` once per machine / CI job. Locally without Docker, set `INTEGRATION_DATABASE_URL` to a disposable database.
