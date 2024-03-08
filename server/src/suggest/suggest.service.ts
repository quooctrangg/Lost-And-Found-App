import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PythonShell } from 'python-shell';
import { config } from './python.config';
import { ResponseData } from '../global';

@Injectable()
export class SuggestService {
  constructor(private readonly prismaService: PrismaService) {
    this.shell = new PythonShell('main.py', config);
    this.startup()
  }
  private shell: PythonShell

  private startup() {
    console.log('PYTHON STARTUP');
  }
}
