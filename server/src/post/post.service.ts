import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatPostDto, VerifyPostDto } from './dto';
import { PAGE_SIZE, ResponseData, USER_TYPES } from '../global';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Post, User } from '@prisma/client';

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService, private readonly cloudinaryService: CloudinaryService) { }

    async uploadFiles(files: Express.Multer.File[]) {
        try {
            let uploadedImages: number[] = []
            for (const file of files) {
                const result = await this.cloudinaryService.uploadFile(file)
                const data = await this.prismaService.image.create({
                    data: {
                        url: result.url
                    }
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
            let { title, description, itemId, sendProtection, locations, type } = createPostDto
            locations = locations.map(id => Number(id))
            const data: any = {
                userId: userId,
                title: title,
                description: description,
                itemId: itemId,
                type: Number(type) == 1 ? true : false,
                sendProtection: Number(sendProtection) == 1 ? true : false,
                Location: {
                    connect: locations.map((id) => ({ id }))
                },
            }
            if (images.length) {
                const imagesId: number[] = await this.uploadFiles(images)
                data.Image = {
                    connect: imagesId.map((id) => ({ id }))
                }
            }
            await this.prismaService.post.create({
                data: data
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
            let where: any = {
                isDelete: false
            }
            if (itemId) {
                where.itemId = itemId
            }
            if (type != undefined || type != null) {
                where.type = Boolean(type)
            }
            if (verify != undefined || verify != null) {
                where.verify = Number(verify)
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
                },
                skip: next,
                take: pageSize
            })
            return new ResponseData<any>({ data, totalPages }, 200, 'Tìm thành công các bài viết')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getAllPostsForUser(option: { key: string, page: number, type: any, itemId: number, locations: number[] }) {
        const pageSize = PAGE_SIZE.PAGE_POST
        try {
            let { key, page, type, itemId, locations } = option
            const where: any = {
                verify: 1,
                done: false,
                isDelete: false,
                User: {
                    isBan: false
                }
            }
            if (itemId) {
                where.itemId = Number(itemId)
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
            if (type != undefined || type != null) {
                where.type = type == 'true' ? true : false
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
            if (isPost.verify !== 0) {
                return new ResponseData<string>(null, 400, 'Bài viết đã được xác thực')
            }
            let data: any = {
                verify: verifyPostDto.verify,
            }
            if (verifyPostDto.verify == -1) {
                data.feedback = verifyPostDto.feedback
            }
            console.log(data.feedback);

            await this.prismaService.post.update({
                where: {
                    id: id
                },
                data: data
            })
            return new ResponseData<string>(null, 200, 'Cập nhật thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async deletePost(user: User, id: number) {
        try {
            const isPost = await this.prismaService.post.findUnique({
                where: {
                    id: id
                }
            })
            if (!isPost) {
                return new ResponseData<string>(null, 400, 'Bài viết không tồn tại')
            }
            if (user.type !== USER_TYPES.ADMIN && user.id !== isPost.userId) {
                return new ResponseData<string>(null, 400, 'Bạn không có quyền xóa bài viết này')
            }
            await this.prismaService.post.update({
                where: {
                    id: id
                },
                data: {
                    isDelete: true
                }
            })
            return new ResponseData<string>(null, 200, 'Xóa thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getPostById(id: number) {
        try {
            const data = await this.prismaService.post.findUnique({
                where: {
                    id: id
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
            if (!data) {
                return new ResponseData<string>(null, 400, 'Bài viết không tồn tại')
            }
            return new ResponseData<Post>(data, 200, 'Tìm thấy bài viết')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getAllPostsByUserId(reqUserId: number, userId: number) {
        try {
            let where: any = {
                userId: userId,
                isDelete: false
            }
            if (userId !== reqUserId) {
                where.verify = 1
            }
            const data = await this.prismaService.post.findMany({
                where: where,
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
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            return new ResponseData<Post[]>(data, 200, 'Tìm thấy các bài viết')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}
