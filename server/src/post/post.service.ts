import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatPostDto, VerifyPostDto } from './dto';
import { PAGE_SIZE, ResponseData } from '../global';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService, private readonly cloudinaryService: CloudinaryService) { }

    async uploadFiles(files: Express.Multer.File[]) {
        try {
            let uploadedImages: number[] = []
            for (const file of files) {
                const result = await this.cloudinaryService.uploadFile(file)
                const data = await this.prismaService.image.create({
                    data: result.url
                })
                uploadedImages.push(data.id)
            }
            return uploadedImages
        } catch (error) {
            console.log(error.message);
        }
    }

    async createPost(userId: number, createPostDto: CreatPostDto, images: Express.Multer.File[]) {
        try {
            const { title, description, itemId, sendProtection, locations, type } = createPostDto
            const imagesId: number[] = await this.uploadFiles(images)
            await this.prismaService.post.create({
                data: {
                    userId: userId,
                    title: title,
                    description: description,
                    itemId: itemId,
                    type: type,
                    sendProtection: sendProtection,
                    Location: {
                        connect: locations.map((id) => ({ id }))
                    },
                    Image: {
                        connect: imagesId.map((id) => ({ id }))
                    }
                },
                include: {
                    Location: true,
                    Image: true,
                    Item: true
                }
            })
            return new ResponseData<string>(null, 200, 'Tạo thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getAllPostsForAdmin(option: { page: number, key: string, itemId: number, type: boolean, verify: number, sort: any }) {
        const pageSize = PAGE_SIZE.PAGE_POST
        try {
            let { page, key, itemId, type, verify, sort } = option
            let where: any = {}
            if (itemId) {
                where.itemId = itemId
            }
            if (type !== undefined || type !== null) {
                where.type = type
            }
            if (verify !== undefined || verify !== null) {
                where.verify = verify
            }
            if (key) {
                where.title = {
                    contains: key,
                    mode: 'insensitive'
                }
            }
            const totalCount = await this.prismaService.post.count({
                where: where,
                orderBy: {
                    createdAt: sort
                }
            })
            let totalPages = Math.ceil(totalCount / pageSize)
            if (!totalPages) totalPages = 1
            if (!page || page < 1) page = 1
            let next = (page - 1) * pageSize
            const data = await this.prismaService.post.findMany({
                where: where,
                orderBy: {
                    createdAt: sort
                },
                include: {
                    User: true,
                    Image: true,
                    Item: true,
                    Location: true
                },
                skip: next,
                take: pageSize
            })
            return new ResponseData<any>({ data, totalPages }, 200, 'Tìm thành công các bài viết')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getAllPostsForUser(option: { key: string, page: number, type: boolean, itemId: number, locations: number[] }) {
        const pageSize = PAGE_SIZE.PAGE_POST
        try {
            let { key, page, type, itemId, locations } = option
            const where: any = {
                verify: 1,
                done: false,
                isDelete: false
            }
            if (itemId) {
                where.itemId = itemId
            }
            if (locations && locations.length) {
                where.Location = {
                    some: {
                        id: {
                            in: locations.map(id => Number(id))
                        }
                    }
                }
            }
            if (key) {
                where.title = {
                    contains: key,
                    mode: 'insensitive'
                }
            }
            const totalCount = await this.prismaService.post.count({
                where: where,
                orderBy: {
                    createdAt: 'desc'
                }
            })
            let totalPages = Math.ceil(totalCount / pageSize)
            if (!totalPages) totalPages = 1
            if (!page || page < 1) page = 1
            let next = (page - 1) * pageSize
            const data = await this.prismaService.post.findMany({
                where: where,
                orderBy: {
                    createdAt: 'desc'
                },
                skip: next,
                take: pageSize,
                include: {
                    Image: true,
                    Item: true,
                    Location: true,
                    User: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                }
            })
            return new ResponseData<any>({ data, totalPages }, 200, 'Tìm thành công các bài viết')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async verifyPost(id: number, verifyPostDto: VerifyPostDto) {
        try {
            const isPost = await this.prismaService.post.findUnique({
                where: {
                    id: id
                }
            })
            if (!isPost) {
                return new ResponseData<string>(null, 400, 'Bài viết không tồn tại')
            }
            if (verifyPostDto.verify > 1 || verifyPostDto.verify < -1) {
                return new ResponseData<string>(null, 400, 'Kiểu xác thực không tồn tại')
            }
            await this.prismaService.post.update({
                where: {
                    id: id
                },
                data: {
                    verify: verifyPostDto.verify
                }
            })
            return new ResponseData<string>(null, 200, 'Cập nhật thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}
