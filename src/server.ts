import Fastify from "fastify";
import { knex } from "./database";
import { env } from "./env";
import { transactionRoutes } from "./routes/transactions";
const app = Fastify();

app.register(transactionRoutes, {
  prefix: "transactions",
});
/**
 * Run the server!
 */
const start = async () => {
  try {
    await app.listen({ port: env.PORT });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
