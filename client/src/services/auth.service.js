import createService from './api.service'

class authService {
    constructor(baseUrl = '/apis/auth') {
        this.api = createService(baseUrl)
    }

    async login(data) {
        return (await this.api.post('/login', data)).data
    }
}

export default new authService()