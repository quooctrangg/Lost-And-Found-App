import createService from './api.service'

class authService {
    constructor(baseUrl = '/apis/auth') {
        this.api = createService(baseUrl)
    }

    async login(data) {
        return (await this.api.post('/login', data)).data
    }

    // async register(data) {
    //     return (await this.api.post('/register', data)).data
    // }

    // async confirmUser(data) {
    //     return (await this.api.patch('/confirm', data)).data
    // }
}

export default new authService()