import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import QueryBuilder from 'src/common/utils/query-builder';

@Injectable()
export class ProjectService {
    constructor(private prisma: PrismaService) {}
    async createProject(userId: string, payload: CreateProjectDto) {
        return await this.prisma.project.create({
            data: {
                ...payload,
                createdById: userId,
            },
        });
    }
    async getAllProjects(query: Record<string, any>) {
        const queryBuilder = new QueryBuilder(this.prisma.project, query);
        return await queryBuilder
            .search(['name'])
            .filter()
            .sort()
            .paginate()
            .fields()
            .customFields({
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                clientName: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                orderLink: true,
                status: true,
                platform: true,
            })
            .execute();
    }

    async getMyProjects(userId: string, query: Record<string, any>) {
        // console.log(query);
        const queryBuilder = new QueryBuilder(this.prisma.project, {
            ...query,
            createdById: userId,
        });
        return await queryBuilder
            .search(['name'])
            .filter()
            .sort()
            .paginate()
            .fields()
            .customFields({
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                clientName: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                orderLink: true,
                status: true,
                platform: true,
            })
            .execute();
    }

    async getProjectById(id: string) {
        return await this.prisma.project.findUnique({
            where: {
                id,
            },
        });
    }

    async deleteProject(id: string) {
        return await this.prisma.project.update({
            where: {
                id,
            },
            data: {
                status: 'DELETED',
            },
        });
    }
}
