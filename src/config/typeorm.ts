import { createConnection } from "typeorm"; //este metodo me permite crear una aplicacion a la que le voy a decir donde conectarce user pass etc
import path from "path";
import { enviroment } from "./enviroment";

export async function connect() {
  await createConnection({
    type: "postgres",
    port: Number(enviroment.DB_PORT),
    username: "german",
    password: "12345",
    database: "Biblioteca",
    entities: [path.join(__dirname, "../entity/**/**.ts")],
    synchronize: true,
    
  });
  
  console.log("Database is runnig perfectly :D");
}
