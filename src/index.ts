import "reflect-metadata";
import { createConnection, Connection, getCustomRepository } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./graphql/resolvers/User.resolver";
import { CategoryResolver } from "./graphql/resolvers/Category.resolver";
import { CategoryRepository } from "./db/repositories/CategoryRepository";
import { RelatedPhrasesRepository } from "./db/repositories/RelatedPhrasesRepository";
import { RelatedPhrasesResolver } from "./graphql/resolvers/RelatedPhrases.resolver";
import { MusicResolver } from "./graphql/resolvers/Music.resolver";
import * as Express from "express";
import * as Cors from "cors";
import * as Path from "path";
import * as Dotenv from "dotenv";

var connection: Connection;

async function main() {
  connection = await createConnection();
  Dotenv.config();
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      CategoryResolver,
      RelatedPhrasesResolver,
      MusicResolver,
    ],
  });
  const server = new ApolloServer({
    schema,
    engine: {
      reportSchema: true,
      debugPrintReports: true,
    },
  });
  const app = Express();
  server.applyMiddleware({ app });

  app.use(Cors());
  app.use(
    "/music/audio",
    Express.static(Path.join(__dirname, "../public/audios"))
  );
  app.use(
    "/music/score",
    Express.static(Path.join(__dirname, "../public/scores"))
  );
  // app.use(Express.urlencoded({ extended: false }));

  app.listen(4000, () =>
    console.log("Server is running on http://localhost:4000/graphql")
  );

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
