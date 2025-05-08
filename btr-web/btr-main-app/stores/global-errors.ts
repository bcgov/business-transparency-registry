import { defineStore } from 'pinia'

export const useGlobalErrorsStore = defineStore('globalErrors', () => {
  const _globalErrors: Ref<GlobalErrorI[]> = ref([])

  const globalErrors = computed(() => _globalErrors.value)
  const addGlobalError = (error: GlobalErrorI) => {
    _globalErrors.value.push(error)
  }

  const removeLastGlobalError = () => {
    _globalErrors.value.pop()
  }
  return {
    globalErrors,
    addGlobalError,
    removeLastGlobalError
  }
})
