import { TaskStatus } from '../task.model';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTaskFilterDto {
    @IsOptional()
    @IsNotEmpty()
    search: string;

    @IsOptional()
    @IsNotEmpty()
    start: string;

    @IsOptional()
    @IsNotEmpty()
    limit: string;

    @IsOptional()
    @IsNotEmpty()
    sortBy: string;
}