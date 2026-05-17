import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFlaggedKeywordDto, UpdateFlaggedKeywordDto } from './dto/flagged-keyword.dto';
import QueryBuilder from 'src/common/utils/query-builder';

@Injectable()
export class FlaggedKeywordService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateFlaggedKeywordDto) {
        return await this.prisma.flaggedKeyword.create({
            data,
        });
    }

    async findAll(query: Record<string, any>) {
        const queryBuilder = new QueryBuilder(this.prisma.flaggedKeyword, query);
        return await queryBuilder
            .search(['keyword', 'category'])
            .filter()
            .sort()
            .paginate()
            .execute();
    }

    async getActiveKeywords() {
        return await this.prisma.flaggedKeyword.findMany({
            where: { isActive: true },
            select: { keyword: true, replaceWord: true },
        });
    }

    async findOne(id: string) {
        return await this.prisma.flaggedKeyword.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: UpdateFlaggedKeywordDto) {
        return await this.prisma.flaggedKeyword.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return await this.prisma.flaggedKeyword.delete({
            where: { id },
        });
    }
}
