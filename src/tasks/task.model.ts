import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  media: { type: String, required: true },
  target_date: { type: Date, required: true },
  status: { type: String, required: true },
});

export interface Task extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  media: string;
  target_date: string;
  status: TaskStatus;
}

export enum TaskStatus {
    TODO = 'Todo',
    IN_PROGRESS = 'In-progress',
    DONE = 'DONE'
}