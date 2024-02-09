import createService from './api.service'
import { createQueryString } from '../untils'

class locationService {
    constructor(baseUrl = '/apis/location') {
        this.api = createService(baseUrl)
    }

    async getLocation(data) {
        let parameter = createQueryString(data)
        return (await this.api.get(`/${parameter}`)).data
    }

    async createLocation(token, data) {
        return (await this.api.post('/', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async updateLocation(token, id, data) {
        return (await this.api.patch(`/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async deleteLocation(token, id) {
        return (await this.api.delete(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new locationService()