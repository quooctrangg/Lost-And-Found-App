import createService from './api.service'
import { createQueryString } from '../untils'

class dashboardService {
    constructor(baseUrl = '/apis/dashboard') {
        this.api = createService(baseUrl)
    }

    async getStatistical(token, option) {
        let parameter = createQueryString(option)
        return (await this.api.get(`/statistical${parameter}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async getChart(token, option) {
        let parameter = createQueryString(option)
        return (await this.api.get(`/chart${parameter}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async getListStudentRetureItemSuccessful(token, option) {
        let parameter = createQueryString(option)
        return (await this.api.get(`/list-student${parameter}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new dashboardService()