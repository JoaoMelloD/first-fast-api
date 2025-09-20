import { test, expect, beforeAll, afterAll } from "vitest";
import { app } from "../src/app";
import request from "supertest";

//posso executar um codigo antes que todos os testes executem
beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});
test("user can create a new transaction", async () => {
  // fazer a chamada http para criar uma nova transação.
  await request(app.server)
    .post("/transactions")
    .send({
      title: "nova transação",
      amount: 500,
      type: "credit",
    })
    .expect(201);
});
