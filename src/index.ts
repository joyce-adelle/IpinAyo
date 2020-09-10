import "reflect-metadata";
import { createConnection, Connection, getCustomRepository } from "typeorm";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { UserResolver } from './graphql/resolvers/User.resolver';
import { CategoryResolver } from './graphql/resolvers/Category.resolver';
import { CategoryRepository } from './db/repositories/CategoryRepository';
import { RelatedPhrasesRepository } from './db/repositories/RelatedPhrasesRepository';
import { RelatedPhrasesResolver } from './graphql/resolvers/RelatedPhrases.resolver';

var connection: Connection;

async function main() {
  connection = await createConnection();
  const schema = await buildSchema({
    resolvers: [UserResolver, CategoryResolver, RelatedPhrasesResolver],
  });
  const server = new ApolloServer({ schema, playground: true });
  await server.listen(4000);
  console.log("Server has started!");
//   let rep = getCustomRepository(RelatedPhrasesRepository);
//   try {
//   let c = await rep.deleteRelatedPhrase('2')
//   console.log(c)
// } catch (error) {
//     console.log(error.message)
// }
}

export function connected() {
  return typeof connection !== "undefined";
}

main();
