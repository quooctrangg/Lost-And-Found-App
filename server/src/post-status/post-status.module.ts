import { Module } from '@nestjs/common';
import { PostStatusController } from './post-status.controller';
import { PostStatusService } from './post-status.service';

@Module({
  controllers: [PostStatusController],
  providers: [PostStatusService]
})
export class PostStatusModule {}
