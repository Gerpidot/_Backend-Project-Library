//configuracion básica dle servidor
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express"; //se encarga de la api de graphQL, es el endpoint
import { buildSchema } from "type-graphql";
import { bookResolver } from "./resolvers/book.resolver";
import { authorResolver } from "./resolvers/author.resolver";
import { appendFile } from "fs";
import {  authResolver } from "./resolvers/auth.resolver";

export async function startServer() {
  const app = express();
  
    // console.log(app);
console.log("before apolloserver")
    const apolloServer = new ApolloServer({
      schema: await buildSchema({ resolvers: [bookResolver, authorResolver, authResolver] }),
      context: ({req,res})=>({req,res}),
    });
    console.log("after apolloserver")
    await apolloServer.start();

    apolloServer.applyMiddleware({
      app,
      path: "/graphql",
    });
    //console.log(app);
    return app;
  
}
