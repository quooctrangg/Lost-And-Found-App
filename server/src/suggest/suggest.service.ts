import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as tf from '@tensorflow/tfjs';

@Injectable()
export class SuggestService {
  constructor(private readonly prismaService: PrismaService) { }

  async getSuggest(userId: number) {
    try {

    } catch (error) {
      console.log(error);
    }
  }

  async trainModel() {
    try {

    } catch (error) {
      console.log(error);
    }
  }
}
