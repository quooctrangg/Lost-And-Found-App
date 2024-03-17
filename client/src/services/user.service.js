import createService from './api.service'
import { createQueryString } from '../untils'

class userService {
    constructor(baseUrl = '/apis/user') {
        this.api = createService(baseUrl)
    }

    async me(token) {
        return (await this.api.get('/me', {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async getProfileUser(token, id) {
        return (await this.api.get(`profile/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async updateAvatar(token, data) {
        return (await this.api.patchForm('/update-avatar', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async updateProfile(token, data) {
        return (await this.api.patch('/update-profile', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async updatePassword(token, data) {
        return (await this.api.patch('/update-password', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async getAllUsers(token, option) {
        const finalQueryString = createQueryString(option);
        return (await this.api.get(`/${finalQueryString}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async createUser(token, data) {
        return (await this.api.post('/', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async banUser(token, id, data) {
        return (await this.api.patch(`/ban/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async unBanUser(token, id) {
        return (await this.api.patch(`/un-ban/${id}`, {}, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async updateUser(token, id, data) {
        return (await this.api.patchForm(`/update-user/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async forgotPassword(data) {
        return (await this.api.patch('/forgot-password', data)).data
    }

    async sendVerifyCode(data) {
        return (await this.api.post('/send-verify-code', data)).data
    }
}

export default new userService()