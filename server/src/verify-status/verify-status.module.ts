import { Module } from '@nestjs/common';
import { VerifyStatusController } from './verify-status.controller';
import { VerifyStatusService } from './verify-status.service';

@Module({
  controllers: [VerifyStatusController],
  providers: [VerifyStatusService]
})
export class VerifyStatusModule { }
