import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
    id: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    media: string;

    @IsNotEmpty()
    target_date: string;

    @IsNotEmpty()
    status: string;
}