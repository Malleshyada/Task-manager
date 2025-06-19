import express from "express";
import { createConnection, getRepository } from "typeorm";
import cors from "cors";
import { Task, TaskStatus } from "./entity/Task";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Log DATABASE_URL for debugging
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);

// Initialize database connection
let connectionPromise: Promise<void>;

createConnection({
  type: "sqlite",
  database: process.env.DATABASE_URL || path.resolve(__dirname, "database.sqlite"),
  entities: [Task],
  synchronize: true
}).then(() => {
  console.log("Database connected");
  connectionPromise = Promise.resolve();
}).catch(error => {
  console.error("Database connection error:", error);
  process.exit(1);
});

// GET /tasks
app.get("/tasks", async (req, res) => {
  await connectionPromise;
  const taskRepository = getRepository(Task);
  const tasks = await taskRepository.find();
  res.json(tasks);
});

// POST /tasks
app.post("/tasks", async (req, res) => {
  await connectionPromise;
  const { title, description, status, dueDate } = req.body;
  if (!title || !status) {
    return res.status(400).json({ error: "Title and status are required" });
  }
  const validStatuses: TaskStatus[] = ["todo", "in_progress", "done"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const taskRepository = getRepository(Task);
  const taskData: Partial<Task> = {
    title,
    description,
    status,
    dueDate: dueDate ? new Date(dueDate) : null
  };
  const task = taskRepository.create(taskData as Task);
  await taskRepository.save(task);
  res.status(201).json(task);
});

// PUT /tasks/:id
app.put("/tasks/:id", async (req, res) => {
  await connectionPromise;
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;
  const validStatuses: TaskStatus[] = ["todo", "in_progress", "done"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const taskRepository = getRepository(Task);
  const task = await taskRepository.findOne({ where: { id } });
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;
  task.dueDate = dueDate ? new Date(dueDate) : null;
  await taskRepository.save(task);
  res.json(task);
});

// DELETE /tasks/:id
app.delete("/tasks/:id", async (req, res) => {
  await connectionPromise;
  const { id } = req.params;
  const taskRepository = getRepository(Task);
  const task = await taskRepository.findOne({ where: { id } });
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  await taskRepository.remove(task);
  res.status(204).send();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));