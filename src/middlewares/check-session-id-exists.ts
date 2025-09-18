import { FastifyReply, FastifyRequest } from "fastify";

export async function checkSessionIdExist(
  request: FastifyRequest,
  reply: FastifyReply
) {
  let sessionId = request.cookies.sessionId;
  if (!sessionId) {
    return reply.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
}
