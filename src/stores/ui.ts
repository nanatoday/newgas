import { defineStore } from "pinia";

export const useUiStore = defineStore('ui store', () => {
    const alert = ref<boolean>(false)
    const alertText = ref<string>('')
    const alertStatus = ref<boolean>(false)

    return { alert, alertText, alertStatus}
})