import dotenv from "dotenv";

dotenv.config();
export const enviroment = {
  PORT: process.env.PORT,
  DB_HOST: "ec2-50-19-255-190.compute-1.amazonaws.com",
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  JWT_SECRET: process.env.JWT_SECRET || "Default",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};
