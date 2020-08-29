import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";

var connection: Connection;

async function main() {
  connection = await createConnection();
  const schema = await buildSchema({
    resolvers: [""],
  });
  const server = new ApolloServer({ schema });
  await server.listen(4000);
  console.log("Server has started!");
}

export function connected() {
  return typeof connection !== "undefined";
}

main();
