import { IsNotEmpty, IsEnum } from 'class-validator';
import { TaskStatus } from '../task.model';

export class CreateTaskDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    target_date: string;

    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status: string;
}