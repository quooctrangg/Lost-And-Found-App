import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MajorService } from '../major/major.service';

@Module({
    controllers: [UserController],
    providers: [UserService, MajorService]
})
export class UserModule { }
