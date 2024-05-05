import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';
import { PythonShell } from 'python-shell';
import { join } from 'path';
import { stringify } from 'csv-stringify'
import { createWriteStream } from 'fs'
import { Cron, CronExpression } from '@nestjs/schedule';
import { Post } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import weaviate, { WeaviateClient } from 'weaviate-ts-client';
import axios from 'axios';

@Injectable()
export class SuggestService {
    private readonly client: WeaviateClient;
    private readonly logger = new Logger(SuggestService.name);
    // private readonly schemaConfig = {
    //     'class': 'Nestdb',
    //     'vectorizer': 'img2vec-neural',
    //     'vectorIndexType': 'hnsw',
    //     'moduleConfig': {
    //         'img2vec-neural': {
    //             'imageFields': [
    //                 'image'
    //             ]
    //         }
    //     },
    //     'properties': [
    //         {
    //             'name': 'image',
    //             'dataType': ['blob']
    //         },
    //         {
    //             'name': 'text',
    //             'dataType': ['string']
    //         }
    //     ]
    // }

    constructor(private readonly prismaService: PrismaService, private readonly configService: ConfigService) {
        this.client = weaviate.client({
            scheme: configService.get('WEAVIATE_SCHEME'),
            host: configService.get('WEAVIATE_HOST'),
        })

        //this.client.schema.classCreator().withClass(this.schemaConfig).do()
    }

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
                        done: {
                            not: 1
                        },
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
                    done: {
                        not: 1
                    },
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
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async addToDatabase(fileName: string) {
        try {
            const image = await axios.get(fileName, { responseType: 'arraybuffer' })
            const imgBase64 = Buffer.from(image.data, 'binary').toString('base64');
            await this.client.data.creator().withClassName('Nestdb').withProperties({
                image: imgBase64,
                text: fileName,
            }).do();
            this.logger.log('Đã gửi thành công hình lên Weaviate.')
        } catch (error) {
            this.logger.error(error.message)
        }
    }

    async getNearImage(image: string) {
        try {
            const urls = await this.searchUrlsByImage(image, 0.7, 2)
            const posts = await this.prismaService.post.findMany({
                where: {
                    Image: {
                        some: {
                            url: {
                                in: urls.map(url => url.text)
                            }
                        }
                    },
                    isDelete: false,
                    done: {
                        not: 1
                    },
                    verify: 1,
                    User: {
                        isBan: false
                    }
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    Image: true,
                    Item: true,
                    Location: true
                }
            })
            return new ResponseData<any>(posts, 200, 'Gợi ý thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async searchUrlsByImage(image: string, certainty: number, limit: number) {
        const resImage = await this.client.graphql
            .get()
            .withClassName('Nestdb')
            .withFields('text')
            .withNearImage({ image, certainty: certainty })
            .withLimit(limit)
            .do();
        return resImage.data.Get.Nestdb;
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
            this.logger.error(error.message)
        }
    }
}