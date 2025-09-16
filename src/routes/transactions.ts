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
    id: z.string().uuid(),
  });
  // Criar uma transação
  app.post("/", async (request, reply) => {
    try {
      const { title, amount, type } = createTransactionBodySchema.parse(
        request.body
      );
      const data = await repo.create(title, amount, type);
      return reply.status(201).send({
        success: true,
        data: data,
      });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({
        success: false,
        message: "Erro Interno",
      });
    }
  });

  app.get("/", async (request, reply) => {
    try {
      const data = await repo.list();
      return reply.status(201).send({
        success: true,
        data: data,
      });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({
        success: false,
        message: "Erro Interno",
      });
    }
  });

  app.get("/:id", async (request, reply) => {
    try {
      const { id } = paramsSchema.parse(request.params);
      const data = await repo.getOneTransaction(id);
      return reply.status(201).send({
        success: true,
        data: data,
      });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({
        success: false,
        message: "Erro Interno",
      });
    }
  });

  app.get("/summary", async (request, reply) => {
    const data = await repo.summaryAmount();
    return reply.status(201).send({
      success: true,
      data: data,
    });
  });

  app.put("/:id", async (request, reply) => {
    try {
      //id é uma string
      const { title, amount, type } = createTransactionBodySchema.parse(
        request.body
      );
      const { id } = paramsSchema.parse(request.params);
      const data = repo.update(id, title, amount, type);
      return reply.status(201).send({
        success: true,
        data: data,
      });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({
        success: false,
        message: "Erro Interno",
      });
    }
  });

  app.delete("/:id", async (request, reply) => {
    try {
      const { id } = paramsSchema.parse(request.params);
      const data = repo.delete(id);
      return reply.status(201).send({
        success: true,
        data: data,
      });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({
        success: false,
        message: "Erro Interno",
      });
    }
  });
}
