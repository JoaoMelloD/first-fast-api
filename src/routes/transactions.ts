import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { success, z } from "zod";
import { randomUUID } from "crypto";
import { TransactionRepository } from "../repository/TransactionRepository";
import { checkSessionIdExist } from "../middlewares/check-session-id-exists";
export async function transactionRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, response) => {});
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

      let sessionId = request.cookies.sessionId;

      if (!sessionId) {
        sessionId = randomUUID();

        reply.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, //7 Days
        });
      }
      const data = await repo.create(title, amount, type, sessionId);

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

  app.get(
    "/",
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      try {
        const sessionId = request.cookies.sessionId;

        if (!sessionId) {
          return reply.status(401).send({
            success: false,
            message: "Unauthorized",
          });
        }

        const data = await repo.list(sessionId);
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
    }
  );

  app.get(
    "/:id",

    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      try {
        const sessionId = request.cookies.sessionId;
        const { id } = paramsSchema.parse(request.params);

        const data = await repo.getOneTransaction(id, sessionId!);
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
    }
  );

  app.get(
    "/summary",
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId;
      const data = await repo.summaryAmount(sessionId!);
      return reply.status(201).send({
        success: true,
        data: data,
      });
    }
  );

  app.put(
    "/:id",
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      try {
        const sessionId = request.cookies.sessionId;
        //id é uma string
        const { title, amount, type } = createTransactionBodySchema.parse(
          request.body
        );
        const { id } = paramsSchema.parse(request.params);
        const data = repo.update(id, sessionId!, title, amount, type);
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
    }
  );

  app.delete(
    "/:id",
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      try {
        const sessionId = request.cookies.sessionId;
        const { id } = paramsSchema.parse(request.params);
        const data = repo.delete(id, sessionId!);
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
    }
  );
}
