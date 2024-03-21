import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';
import { PythonShell } from 'python-shell';
import { join } from 'path';
import { stringify } from 'csv-stringify'
import { createWriteStream } from 'fs'
import { Cron, CronExpression } from '@nestjs/schedule';
import { Post } from '@prisma/client';

@Injectable()
export class SuggestService {
  constructor(private readonly prismaService: PrismaService) { }

  private readonly logger = new Logger(SuggestService.name);

  async suggestItemsBasedOnDescription(userId: number) {
    try {
      const historySearch = await this.prismaService.searchHistory.findMany({
        where: {
          userId: userId
        },
        select: {
          content: true
        }
      })
      if (!historySearch.length) {
        const count = await this.prismaService.post.count()
        const randomIndex = Math.floor(Math.random() * count)
        const randomPost = await this.prismaService.post.findMany({
          where: {
            isDelete: false,
            verify: 1,
            done: false,
            userId: {
              not: userId
            }
          },
          include: {
            Image: true,
            Item: true,
            User: {
              select: {
                id: true,
                image: true,
                name: true
              }
            }
          },
          skip: randomIndex,
          take: 5,
        });
        return new ResponseData<Post[]>(randomPost, 200, 'Gợi ý thành công')
      }
      const listHistory = historySearch.map(e => Object.values(e)).flat()
      let options = {
        args: [...listHistory]
      }
      const result = await PythonShell.run(join(__dirname, 'scripts/main.py'), options);
      let listItem = [...new Set(JSON.parse(result[0]).flat())] as number[]
      const suggest = await this.prismaService.post.findMany({
        where: {
          isDelete: false,
          verify: 1,
          itemId: {
            in: listItem
          },
          done: false,
          userId: {
            not: userId
          }
        },
        include: {
          Image: true,
          Item: true,
          User: {
            select: {
              id: true,
              image: true,
              name: true
            }
          }
        },
        take: 5,
        orderBy: {
          createdAt: 'desc'
        }
      })
      return new ResponseData<Post[]>(suggest, 200, 'Gợi ý thành công')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async writeData() {
    try {
      const data = await this.prismaService.post.findMany({
        where: {
          isDelete: false,
          verify: 1
        },
        select: {
          description: true,
          itemId: true
        }
      })
      const columns = Object.keys(data[0])
      const convertData = data.map(e => Object.values(e))
      const writableStream = createWriteStream(join(__dirname, '/scripts/data.csv'))
      const stringifier = stringify({ header: true, columns: columns })
      convertData.forEach(e => {
        stringifier.write(e)
      })
      stringifier.pipe(writableStream)
      this.logger.log('Đã ghi thông tin vào file csv.')
    } catch (error) {
      this.logger.error('Lỗi dịch vụ, thử lại sau')
    }
  }
}
