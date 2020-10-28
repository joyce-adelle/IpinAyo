import "reflect-metadata";
import {
  createConnection,
  Connection,
  getCustomRepository,
  useContainer,
} from "typeorm";
import { ApolloError, ApolloServer } from "apollo-server-express";
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
import * as jwt from "jsonwebtoken";
import * as Dotenv from "dotenv";
import { Container } from "typedi/Container";
import { AuthResolver } from "./graphql/resolvers/Authetication.resolver";
import { Context } from "vm";
import { UserInterface } from "./context/user.interface";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { MusicRepository } from "./db/repositories/MusicRepository";
import { UserRepository } from "./db/repositories/UserRepository";
// import { ConfirmUserResolver } from "./graphql/resolvers/ConfirmUser.resolver";
// import ConfirmationRoute from './confirmationRoute';
import router from './confirmationRoute';

var connection: Connection;

async function main() {
  useContainer(Container);

  connection = await createConnection();
  Dotenv.config();

  const context = ({ req }): Context => {
    //Get the jwt token from the header
    const authorization: string = req.headers.authorization || "";
    const authorizationSplit: string[] = authorization.split(" ");

    if (authorizationSplit[0].toLocaleLowerCase() !== "bearer") {
      return;
    }
    
    const token: string = authorizationSplit[1];
    let jwtPayload: string | any;

    if (!token) {
      return;
    }

    try {
      jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
      return {
        user: jwtPayload.user as UserInterface,
      };
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      CategoryResolver,
      RelatedPhrasesResolver,
      MusicResolver,
      AuthResolver,
      // ConfirmUserResolver,
    ],
    container: Container,
  });
  const server = new ApolloServer({
    schema,
    context,
    formatError: (
      error: GraphQLError
    ): GraphQLFormattedError<Record<string, any>> => {
      if (error instanceof ApolloError) {
        return error;
      }
      return error;
      // return new GraphQLError("Internal error");
    },
    engine: {
      reportSchema: true,
      // debugPrintReports: true,
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
  app.use(Express.urlencoded({ extended: false }));
  // app.use(router);

  app.listen(4000, () =>
    console.log("Server is running on http://localhost:4000/graphql")
  );

  //   let rep = getCustomRepository(UserRepository);
  //   try {
  //   let c = await rep.findDownloads("14");
  //   console.log(c)
  // } catch (error) {
  //     console.log(error.message)
  // }
}

export function connected() {
  return typeof connection !== "undefined";
}

main();
