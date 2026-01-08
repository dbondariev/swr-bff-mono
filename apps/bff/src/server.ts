import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// Enable CORS for all routes
fastify.addHook('onRequest', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://swr-bff-mono.vercel.app' : 'http://localhost:5173');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  reply.header('Access-Control-Allow-Credentials', 'true');

  if (request.method === 'OPTIONS') {
    return reply.code(200).send();
  }
});

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3002';

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Get all users
fastify.get('/api/users', async (request, reply) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
      return reply.status(response.status).send({ error: 'Failed to fetch users' });
    }

    return await response.json();
  } catch (error) {
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// Get user by ID
fastify.get('/api/users/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const response = await fetch(`${API_BASE_URL}/users/${id}`);

    if (!response.ok) {
      return reply.status(response.status).send({ error: 'User not found' });
    }

    return await response.json();
  } catch (error) {
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// Create user
fastify.post('/api/users', async (request, reply) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.body)
    });

    if (!response.ok) {
      return reply.status(response.status).send({ error: 'Failed to create user' });
    }

    const user = await response.json();
    return reply.status(201).send(user);
  } catch (error) {
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// Update user
fastify.put('/api/users/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.body)
    });

    if (!response.ok) {
      return reply.status(response.status).send({ error: 'Failed to update user' });
    }

    return await response.json();
  } catch (error) {
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// Delete user
fastify.delete('/api/users/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      return reply.status(response.status).send({ error: 'Failed to delete user' });
    }

    return reply.status(204).send();
  } catch (error) {
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// Start the server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`BFF Server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
