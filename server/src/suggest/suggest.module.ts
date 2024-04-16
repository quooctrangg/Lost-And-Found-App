import { Module } from '@nestjs/common';
import { SuggestService } from './suggest.service';
import { SuggestController } from './suggest.controller';

@Module({
    controllers: [SuggestController],
    providers: [SuggestService],
    exports: [SuggestService]
})
export class SuggestModule { }
