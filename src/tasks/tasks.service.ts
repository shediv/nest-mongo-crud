import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Task, TaskStatus } from './task.model';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

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
            status,
            isActive: true
          });
          const result = await newTask.save();
          return result;
    }

    async getTaskById(id: string): Promise<Task> {
        const task = await this.findTask(id);
        return task;
    }

    async getAllTasks() {
        const tasks = await this.taskModel.find({ isActive: true }).exec();
        return tasks;
    }

    async getTasksWithFilters(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { search, start, limit, sortBy } = filterDto;
        const tasks = await this.taskModel.aggregate(
                        [
                            { $match: { $text: { $search: search || '' }, isActive: true } },
                            { $skip: parseInt(start) || 0 },
                            { $limit: parseInt(limit) || 20 },
                            { $sort : { target_date : parseInt(sortBy) || 1 } }
                        ]
                    ).exec();
        return tasks;
    }

    private async findTask(id: string): Promise<Task> {
        let task;
        try {
            task = await this.taskModel.find({_id: id, isActive: true }).exec();
        } catch (error) {
          throw new NotFoundException('Could not find task.');
        }
        if (!task || task.length < 1) {
          throw new NotFoundException('Could not find task.');
        }
        return task;
    }
}
