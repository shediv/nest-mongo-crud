import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Task } from './task.model';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { ErrorConstants } from '../constants/error.constant';

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
        // Check if Task by ID already exist
        const task = await this.findTask(id);
        return task;
    }

    async getAllTasks() {
        const tasks = await this.taskModel.find({ }).exec();
        return tasks;
    }

    async getTasksWithFilters(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { search, start, limit, sortBy } = filterDto;
        const tasks = await this.taskModel.aggregate(
                        [
                            { $match: { $text: { $search: search || '' } } },
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
            task = await this.taskModel.findOne({_id: id }).exec();
        } catch (error) {
          throw new NotFoundException(ErrorConstants.NO_TASK_FOUND);
        }
        if (!task || task.length < 1) {
          throw new NotFoundException(ErrorConstants.NO_TASK_FOUND);
        }
        return task;
    }

    async deleteTaskById(id: string): Promise<any> {
        const result = await this.taskModel.deleteOne({_id: id}).exec();
        if (result.n === 0) {
            throw new NotFoundException(ErrorConstants.NO_TASK_FOUND);
        }
        return result;
    }

    async deleteMultipleTasksByIds(ids: any): Promise<any> {
        // Find unique taskId and typecast to mongo objectId
        let uniqueIds: any = [...new Set(ids)];
        const result = await this.taskModel.remove({_id: { $in: [uniqueIds]}}).exec();
        if (result.n === 0) {
            throw new NotFoundException(ErrorConstants.NO_TASK_FOUND);
        }
        return result;
    }

    async updateTask(updateTaskDto: any): Promise<Task> {
        // Check if Task by ID already exist
        const taskUpdateData = await this.findTask(updateTaskDto.id);

        // Update task values
        if(updateTaskDto.title) taskUpdateData.title = updateTaskDto.title;
        if(updateTaskDto.description) taskUpdateData.description = updateTaskDto.description;
        if(updateTaskDto.target_date) taskUpdateData.target_date = updateTaskDto.target_date;
        if(updateTaskDto.status) taskUpdateData.status = updateTaskDto.status;

        const result = await taskUpdateData.save();
        return result;
    }
}
