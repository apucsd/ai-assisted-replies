import { IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
    @IsString({
        message: 'Project name must be a string',
    })
    name: string;

    @IsString({
        message: 'Project description must be a string',
    })
    @IsOptional()
    description?: string;

    @IsString({
        message: 'Client name must be a string',
    })
    @IsOptional()
    clientName?: string;

    @IsOptional()
    platform?: 'FIVERR' | 'FREELANCECAMP' | 'UPWORK';

    @IsString()
    @IsOptional()
    orderLink?: string;
}
