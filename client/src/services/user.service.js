import createService from './api.service'

class userService {
    constructor(baseUrl = '/apis/user') {
        this.api = createService(baseUrl)
    }

    async me(token) {
        return (await this.api.get('/me', {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async updateAvatar(token, data) {
        return (await this.api.patchForm('/update-avatar', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new userService()