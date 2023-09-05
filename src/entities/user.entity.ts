import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import Post from "./post.entity";
import bcrypt from "bcryptjs";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  username!: string;

  @Column({
    type: "varchar",
    unique: true,
    nullable: false,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value) => value,
    },
  })
  email!: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  password!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Define a one-to-many relationship with BlogPosts
  @OneToMany(() => Post, (Post) => Post.author)
  Posts!: Post[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
  }
}
