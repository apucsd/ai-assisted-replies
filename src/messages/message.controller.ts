import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Request } from 'express';
import { CreateMessageDto } from './dto/create-message.dto';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';

@Controller('messages')
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.USER)
    async getAllMessages(@Req() req: Request) {
        return this.messageService.getAllMessages(req.query);
    }


    @Post()
    @UseGuards(AuthGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.USER)
    async createMessage(@Body() body: CreateMessageDto) {
        return this.messageService.createMessage(body);
    }

    @Get(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.USER)
    async getMessageById(@Req() req: Request) {
        return this.messageService.getMessageById(req.params.id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.USER)
    async deleteMessage(@Req() req: Request) {
        return this.messageService.deleteMessage(req.params.id);
    }
}
