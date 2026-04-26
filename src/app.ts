import { join } from 'node:path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import cors from "@fastify/cors";

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {

}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // fastify.addHook("onRequest", async (request, reply) => {
  //   reply.header("Access-Control-Allow-Origin", "*");
  //   reply.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  //   reply.header("Access-Control-Allow-Headers", "Content-Type");

  //   if (request.method === "OPTIONS") {
  //     return reply.code(204).send();
  //   }
  // });

  await fastify.register(cors, {
    origin: '*',
    methods: ['GET', "POST", 'PATCH', "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })
}

export default app
export { app, options }
