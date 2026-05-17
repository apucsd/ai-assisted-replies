import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import QueryBuilder from 'src/common/utils/query-builder';
import { AiService } from 'src/ai/ai.service';
import { AppError } from 'src/common/error/app-error';

@Injectable()
export class MessageService {
    constructor(
        private prisma: PrismaService,
        private aiService: AiService,
    ) { }

    async createMessage(payload: CreateMessageDto) {
        const safeMsg = await this.aiService.generateSafeMessage(payload.originalMsg);

        if (!safeMsg) {
            throw new AppError(503, 'AI models are currently busy or unavailable. Please try again later.');
        }

        return await this.prisma.message.create({
            data: {
                originalMsg: payload.originalMsg,
                projectId: payload.projectId,
                safeMsg: safeMsg,
            },
        });
    }

    async getAllMessages(query: Record<string, any>) {
        const queryBuilder = new QueryBuilder(this.prisma.message, query);
        return await queryBuilder
            .search(['originalMsg', 'safeMsg'])
            .filter()
            .sort()
            .paginate()
            .fields()
            .customFields({
                id: true,
                originalMsg: true,
                safeMsg: true,
                keyFlags: true,
                projectId: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            })
            .execute();
    }


    async getMessageById(id: string) {
        return await this.prisma.message.findUnique({
            where: { id },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async deleteMessage(id: string) {
        return await this.prisma.message.delete({
            where: { id },
        });
    }
}
