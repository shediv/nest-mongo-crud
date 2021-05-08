import { IsNotEmpty, IsEnum, IsOptional, IsDefined } from 'class-validator';
import { TaskStatus } from '../task.model';

export class UpdateTaskDto {
    @IsOptional()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsNotEmpty()
    target_date: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status: string;
}