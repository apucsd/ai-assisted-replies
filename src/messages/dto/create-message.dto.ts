import { IsString } from 'class-validator';

export class CreateMessageDto {
    @IsString({ message: 'Original message must be a string' })
    originalMsg: string;

    @IsString({ message: 'Project ID must be a string' })
    projectId: string;
}
