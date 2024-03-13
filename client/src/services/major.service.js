import createService from './api.service'
import { createQueryString } from '../untils'

class MajorService {
    constructor(baseUrl = '/apis/major') {
        this.api = createService(baseUrl)
    }

    async getAlls(token, option) {
        let parameter = createQueryString(option)
        return (await this.api.get(`/${parameter}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async getAllsBySchoolId(schoolId) {
        return (await this.api.get(`/${schoolId}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })).data
    }

    async create(token, data) {
        return (await this.api.post(`/`, data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async updateMajor(token, data, id) {
        return (await this.api.patch(`/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async deleteMajor(token, id) {
        return (await this.api.delete(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new MajorService()