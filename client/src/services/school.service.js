import createService from './api.service'

const createQueryString = (options) => {
    const queryString = Object.keys(options)
        .map(key => {
            if (options[key] !== null && options[key] !== undefined && options[key] !== 'null' && options[key] !== '') {
                return `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`;
            }
            return '';
        })
        .filter(Boolean)
        .join('&');
    return queryString.length > 0 ? `?${queryString}` : '';
}

class schoolService {
    constructor(baseUrl = '/apis/school') {
        this.api = createService(baseUrl)
    }

    async getSchool(data) {
        let parameter = createQueryString(data)
        return (await this.api.get(`/${parameter}`)).data
    }

    async createSchool(token, data) {
        return (await this.api.post('/', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async updateSchool(token, id, data) {
        return (await this.api.patch(`/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async deleteSchool(token, id) {
        return (await this.api.delete(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new schoolService()