
export const useFormStore = defineStore("formStore", () => {
    const error = ref<string | null>(null);
    const success = ref<string | null>(null);
    const loading = ref<boolean>(false);
    const notify = ref<boolean>(false);
    const verificationState = ref<boolean>(false);
    const activeEmail = ref<string | null>(null);
    const balance = ref<number>(100)

    // const rules = ref({
    //     required: (val: string) => {
    //         if (val) {
    //           return true;
    //         }
    //         return 'Field is required'
    //     }, email: (val: string) => {
    //         // must be a valid email
    //         if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(val)) {
    //           return true
    //         }
    //         return 'Must be a valid e-mail.'
    //     }, password: (val: string) => {
    //         if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^*]).{8,}$/i.test(val)) {
    //           return true
    //         }
    //         return 'Password must contain at least one letter, one digit, one special character (@$!%*?&), and be at least 8 characters long'
    //     }, amount: (val: string) => {
    //         // must not be less than 0
    //         if (parseFloat(val) > 0 && parseFloat(val) <= balance.value){
    //             return true
    //           }      
    //         return 'Must be a valid amount or Insufficient funds'
    //     }, accountNumber: (val: string) => {
    //         // must must be exactly 13 digits
    //         if (val.length >= 10 && val.length <=15) {
    //           return true
    //         }
    //         return 'Must be a valid account number'
    //     }, phoneNumber: (val: string) => {
    //         // must must be exactly 10 digits
    //         if (val.length === 10) {
    //           return true
    //         }
    //         return 'Must be a valid phone number'
    //     }

    // })

    // reset form if route changes
    // const router = useRouter();
    // watch(router.currentRoute, () => {
    //     resetFormStore();
    // })

    // reset all values
    const resetFormStore = () => {
        error.value = null;
        success.value = null;
        loading.value = false;
    }
    watch(success,()=>{
      setTimeout(()=>resetFormStore(),3500)
    })
    watch(error,()=>{
      setTimeout(()=>resetFormStore(),3500)
    })

    return { error, success, loading, notify, balance,verificationState, activeEmail, resetFormStore };
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFormStore, import.meta.hot))
}