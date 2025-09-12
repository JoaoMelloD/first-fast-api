import Fastify from "fastify";
import { knex } from "./database";

const app = Fastify();

app.get("/", async (request, reply) => {
  const tables = await knex("sqlite_schema").select("*");
  return tables;
});

/**
 * Run the server!
 */
const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
