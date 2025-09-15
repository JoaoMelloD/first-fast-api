import { knex } from "../database";
import { randomUUID } from "node:crypto";
export class TransactionRepository {
  async create(title: string, amount: number, type: "debit" | "credit") {
    return await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      type,
    });
  }

  async list() {
    return await knex.select("*").from("transactions");
  }

  async update(
    id: string,
    title?: string,
    amount?: number,
    type?: "debit" | "credit"
  ) {
    return await knex("transactions").where("id", id).update({
      title,
      amount,
      type,
    });
  }

  async delete(id: string) {
    return await knex("transactions").where("id", id).del();
  }
}
