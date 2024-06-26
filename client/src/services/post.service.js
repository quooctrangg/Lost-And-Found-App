import createService from './api.service'
import { createQueryString } from '../untils'

class postService {
    constructor(baseUrl = '/apis/post') {
        this.api = createService(baseUrl)
    }

    async createPost(token, data) {
        return (await this.api.postForm('/', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            }
        })).data
    }

    async getAllPostsForAdmin(token, option) {
        let parameter = createQueryString(option)
        return (await this.api.get(`/post-for-admin${parameter}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async getAllPostsForUser(option) {
        const { locations, ...other } = option
        let parameter = createQueryString(other)
        if (locations.length && locations.length == 1) {
            parameter += `&locations=${locations[0]}`
            parameter += `&locations=${locations[0]}`
        } else if (locations.length && locations.length > 1) {
            locations.forEach(element => {
                parameter += `&locations=${element}`
            });
        }
        return (await this.api.get(`/post-for-user${parameter}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })).data
    }

    async verifyPost(token, id, data) {
        return (await this.api.patch(`/verify/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async deletePost(token, id) {
        return (await this.api.delete(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async getPostById(token, id) {
        return (await this.api.get(`/details/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async getAllPostsByUserId(token, userId) {
        return (await this.api.get(`/post-by-user/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async searchPostsByImage(data) {
        return (await this.api.postForm(`/search-post-by-image`, data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })).data
    }

    async reviewHistory(token, option) {
        let parameter = createQueryString(option)
        return (await this.api.get(`/get-posts-for-approved-by-admin${parameter}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new postService()