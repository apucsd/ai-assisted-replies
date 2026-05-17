import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateFlaggedKeywordDto {
    @IsString({ message: 'Keyword must be a string' })
    keyword: string;

    @IsString()
    @IsOptional()
    replaceWord?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateFlaggedKeywordDto {
    @IsString()
    @IsOptional()
    keyword?: string;

    @IsString()
    @IsOptional()
    replaceWord?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
