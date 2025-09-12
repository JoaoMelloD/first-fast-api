import { knex as setupKnext } from "knex";
export const knex = setupKnext({
  client: "sqlite",
  connection: {
    filename: "./tmp/app.db",
  },
});
