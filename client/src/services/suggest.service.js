import createService from './api.service'

class SuggestService {
    constructor(baseUrl = '/apis/suggest') {
        this.api = createService(baseUrl)
    }

    async getSuggest(token) {
        return (await this.api.get('/', {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async getNearImage(token, data) {
        return (await this.api.postForm('/near-image', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new SuggestService()