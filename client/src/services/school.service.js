import createService from './api.service'
import { createQueryString } from '../untils'

class schoolService {
    constructor(baseUrl = '/apis/school') {
        this.api = createService(baseUrl)
    }

    async getSchool(data) {
        let parameter = createQueryString(data)
        return (await this.api.get(`/${parameter}`)).data
    }

    async createSchool(token, data) {
        return (await this.api.post('/', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async updateSchool(token, id, data) {
        return (await this.api.patch(`/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async deleteSchool(token, id) {
        return (await this.api.delete(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new schoolService()