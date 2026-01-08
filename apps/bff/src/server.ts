import Fastify from "fastify";
import {
  UserSchema,
  UsersSchema,
  UserCreateSchema,
  UserUpdateSchema,
} from "@acme/contracts";
import { ZodError } from "zod";

const app = Fastify({ logger: true });

const UPSTREAM_BASE_URL =
  process.env.UPSTREAM_BASE_URL ?? "http://localhost:3002";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/health", async () => ({ ok: true }));

app.get("/api/users", async (_req, reply) => {
  await sleep(300);

  try {
    const res = await fetch(`${UPSTREAM_BASE_URL}/users`);

    if (!res.ok) {
      return reply.code(502).send({
        error: "UPSTREAM_ERROR",
        upstreamStatus: res.status,
      });
    }

    const json = await res.json();
    const users = UsersSchema.parse(json);

    return reply.send({ users });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.code(502).send({
        error: "UPSTREAM_INVALID_RESPONSE",
        issues: err.issues,
      });
    }

    return reply.code(500).send({ error: "INTERNAL_SERVER_ERROR" });
  }
});

app.get("/api/users/:id", async (req, reply) => {
  await sleep(200);

  const { id } = req.params as { id: string };

  try {
    const res = await fetch(`${UPSTREAM_BASE_URL}/users/${id}`);

    if (!res.ok) {
      return reply.code(502).send({
        error: "UPSTREAM_ERROR",
        upstreamStatus: res.status,
      });
    }

    const json = await res.json();
    const user = UserSchema.parse(json);

    return reply.send({ user });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.code(502).send({
        error: "UPSTREAM_INVALID_RESPONSE",
        issues: err.issues,
      });
    }

    return reply.code(500).send({ error: "INTERNAL_SERVER_ERROR" });
  }
});

app.post("/api/users", async (req, reply) => {
  await sleep(200);

  try {
    const body = UserCreateSchema.parse(req.body);

    const res = await fetch(`${UPSTREAM_BASE_URL}/users`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return reply.code(502).send({
        error: "UPSTREAM_ERROR",
        upstreamStatus: res.status,
      });
    }

    const json = await res.json();
    const user = UserSchema.parse(json);

    return reply.send({ user });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.code(400).send({
        error: "VALIDATION_ERROR",
        issues: err.issues,
      });
    }

    return reply.code(500).send({ error: "INTERNAL_SERVER_ERROR" });
  }
});

app.put("/api/users/:id", async (req, reply) => {
  await sleep(200);

  const { id } = req.params as { id: string };

  try {
    const body = UserUpdateSchema.parse(req.body);

    const res = await fetch(`${UPSTREAM_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });

    if (!res.ok) {
      return reply.code(502).send({
        error: "UPSTREAM_ERROR",
        upstreamStatus: res.status,
      });
    }

    const json = await res.json();
    const user = UserSchema.parse(json);

    return reply.send({ user });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.code(400).send({
        error: "VALIDATION_ERROR",
        issues: err.issues,
      });
    }

    return reply.code(500).send({ error: "INTERNAL_SERVER_ERROR" });
  }
});

app.delete("/api/users/:id", async (req, reply) => {
  await sleep(200);

  const { id } = req.params as { id: string };

  const res = await fetch(`${UPSTREAM_BASE_URL}/users/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    return reply.code(502).send({
      error: "UPSTREAM_ERROR",
      upstreamStatus: res.status,
    });
  }

  return reply.send({ ok: true });
});

const PORT = Number(process.env.PORT ?? 3001);

app.listen({ port: PORT, host: "0.0.0.0" }).catch(() => {
  process.exit(1);
});
