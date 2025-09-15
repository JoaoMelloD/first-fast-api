import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { success, z } from "zod";
import { randomUUID } from "crypto";
import { TransactionRepository } from "../repository/TransactionRepository";
export async function transactionRoutes(app: FastifyInstance) {
  const createTransactionBodySchema = z.object({
    title: z.string(),
    amount: z.number(),
    type: z.enum(["debit", "credit"]),
  });
  const repo = new TransactionRepository();
  const paramsSchema = z.object({
    id: z.string(),
  });
  // Criar uma transação
  app.post("/", async (request, reply) => {
    // Estou validando os valores que estão sendo passados na minha requisição para ver se cumprem oque é necessário
    // Para uma transação

    // Desestruturação dos dados em variaveis separadas
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    await repo.create(title, amount, type);
    return reply.status(201).send();
  });

  app.get("/", async (request, reply) => {
    try {
      const data = await repo.list();
      return {
        success: true,
        data: data,
      };
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({
        success: false,
        message: "Erro Interno",
      });
    }
  });

  app.put("/:id", async (request, reply) => {
    //id é uma string
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );
    try {
      const { id } = paramsSchema.parse(request.params);
      const data = repo.update(id, title, amount, type);
      return {
        success: true,
        data: data,
      };
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({
        success: false,
        message: "Erro Interno",
      });
    }
  });

  app.delete("/:id", async (request, reply) => {
    const { id } = paramsSchema.parse(request.params);
    const data = repo.delete(id);
    return {
      success: true,
      data: data,
    };
  });
}
