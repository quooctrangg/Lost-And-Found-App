import { ref } from 'vue'
import { defineStore } from 'pinia'
import schoolService from '@/services/school.service'

export const useSchoolStore = defineStore('school', () => {

    const err = ref(null)
    const result = ref(null)
    const schools = ref(null)

    const getSchool = async data => {
        err.value = null
        result.value = null
        try {
            let res = await schoolService.getSchool()
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            schools.value = result.value.data
        } catch (error) {
            err.value = error.message
        }
    }

    return { err, result, schools, getSchool }
})
