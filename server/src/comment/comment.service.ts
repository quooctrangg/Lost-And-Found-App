import { Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';
import { Comment } from '@prisma/client';


@Injectable()
export class CommentService {
    constructor(private readonly prismaService: PrismaService) { }

    private readonly logger = new Logger(CommentService.name);

    async createComment(userId: number, createCommentDto: CreateCommentDto) {
        try {
            const post = await this.prismaService.post.findUnique({
                where: {
                    id: createCommentDto.postId,
                    isDelete: false
                }
            })
            if (!post) {
                return new ResponseData<string>(null, 400, 'Bài viết không tồn tại')
            }
            const newComment = await this.prismaService.comment.create({
                data: {
                    content: createCommentDto.content,
                    parentId: createCommentDto.parentId,
                    postId: createCommentDto.postId,
                    userId: userId
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            image: true,
                            name: true
                        }
                    }
                }
            })
            let parentComment: Comment = null
            if (createCommentDto.parentId) {
                parentComment = await this.prismaService.comment.findUnique({
                    where: {
                        id: createCommentDto.parentId
                    }
                })
            }
            if ((!parentComment && post.userId != userId) || (parentComment && parentComment.userId !== userId)) {
                await this.prismaService.notification.create({
                    data: {
                        commentId: newComment.id
                    }
                })
            }
            return new ResponseData<Comment>(newComment, 200, 'Bình luận thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getAllsCommetByPostId(postId: number) {
        try {
            const comments = await this.prismaService.comment.findMany({
                where: {
                    postId: postId
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            image: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    parentId: 'desc'
                }
            })
            return new ResponseData<Comment[]>(comments, 200, 'Lấy tất cả bình luận')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}
