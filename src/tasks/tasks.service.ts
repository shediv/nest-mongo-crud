import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Task, TaskStatus } from './task.model';
// import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel('Task') private readonly taskModel: Model<Task>,
    ) {}

    async createTask(createTaskDto: any): Promise<Task> {
        const { title, description, media, target_date, status } = createTaskDto;
        const newTask = new this.taskModel({
            title,
            description,
            media,
            target_date: new Date(target_date),
            status
          });
          const result = await newTask.save();
          return result;
    }
}
