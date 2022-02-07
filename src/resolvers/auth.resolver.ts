import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { User } from "../entity/user.entity";
import { getRepository, Repository } from "typeorm";
import { IsEmail, Length } from "class-validator";
import { hash, compareSync } from "bcryptjs"; //hash solo trabaja de forma asincrona, tmb está hashsync
import { sign } from "jsonwebtoken";
import { enviroment } from "../config/enviroment";

@InputType()
class UserInput {
  @Field()
  @Length(3, 64)
  fullName!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(3, 254)
  password!: string;
}

@ObjectType()
class LoginResponse {
  @Field()
  userID!: number;

  @Field()
  jwt!: string;
}

@InputType()
class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}

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
        errores.message = "El email ya está en uso";
        throw errores;
      }
      const hashPassword = await hash(password, 10);

      const newUser = await this.authRepository.insert({
        fullName,
        email,
        password: hashPassword,
      });

      return await this.authRepository.findOne(newUser.identifiers[0].id);
    } catch (errores) {
      throw errores;
    }
  }

  @Mutation(() => LoginResponse)
  async login(@Arg("input", () => LoginInput) input: LoginInput) {
   try{
    const { email, password } = input;

    const userFound = await this.authRepository.findOne({ where: { email } });
    if (!userFound) {
      const error = new Error();
      error.message = "El email o la contraseña son incorrectos";
      throw error;
    }

    const isValidPassword = compareSync(password, userFound.password); //true or false compareSync compara de forma sincrona, la clave que paso el usuario y la clave hash de la base de datos
    if (!isValidPassword) {
      const error = new Error();
      error.message = "El email o la contraseña son incorrectos";
      throw error;
    }

    const jwt: string = sign({ id: userFound.id }, enviroment.JWT_SECRET);

    return {
      userID :userFound.id,
      jwt : jwt,
    };
   }catch(e){
    throw e//new  Error("El email o la contraseña son incorrectos")
   }
    
  }
}
