import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from  'multer';
import { extname } from  'path';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { ErrorConstants } from '../constants/error.constant';

@Controller('tasks')
export class TasksController {
    constructor (private tasksService: TasksService) {}

    @Post()
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('media',
            {
                storage: diskStorage({
                destination: './uploads', 
                filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                return cb(null, `${randomName}${extname(file.originalname)}`)
                }
                })
            }
        )
    )
    createTask(@UploadedFile() media: Express.Multer.File, @Body() createTaskDto: CreateTaskDto) {
        if (!media || Object.keys(createTaskDto).length != 4) {
            throw new BadRequestException(ErrorConstants.CREATE_REQ_FIELD_ERROR);
        }
        let taskdata = {
            title: createTaskDto.title,
            description: createTaskDto.description,
            target_date: createTaskDto.target_date,
            status: createTaskDto.status,
            media: `${media.destination}/${media.filename}`
        };
        taskdata.media = `${media.destination}/${media.filename}`
        return this.tasksService.createTask(taskdata);
    }

    @Get()
    async getTasks(
        @Query(ValidationPipe) filterDto: GetTaskFilterDto
    ) {
        if(filterDto && Object.keys(filterDto).length) {
            const tasks = await this.tasksService.getTasksWithFilters(filterDto);
            return tasks;
        } else {
            const tasks = await this.tasksService.getAllTasks();
            return tasks;
        }       
    }

    @Get('/:id')
    getTaskById(@Param('id') id:string) {
        return this.tasksService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id:string) {
        return this.tasksService.deleteTaskById(id);
    }
}
