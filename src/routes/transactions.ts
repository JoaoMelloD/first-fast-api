import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "crypto";
export async function transactionRoutes(app: FastifyInstance) {
  // Criar uma transação
  app.post("/", async (request, reply) => {
    // Estou validando os valores que estão sendo passados na minha requisição para ver se cumprem oque é necessário
    // Para uma transação
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["debit", "credit"]),
    });

    // Desestruturação dos dados em variaveis separadas
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      type,
    });

    return reply.status(201).send();
  });

  app.get("/", async (request, reply) => {
    try {
      const transactions = await knex.select("*").from("transactions");
      return {
        success: true,
        data: transactions,
      };
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({
        success: false,
        message: "Erro Interno",
      });
    }
  });
}
