import { startServer } from "./server";
import { connect } from "./config/typeorm";

async function main() {
  connect();
  const port: number = 3001; //por ahora lo pusimos aqui, pero va en las variables de entorno
  const app = await startServer();
  app.listen(port);
  console.log("app is working at port " + port);
}

main(); //hasta aca esta el servidor http
