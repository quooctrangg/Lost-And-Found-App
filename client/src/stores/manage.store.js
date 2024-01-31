import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useManageStore = defineStore('manage', () => {

    const isShow = reactive({
        addUser: false,
        editUser: false,
        feedback: false,
        refuse: false,
        editItem: false,
        addItem: false,
        editLocation: false,
        addLocation: false,
        editSchool: false,
        addSchool: false
    })

    const closeAddUserModal = () => { isShow.addUser = false }

    const showAddUserModal = () => { isShow.addUser = true }

    const closeEditUserModal = () => { isShow.editUser = false }

    const showEditUserModal = () => { isShow.editUser = true }

    const closeFeedbackModal = () => { isShow.feedback = false }

    const showFeedbackModal = () => { isShow.feedback = true }

    const closeRefuseModal = () => { isShow.refuse = false }

    const showRefuseModal = () => { isShow.refuse = true }

    const closeEditItemModal = () => { isShow.editItem = false }

    const showEditItemModal = () => { isShow.editItem = true }

    const closeAddItemModal = () => { isShow.addItem = false }

    const showAddItemModal = () => { isShow.addItem = true }

    const closeAddLocationModal = () => { isShow.addLocation = false }

    const showAddLocationModal = () => { isShow.addLocation = true }

    const closeEditLocationModal = () => { isShow.editLocation = false }

    const showEditLocationModal = () => { isShow.editLocation = true }

    const closeEditSchoolModal = () => { isShow.editSchool = false }

    const showEditSchoolModal = () => { isShow.editSchool = true }

    const closeAddSchoolModal = () => { isShow.addSchool = false }

    const showAddSchoolModal = () => { isShow.addSchool = true }

    return {
        isShow,
        closeAddUserModal, showAddUserModal,
        closeEditUserModal, showEditUserModal,
        closeFeedbackModal, showFeedbackModal,
        closeRefuseModal, showRefuseModal,
        closeEditItemModal, showEditItemModal,
        closeAddItemModal, showAddItemModal,
        closeAddLocationModal, showAddLocationModal,
        closeEditLocationModal, showEditLocationModal,
        closeEditSchoolModal, showEditSchoolModal,
        closeAddSchoolModal, showAddSchoolModal
    }
})
