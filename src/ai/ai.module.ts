import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { FlaggedKeywordModule } from 'src/flagged-keywords/flagged-keyword.module';

@Module({
    imports: [FlaggedKeywordModule],
    providers: [AiService],
    exports: [AiService],
})
export class AiModule {}
