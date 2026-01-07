import Fastify from "fastify";
import { UsersSchema, UserSchema } from "@acme/contracts";

const app = Fastify({
  logger: true,
});

// base URL для upstream (json-server)
const UPSTREAM_BASE_URL =
  process.env.UPSTREAM_BASE_URL ?? "http://localhost:3002";

// util: artificial delay (корисно для SWR practice)
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// healthcheck
app.get("/health", async () => {
  return { ok: true };
});

// GET /api/users
app.get("/api/users", async () => {
  // штучна затримка для loading / isValidating
  await sleep(300);

  const res = await fetch(`${UPSTREAM_BASE_URL}/users`);

  if (!res.ok) {
    app.log.error(
      { status: res.status },
      "Upstream /users request failed"
    );
    return {
      error: "UPSTREAM_ERROR",
      status: res.status,
    };
  }

  const json = await res.json();

  // runtime validation (ключовий момент BFF)
  const users = UsersSchema.parse(json);

  return { users };
});

// GET /api/users/:id
app.get("/api/users/:id", async (req) => {
  await sleep(200);

  const { id } = req.params as { id: string };

  const res = await fetch(`${UPSTREAM_BASE_URL}/users/${id}`);

  if (!res.ok) {
    app.log.error(
      { status: res.status, id },
      "Upstream /users/:id request failed"
    );
    return {
      error: "UPSTREAM_ERROR",
      status: res.status,
    };
  }

  const json = await res.json();

  const user = UserSchema.parse(json);

  return { user };
});

// start server
const PORT = Number(process.env.PORT ?? 3001);

app
  .listen({ port: PORT, host: "0.0.0.0" })
  .then(() => {
    app.log.info(`BFF running on http://localhost:${PORT}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
