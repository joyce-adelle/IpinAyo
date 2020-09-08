import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { MusicRepository } from "./db/repositories/MusicRepository";
import { CompositionType } from "./utilities/CompositionType";

var connection: Connection;

async function main() {
  connection = await createConnection();
  let rep = connection.getCustomRepository(MusicRepository);
  // const schema = await buildSchema({
  //   resolvers: [""],
  // });
  // const server = new ApolloServer({ schema });
  // await server.listen(4000);
  console.log("Server has started!");
  let c = await rep.findRelatedMusicIdsByQuery("Ehimanre christ")
  console.log(c);
}

export function connected() {
  return typeof connection !== "undefined";
}

main();
