import createService from './api.service'
import { createQueryString } from '../untils'
import FileSaver from 'file-saver'

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

    async downloadExcel(token, option) {
        let parameter = createQueryString(option)
        const response = (await this.api.get(`/download-excel${parameter}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob'
        })).data
        const file = new Blob([response], { type: 'application/vnd.ms-excel' })
        FileSaver.saveAs(file, 'Danh sach.xlsx');
    }
}

export default new dashboardService()