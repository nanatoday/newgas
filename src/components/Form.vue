<script setup lang="ts">
import { useFormStore } from '@/stores/form';
import { useUiStore } from '@/stores/ui';
import { postRequestHandler } from '@/utils/httpHandler';
import { useDisplay } from 'vuetify';

const formStore = useFormStore()
const uiStore = useUiStore()
const form = ref<boolean>(false)
const frontImage = ref<any>()
const backImage = ref<any>()
const name = ref<string>('')
const email = ref<string>('')
const phone = ref<string>('')
const address = ref<string>('')
const agent = ref<string>('')
const ghanaCard = ref<string>('')
const idType = ref<string>('')
const ghCardNotSelected = ref<boolean>(true)
const route = useRoute()
const { smAndDown } = useDisplay()
const agentCode = ref<any>(localStorage.getItem('agent_code') ?? undefined)



const submitForm = async () => {
    formStore.loading = true
    const formData = new FormData();

    formData.append("agent_code", agent.value.toUpperCase())
    formData.append("id_card_front", frontImage.value)
    if(backImage.value){
        formData.append("id_card_back", backImage.value)
    } 
    formData.append("name", name.value)
    formData.append("phone", phone.value)
    formData.append("id_card_type", idType.value)
    formData.append("id_card_number", ghanaCard.value)
    formData.append("digital_address", address.value)
    formData.append("email", email.value)

    if(agent.value){
        localStorage.setItem('agent_code', agent.value)
    }
    
    await postRequestHandler('customers/onboard', formData, true)
    .then(res => {
            formStore.notify = true
        })
        .catch((error) => {
            uiStore.alert = true
            uiStore.alertText = error
        })
        .finally(() => formStore.loading = false)
}

const formCheck = () => {
    frontImage.value = undefined
    backImage.value = undefined
    ghanaCard.value = ''
   if(idType.value == 'gh_card') {
    ghCardNotSelected.value = false
   } else {
    ghCardNotSelected.value = true
   }
}

onMounted(() => {
    if(route.query?.agent == 'true' || route.query?.agent == '1') {
        if(localStorage.getItem('agent_code')) {
            agent.value = agentCode.value
        }
    }
})

</script>

<template>
    <v-container :class="smAndDown? 'mt-10' : 'mt-16'">
        <v-card max-width="700" class="mx-auto">
            <v-toolbar title="Customer Registration" class="bg-newgas text-black" />
            <v-form @submit.prevent="submitForm" v-model="form">
                <v-card-text>
                    <p class="text-error text-body-1 font-weight-bold text-center">{{ formStore.error }}</p>
                    <div v-if="route.query?.agent == 'true' || route.query?.agent == '1'">
                        <p class="text-body-1 mb-1">Agent Code*</p>
                        <v-text-field variant="outlined" density="comfortable" v-model="agent"
                            :rules="[formStore.rules.required]" placeholder="Eg. xxxx" :disabled="agentCode !== undefined"/>
                    </div>
                    <div>
                        <p class="text-body-1 mb-1">Name*</p>
                        <v-text-field variant="outlined" density="comfortable" v-model="name"
                            :rules="[formStore.rules.required]" placeholder="Eg. Kwadwo Mensah" />
                    </div>
                    <div>
                        <p class="text-body-1 mb-1">Email</p>
                        <v-text-field variant="outlined" density="comfortable" v-model="email"
                            placeholder="Eg. kwadwomensah@example.com" />
                    </div>
                    <div>
                        <p class="text-body-1 mb-1">Phone Number*</p>
                        <v-text-field variant="outlined" density="comfortable" v-model="phone"
                            :rules="[formStore.rules.phoneNumber]" placeholder="Eg. 024xxxxxxx" />
                    </div>
                    <div>
                        <p class="text-body-1 mb-1">Digital Address</p>
                        <v-text-field variant="outlined" density="comfortable" v-model="address"
                            placeholder="Eg. BS-xxxx-xxxx" />
                    </div>
                    <div>
                        <p class="text-body-1 mb-1">ID Type*</p>
                        <v-select variant="outlined" density="comfortable" v-model="idType" placeholder="Eg. Passport"
                            :items="[{ title: 'Ghana Card', value: 'gh_card' }, { title: 'Passport', value: 'passport' }]"
                            item-title="title" item-value="value" :rules="[formStore.rules.required]" @update:model-value="formCheck"/>
                    </div>
                    <div v-if="idType == 'gh_card'">
                        <div>
                            <p class="text-body-1 mb-1">Ghana Card ID*</p>
                            <v-text-field variant="outlined" density="comfortable" v-model="ghanaCard"
                                :rules="[formStore.rules.required]" placeholder="Eg. GHA-xxxxxxxxx-x" />
                        </div>

                        <p class="text-body-1 mb-1">Upload Ghana Card*</p>
                        <v-row>
                            <v-col cols="12" md="6" sm="6">
                                <PictureUpload v-model="frontImage" side="front" />
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <PictureUpload v-model="backImage" side="back" />
                            </v-col>
                        </v-row>
                    </div>
                    <div v-if="idType == 'passport'">
                        <div>
                            <p class="text-body-1 mb-1">Passport ID*</p>
                            <v-text-field variant="outlined" density="comfortable" v-model="ghanaCard"
                                :rules="[formStore.rules.required]" placeholder="Eg. xxxxxxxxx" />
                        </div>
                        <p class="text-body-1 mb-1">Upload Passport Bio Page*</p>
                        <div class="w-100">
                            <PictureUpload v-model="frontImage" side="Bio Page" class="w-100" />
                        </div>
                    </div>
                    <!-- <div v-if="idType == 'driver_license'">
                        <div>
                            <p class="text-body-1 mb-1">Driver's License ID*</p>
                            <v-text-field variant="outlined" density="comfortable" v-model="ghanaCard"
                                :rules="[formStore.rules.required]" placeholder="Eg. xxxxxxxxx" />
                        </div>
                        <p class="text-body-1 mb-1">Upload Driver's License*</p>
                        <div class="text-center">
                            <PictureUpload v-model="frontImage" side="front" />
                        </div>
                    </div> -->
                </v-card-text>
                <v-card-actions class="px-5 pb-5">
                    <v-btn type="submit" text="Submit" class="bg-newgas" size="large" :loading="formStore.loading"
                        :disabled="!(form && frontImage && (backImage || ghCardNotSelected))" block />
                </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
</template>