import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./user.entity";

@Entity()
export default class Post extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  title!: string;

  @Column({
    type: "text",
  })
  content!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Define a many-to-one relationship with User (author)
  @ManyToOne(() => User, (user) => user.Posts)
  author!: User;
}
