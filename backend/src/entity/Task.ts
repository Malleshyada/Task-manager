import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

export type TaskStatus = "todo" | "in_progress" | "done";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "text", default: "todo" })
  status!: TaskStatus;

  @Column({ type: "date", nullable: true })
  dueDate!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}