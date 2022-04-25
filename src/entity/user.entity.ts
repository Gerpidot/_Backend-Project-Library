import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  
} from "typeorm";

import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  fullName!: string;

  @Field(() => String)
  @Column()
  email!: string;

  @Field(() => String)
  @Column()
  password!: string;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: string;

  @Field()
  @Column({ type: "boolean", default: false })
  isActive!: boolean;

  @Field(() => String)
  @Column({ default: 0 })
  confirmationCode!: string;
}
