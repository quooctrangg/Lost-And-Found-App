import createService from './api.service'

class schoolService {
    constructor(baseUrl = '/apis/school') {
        this.api = createService(baseUrl)
    }

    async getSchool() {
        return (await this.api.get('/')).data
    }
}

export default new schoolService()