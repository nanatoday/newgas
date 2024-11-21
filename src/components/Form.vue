<script setup lang="ts">
import { useFormStore } from '@/stores/form';
import { postRequestHandler } from '@/utils/httpHandler';

const formStore = useFormStore()
const disabled = ref<boolean>(true)
const frontImage = ref<any>()
const backImage = ref<any>()
const name = ref<string>('')
const email = ref<string>('')
const phone = ref<string>('')
const address = ref<string>('')
const id = ref<string>('')


const submitForm = async() => {
    formStore.loading = true
    const formData = new FormData();

    formData.append("id_card_front", frontImage.value)
    formData.append("id_card_back", backImage.value)
    formData.append("name", name.value)
    formData.append("phone", phone.value)
    formData.append("id_card_number", id.value)
    formData.append("digital_address", address.value)
    formData.append("emaail", email.value)

    await postRequestHandler('customers/onboard', formData, true)
    .then(res => {
        formStore.notify = true
    })
    .catch((error) => {
        formStore.error = error
        console.error(error)
    })
    .finally(() => formStore.loading = false)
}

watchEffect(() => {
    if(name.value && phone.value && id.value && frontImage.value && backImage.value){
        disabled.value = false
    } else {
        disabled.value = true
    }
})
</script>

<template>
    <v-container class="mt-16">
        <v-card max-width="700" class="mx-auto">
            <v-toolbar title="Newgas Form" class="bg-newgas"/>
            <v-form @submit.prevent="submitForm">
                <v-card-text>
                    <p class="text-error">{{ formStore.error }}</p>
                    <div>
                        <p class="text-body-1 mb-1">Name*</p>
                        <v-text-field variant="outlined" density="comfortable" v-model="name" :rules="[formStore.rules.required]" placeholder="Eg. Isaac Ernest"/>
                    </div>
                    <div>
                        <p class="text-body-1 mb-1">Email</p>
                        <v-text-field variant="outlined" density="comfortable" v-model="email" placeholder="Eg. isaacernest@gmail.com"/>
                    </div>
                    <div>
                        <p class="text-body-1 mb-1">Phone Number*</p>
                        <v-text-field variant="outlined" density="comfortable" v-model="phone" :rules="[formStore.rules.phoneNumber]" placeholder="Eg. 0244567893"/>
                    </div>
                    <div>
                        <p class="text-body-1 mb-1">Digital Address</p>
                        <v-text-field variant="outlined" density="comfortable" v-model="address" placeholder="Eg. BS-2345-0994"/>
                    </div>
                    <div>
                        <p class="text-body-1 mb-1">Ghana Card ID*</p>
                        <v-text-field variant="outlined" density="comfortable" v-model="id" :rules="[formStore.rules.required]" placeholder="Eg. GHA-678091234-6"/>
                    </div>

                    <p class="text-body-1 mb-1" @click="console.log(frontImage)">Upload Ghana Card*</p>
                    <v-row>
                        <v-col cols="12" md="6" sm="6">
                            <PictureUpload v-model="frontImage" side="front"/> 
                            <p class="text-error">{{ formStore.imageError }}</p>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                            <PictureUpload v-model="backImage" side="back"/>
                            <p class="text-error">{{ formStore.imageError }}</p>
                        </v-col>                
                    </v-row>
                </v-card-text>
                <v-card-actions class="px-5 pb-5">
                    <v-btn type="submit" text="Submit" class="bg-newgas" size="large" :loading="formStore.loading" :disabled="disabled" block/>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
</template>