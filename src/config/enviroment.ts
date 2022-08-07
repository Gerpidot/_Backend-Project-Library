import dotenv from "dotenv";

dotenv.config();
export const enviroment = {
  PORT: process.env.PORT,
  DB_HOST: process.env.HOST || "ec2-50-19-255-190.compute-1.amazonaws.com" ,
  DB_PORT: process.env.DB_PORT || 5432,
  DB_USERNAME: process.env.DB_USERNAME || "dsilpajocnuxrd",
  DB_PASSWORD: process.env.DB_PASSWORD || "cfa9884d29159fdec85bdea7f2a8c621af8bf6f9d39639a0efcd9ab6f6762931",
  DB_DATABASE: process.env.DB_DATABASE|| "dct3hfi4mb4b4c",
  JWT_SECRET: process.env.JWT_SECRET || "Default",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};
