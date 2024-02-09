import createService from './api.service'
import { createQueryString } from '../untils'

class itemService {
    constructor(baseUrl = '/apis/item') {
        this.api = createService(baseUrl)
    }

    async getItem(data) {
        let parameter = createQueryString(data)
        return (await this.api.get(`/${parameter}`)).data
    }

    async createItem(token, data) {
        return (await this.api.post('/', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async updateItem(token, id, data) {
        return (await this.api.patch(`/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async deleteItem(token, id) {
        return (await this.api.delete(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new itemService()