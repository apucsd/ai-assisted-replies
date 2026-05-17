import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Request } from 'express';
import { CreateProjectDto } from './dto/create-project.dto';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';

@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.USER,)
    async getAllProjects(@Req() req: Request) {
        return this.projectService.getAllProjects(req.query);
        // return req.query;
    }
    @Get('/my')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.USER)
    async getMyProjects(@Req() req: Request) {
        return this.projectService.getMyProjects(req.user.id, req.query);
        // return req.query;
    }
    @Post()
    @UseGuards(AuthGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.USER)
    async createProject(@Req() req: Request, @Body() body: CreateProjectDto) {
        return this.projectService.createProject(req.user.id, body);
    }
    @Get(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.USER)
    async getProjectById(@Req() req: Request) {
        return this.projectService.getProjectById(req.params.id);
    }
    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.USER)
    async deleteProject(@Req() req: Request) {
        return this.projectService.deleteProject(req.params.id);
    }
}
