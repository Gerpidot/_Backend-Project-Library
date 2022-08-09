import dotenv from "dotenv";

dotenv.config();
export const enviroment = {
  DATABASE_URL:process.env.DATABASE_URL,//url guardada en las variables de heroku
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  JWT_SECRET: process.env.JWT_SECRET || "Default",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SV_HOST:process.env.SV_HOST,
  SENDGRID_REGISTERED_EMAIL: process.env.SENDGRID_REGISTERED_EMAIL,
};
