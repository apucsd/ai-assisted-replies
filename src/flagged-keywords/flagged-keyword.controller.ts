import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { FlaggedKeywordService } from './flagged-keyword.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';
import { CreateFlaggedKeywordDto, UpdateFlaggedKeywordDto } from './dto/flagged-keyword.dto';

@Controller('flagged-keywords')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class FlaggedKeywordController {
    constructor(private readonly flaggedKeywordService: FlaggedKeywordService) {}

    @Post()
    async create(@Body() createFlaggedKeywordDto: CreateFlaggedKeywordDto) {
        return this.flaggedKeywordService.create(createFlaggedKeywordDto);
    }

    @Get()
    async findAll(@Query() query: any) {
        return this.flaggedKeywordService.findAll(query);
    }

    @Get(':id')
    async findOne(@Req() req: any) {
        return this.flaggedKeywordService.findOne(req.params.id);
    }

    @Patch(':id')
    async update(
        @Req() req: any,
        @Body() updateFlaggedKeywordDto: UpdateFlaggedKeywordDto,
    ) {
        return this.flaggedKeywordService.update(req.params.id, updateFlaggedKeywordDto);
    }

    @Delete(':id')
    async remove(@Req() req: any) {
        return this.flaggedKeywordService.remove(req.params.id);
    }
}
