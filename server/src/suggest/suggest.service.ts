import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as tf from '@tensorflow/tfjs';

@Injectable()
export class SuggestService {
  constructor(private readonly prismaService: PrismaService) { }

  async getSuggest(userId: number) {
    const model = await tf.loadLayersModel('file://path/to/model.json');
    // const inputTensor = tf.tensor2d([1, 2, 3], [1, [1, 2, 3].length]);

    // const prediction = model.predict(inputTensor) as tf.Tensor;
    // const outputData = await prediction.data() as Float32Array;

    // return Array.from(outputData);
  }
}
