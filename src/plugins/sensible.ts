import fp from "fastify-plugin";
import sensible, { FastifySensibleOptions } from "@fastify/sensible";

export default fp<FastifySensibleOptions>(async (fastify, opts) => {
  fastify.register(sensible, opts);
});
