import {
  test,
  expect,
  beforeAll,
  afterAll,
  describe,
  beforeEach,
} from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "node:child_process";
describe("Transactions routes", () => {
  //posso executar um codigo antes que todos os testes executem
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback -all");
    execSync("npm run knex migrate:latest");
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

  test("user can list transaction", async () => {
    // fazer a chamada http para criar uma nova transação e gerar o token para dai sim poder listar.

    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "nova transação",
        amount: 500,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies!)
      .expect(201);

    expect(listTransactionsResponse.body.data).toEqual([
      expect.objectContaining({
        title: "nova transação",
        amount: 500,
      }),
    ]);
  });

  test("should be able to get a especific transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "nova transação",
        amount: 500,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")

      .set("Cookie", cookies!)

      .expect(201);

    const transactionId = listTransactionsResponse.body.data[0].id;
    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies!);
    expect(getTransactionResponse.body.data).toEqual(
      expect.objectContaining({
        title: "nova transação",
        amount: 500,
      })
    );
  });

  test("should be able to get to summary", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Credit Transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies!)
      .send({
        title: "Debit Transaction",
        amount: 2000,
        type: "debit",
      });

    const summaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies!)
      .expect(201);

    expect(summaryResponse.body.data).toEqual([
      {
        amount: 3000,
      },
    ]);
  });
});
