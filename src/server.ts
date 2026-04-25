import fastify from "fastify";
import app from "./app";

const server = fastify({
  logger: true,
});

server.register(app);

const start = async () => {
  try {
    await server.listen({ port: 5000 });
    console.log("🚀 Server running on http://localhost:5000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
