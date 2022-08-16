//configuracion básica del servidor
import "reflect-metadata";

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { bookResolver } from "./resolvers/book.resolver";
import { authorResolver } from "./resolvers/author.resolver";
import { authResolver } from "./resolvers/auth.resolver";
import { dailyControl, weeklySummary } from "./utils/sheduleTask";
export async function startServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [bookResolver, authorResolver, authResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
    //borrar los 4 siguiente o si no hacen que la ruta graphql sea visible en produccion
    debug: true,
  tracing: true,
  introspection: true,
  playground: true
  });

  await apolloServer.start();
  //ruta de confirmación
  app.get("/src/confirmation", async function (req: any, res) {
    const requestConfirmation = req.query.token;
    const email = req.query.email;

    const isActive = new authResolver();
    const input = { email: email, confirmationCode: requestConfirmation };
    const isActiveNow = await isActive.activeUser(input);
    if (!isActiveNow.status) {
      res.send(isActiveNow.errors);
      return;
    }
    res.write(
      "Cuenta Activada con exito...redireccionando (tendría que enviar al usuario al login del client)......"
    );

    res.end();
  });

  apolloServer.applyMiddleware({
    app,
    path: "/graphql",
  });

  app.get("/", (req,res)=>{res.send("Hello Word")})//prubas del deploy borrar
  //schedule task
  weeklySummary;
  dailyControl;
  
  return app;
}
