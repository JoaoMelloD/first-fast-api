import { knex } from "../database";
import { randomUUID } from "node:crypto";
export class TransactionRepository {
  async create(
    title: string,
    amount: number,
    type: "debit" | "credit",
    sessionId: string
  ) {
    return await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      type,
      session_id: sessionId,
    });
  }
  async getOneTransaction(id: string, sessionId: string) {
    return knex("transactions")
      .where("id", id)
      .where("session_id", sessionId)
      .first();
  }
  async list(sessionId: string) {
    return await knex("transactions").where("session_id", sessionId).select();
  }

  async summaryAmount(sessionId: string) {
    return await knex("transactions")
      .sum("amount", { as: "amount" })
      .where("session_id", sessionId);
  }
  async update(
    id: string,
    sessionId: string,
    title?: string,
    amount?: number,
    type?: "debit" | "credit"
  ) {
    return await knex("transactions")
      .where("id", id)
      .update({
        title,
        amount,
        type,
      })
      .where("session_id", sessionId);
  }

  async delete(id: string, sessionId: string) {
    return await knex("transactions")
      .where("id", id)
      .where("session_id", sessionId)
      .del();
  }
}
