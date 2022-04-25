import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Author } from "./author.entity";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Book {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field(() => Author)
  @ManyToOne(() => Author, (author) => author.books, { onDelete: "CASCADE" })
  author!: Author;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: string;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  borrowedAt!: string;

  @Field()
  @Column({ type: "boolean", default: false })
  isBorrowed!: boolean;

  @Field()
  @Column({ default: "atLibrary" })
  borrowedTo!: string;
}
