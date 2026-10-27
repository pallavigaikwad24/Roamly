const { createClient } = require("redis");

// REDIS_HOST / REDIS_PORT / REDIS_PASSWORD are the names to use. The bare
// `host` / `password` fallbacks keep older .env files working.
const host = process.env.REDIS_HOST || process.env.host || "127.0.0.1";
const port = Number(process.env.REDIS_PORT || 6379);
const password = process.env.REDIS_PASSWORD || process.env.password || undefined;

const client = createClient({
    password,
    socket: {
        host,
        port,
        // Stop retrying after 10 attempts instead of reconnecting forever.
        reconnectStrategy: (retries) => (retries > 10 ? false : Math.min(retries * 200, 3000))
    }
});

// Without a listener, redis emits 'error' as an unhandled event and takes the
// process down. Log and carry on: the cache is an optimisation, not a
// dependency, so the API stays up when Redis is unreachable.
client.on("error", (err) => console.error("Redis connection error:", err.message));
client.on("connect", () => console.log(`Connected to Redis at ${host}:${port}`));

(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error("Redis unavailable, continuing without cache:", err.message);
    }
})();

module.exports = client;
