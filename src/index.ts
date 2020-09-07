import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { MusicRepository } from "./db/repositories/MusicRepository";
import { CompositionType } from "./utilities/CompositionType";
import { UserRepository } from './db/repositories/UserRepository';

var connection: Connection;

async function main() {
  connection = await createConnection();
  let rep = connection.getCustomRepository(UserRepository);
  // const schema = await buildSchema({
  //   resolvers: [""],
  // });
  // const server = new ApolloServer({ schema });
  // await server.listen(4000);
  console.log("Server has started!");
  let c = await rep.allUsers();
  console.log(c);
}

export function connected() {
  return typeof connection !== "undefined";
}

main();
