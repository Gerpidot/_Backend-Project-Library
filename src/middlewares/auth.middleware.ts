import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Response, Request } from "express";
import { enviroment } from "../config/enviroment";

export interface IContext {
  req: Request;
  res: Response;
  payLoad: {
    userId: string;
  };
}

export const isAuth: MiddlewareFn<IContext> = ({ context }, next) => {
  try {
    const bearerTokken = context.req.headers["authorization"];
    if (!bearerTokken) {
      throw new Error("Unauthorized");
    }
    const jwt = bearerTokken.split(" ")[1];
    const payLoad = verify(jwt, enviroment.JWT_SECRET);
    context.payLoad = payLoad as any;
  } catch (error) {
      throw new Error("No autorizado")
  }

  return next();
};
