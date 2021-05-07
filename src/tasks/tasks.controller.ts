import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from  'multer';
import { extname } from  'path';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

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
        createTaskDto.media = `${media.destination}/${media.filename}`
        return this.tasksService.createTask(createTaskDto);
    }
}
