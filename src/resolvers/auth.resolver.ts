import { Arg, Mutation, Resolver, Query } from "type-graphql";
import { User } from "../entity/user.entity";
import { getRepository, Repository } from "typeorm";
import { hash, compareSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { enviroment } from "../config/enviroment";
import generarPassword from "../utils/passwordGenerator";
import { sendMailAtRegister, sendMailAtForgot } from "../utils/sendGridConfig";
import {
  ActivateInput,
  LoginInput,
  LoginResponse,
  UserInput,
  RecoverPassInput,
} from "../DTO/auth.input.type";

@Resolver()
export class authResolver {
  authRepository: Repository<User>;

  constructor() {
    this.authRepository = getRepository(User);
  }

  @Mutation(() => User)
  async register(
    @Arg("input", () => UserInput) input: UserInput
  ): Promise<User | undefined> {
    const { fullName, email, password } = input;
    try {
      const userExist = await this.authRepository.findOne({ where: { email } });
      if (userExist) {
        const errores = new Error();
        errores.message = "This email is already in use";
        throw errores;
      }
      const hashPassword = await hash(password, 10);
      const confirmation = generarPassword(); //create a code, will send it to user email
      const hashConfirmation = await hash(confirmation, 10);
      const newUser = await this.authRepository.insert({
        fullName,
        email,
        password: hashPassword,
        confirmationCode: hashConfirmation,
      });

      sendMailAtRegister(email, password, fullName, confirmation);

      return await this.authRepository.findOne(newUser.identifiers[0].id);
    } catch (errores) {
      throw errores;
    }
  }

  @Mutation(() => LoginResponse)
  async login(@Arg("input", () => LoginInput) input: LoginInput) {
    try {
      const { email, password } = input;

      const userFound = await this.authRepository.findOne({ where: { email } });
      if (!userFound) {
        const error = new Error();
        error.message = "Email or password are wrong";
        throw error;
      }
      if (!userFound.isActive) {
        const error = new Error();
        error.message = "Pending Account. Please Verify Your Email!";
        throw error;
      }

      const isValidPassword = compareSync(password, userFound.password); //true or false compareSync compara de forma sincrona, la clave que paso el usuario y la clave hash de la base de datos
      if (!isValidPassword) {
        const error = new Error();
        error.message = "Email or password are wrong";
        throw error;
      }

      const jwt: string = sign({ id: userFound.id }, enviroment.JWT_SECRET);

      return {
        userID: userFound.id,
        jwt: jwt,
      };
    } catch (e) {
      throw e;
    }
  }

  @Mutation(() => LoginResponse)
  async forgotPassword(
    @Arg("input", () => RecoverPassInput) input: RecoverPassInput
  ): Promise<User | undefined> {
    try {
      const { email } = input;

      const userFound = await this.authRepository.findOne({ where: { email } });

      if (!userFound) {
        const error = new Error();
        error.message = "No se encontró el usuario";
        throw error;
      }
      /*Código para contactar el servicio de algún provedor de gestión de mails, para enviar
        un no-reply@email con un nuevo password, tambien se haría un update de la base de
        datos con el nuevo password para el user. Done :) me costó banda*/
      const newPassword = generarPassword();
      const hashNewPassword = await hash(newPassword, 10);

      await this.authRepository.update(userFound.id, {
        password: hashNewPassword,
      });
      sendMailAtForgot(userFound.email, newPassword, userFound.fullName,enviroment.SENDGRID_REGISTERED_EMAIL);

      return await this.authRepository.findOne(userFound.id);
    } catch (e) {
      throw e;
    }
  }

  @Mutation(() => LoginResponse)
  async activeUser(@Arg("input", () => ActivateInput) input: ActivateInput) {
    try {
      const { email, confirmationCode } = input;

      const userFound = await this.authRepository.findOne({ where: { email } });
      if (!userFound) {
        return {
          errors: "Account does not exist",
          status: false,
          data: null,
        };
      }
      if (userFound.isActive) {
        return {
          errors: "Account was already activated",
          status: false,
          data: null,
        };
      }

      const isValidCode = compareSync(
        confirmationCode,
        userFound.confirmationCode
      ); //true or false compareSync compara el código de confirmacion del link enviado al usuario con el codigo hash almacenado en la base

      if (!isValidCode) {
        return {
          errors: "Invalid activation code",
          status: false,
          data: null,
        };
      }

      await this.authRepository.update(userFound.id, {
        isActive: true,
        confirmationCode: "",
      });

      return { status: true };
    } catch (e) {
      throw e;
    }
  }

  //used by scheduleTask
  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.authRepository.find();
    } catch (error) {
      throw error;
    }
  }
}
