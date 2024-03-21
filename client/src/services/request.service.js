import createService from './api.service'

class requestService {
    constructor(baseUrl = '/apis/request') {
        this.api = createService(baseUrl)
    }

    async createRequest(token, data) {
        return (await this.api.post('/', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async acceptRequest(token, data) {
        return (await this.api.patch('/accept', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async rejectRequest(token, data) {
        return (await this.api.patch('/reject', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async getAllRequestsByUser(token) {
        return (await this.api.get('/', {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async getRequestsSuccessByUserId(token) {
        return (await this.api.get('/request-success', {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new requestService()