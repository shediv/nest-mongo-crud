import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private task: Task[] = [
        {
            "id": "1",
            "title": "task 1",
            "description": "task 1 description",
            "status": TaskStatus.OPEN
        },
        {
            "id": "2",
            "title": "task 2",
            "description": "task 2 description",
            "status": TaskStatus.OPEN
        }
    ];

    getAllTasks() {
        return this.task;
    }

    getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
        const { status, search } = filterDto;        

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter((task) => task.status === status);
        }

        if (search) {
            tasks = tasks.filter((task) => task.title.includes(search)
            || task.description.includes(search));
        }
        return tasks;
    }

    getTaskById(id: String): Task {
        let found = this.task.find((task) => task.id === id);

        if(!found) {
            throw new NotFoundException("Task with Id not found");
        }
        return found;
    }

    deleteTaskById(id: String): Task[] {
        const found = this.getTaskById(id);
        this.task = this.task.filter((task) => task.id !== found.id);
        return this.task;
    }

    createTask(createTaskDto: CreateTaskDto): Task[] {
        const { id, title, description } = createTaskDto;
        const newTask: Task = {
            id,
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.task.push(newTask);
        return this.task;
    }
    
    updateTaskStatusById(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
