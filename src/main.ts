import { startServer } from "./server";
import { connect } from "./config/typeorm";
import dotenv from "dotenv";
import { enviroment } from "./config/enviroment";

async function main() {
  dotenv.config();

 connect(); //Reactivar el conect luego pruebas del deploy
  const port: number = Number(enviroment.PORT) || 8080 ; 
  const app = await startServer();
  app.listen(port); //si quisiera hacerlo en la lan despues del port, coloco el ipv4
  console.log("app is working at port " + port);
}

main(); //hasta aca esta el servidor http
