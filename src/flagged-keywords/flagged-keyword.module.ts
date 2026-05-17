import { Module } from '@nestjs/common';
import { FlaggedKeywordService } from './flagged-keyword.service';
import { FlaggedKeywordController } from './flagged-keyword.controller';

@Module({
    providers: [FlaggedKeywordService],
    controllers: [FlaggedKeywordController],
    exports: [FlaggedKeywordService],
})
export class FlaggedKeywordModule {}
