import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'

export const useUiStore = defineStore('uiStore', () => {
  const loading = ref<boolean>(false)
  const showNav = ref<boolean>(false)
  const toggle = ref<boolean>(false)
  const { mdAndDown } = useDisplay()

  watchEffect(newValue => {
    showNav.value = !mdAndDown.value
    toggle.value = mdAndDown.value
  })

  const alert = ref<boolean>(false)
  const alertText = ref<string>('')
  const alertStatus = ref<boolean>(false)

  return {
    loading,
    showNav,
    toggle,
    alert,
    alertText,
    alertStatus,
  }
})
