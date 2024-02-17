import createService from './api.service'
import { createQueryString } from '../untils'

class commentService {
    constructor(baseUrl = '/apis/comment') {
        this.api = createService(baseUrl)
    }

    async getAllCommentsByPostId(token, postId) {
        return (await this.api.get(`/${postId}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async createComment(token, data) {
        return (await this.api.post('/', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new commentService()