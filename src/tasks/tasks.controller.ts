import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
    constructor (private tasksService: TasksService) {}

    @Get('/filter')
    getTasks(
        @Query(ValidationPipe) filterDto: GetTaskFilterDto
    ): Task[] {
        if(Object.keys(filterDto).length) {
            return this.tasksService.getTasksWithFilters(filterDto);
        } else {
            return this.tasksService.getAllTasks();
        }        
    }
    
    @Get()
    getAllTasks(): Task[] {
        return this.tasksService.getAllTasks();
    }    

    @Get('/:id')
    getTaskById(@Param('id') id:string): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Task[] {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id:string): Task[] {
        return this.tasksService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    updateTaskStatusById(
        @Param('id') id: string,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Task {
        return this.tasksService.updateTaskStatusById(id, status);
    }
}
