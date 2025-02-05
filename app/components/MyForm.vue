<script setup lang="ts">
import { useFormStore } from "@/stores/form";
import { useUiStore } from "@/stores/ui";
// import { postRequestHandler } from '@/utils/httpHandler';
import { useDisplay } from "vuetify";
import Feedback from "./Feedback.vue";

const runtimeConfig = useRuntimeConfig()
const formStore = useFormStore()
const { xs } = useDisplay()
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
const agentCode = ref<any>()
const otp = ref<string>('')
const showOTP = ref<boolean>(false)
const showFields = ref<boolean>(false)
const loading = ref<boolean>(false)
const timeDiff = ref<number>(0)
const mins = ref<number>()
const secs = ref<number>()
  const rules = ref({
  required: (val: string) => {
    if (val) {
      return true;
    }
    return "Field is required";
  },
  ghcard: (val: string) => {
    // must be a valid ghana card
    if (/^[A-Z]{3}-[0-9]{9}-[0-9]$/i.test(val)) {
      return true;
    }
    return "Must be a valid Ghana card number";
  },
  passport: (val: string) => {
    // must be a valid passport
    if (/^[A-Z][0-9]{7}$/i.test(val)) {
      return true;
    }
    return "Must be a valid passport number";
  },
  // gps: (val: string) => {
  //   if (val.length === 12) {
  //     return true;
  //   }
  //   return "Must be a valid GPS address";
  // },
  email: (val: string) => {
    // must be a valid email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(val)) {
      return true;
    }
    return "Must be a valid e-mail.";
  },
  password: (val: string) => {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^*]).{8,}$/i.test(val)) {
      return true;
    }
    return "Password must contain at least one letter, one digit, one special character (@$!%*?&), and be at least 8 characters long";
  },
  accountNumber: (val: string) => {
    // must must be exactly 13 digits
    if (val.length >= 10 && val.length <= 15) {
      return true;
    }
    return "Must be a valid account number";
  },
  phoneNumber: (val: string) => {
    // must must be exactly 10 digits
    if (val.length === 10) {
      return true;
    }
    return "Must be a valid phone number";
  },
});

const timer = () => {
  // Set the date we're counting down to
  let y = 3 * 60 * 1000;
  let tokenExp = new Date().getTime();

  // Update the count down every 1 second
  var x = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();
    // Find the distance between now and the count down date
    timeDiff.value = tokenExp + y - now;

    if (timeDiff.value < 0) {
      clearInterval(x);
    }
  }, 1000);
};

watch(
  () => timeDiff.value,
  async (newValue) => {
    if (newValue) {
      // Time calculations for days, hours, minutes and seconds
      mins.value = Math.floor((newValue % (1000 * 60 * 60)) / (1000 * 60));
      secs.value = Math.floor((newValue % (1000 * 60)) / 1000);
    }
  }
);

const getOTP = async () => {
  loading.value = true;

  const requestData = {
    phone: phone.value,
  };

  try {
    const data = await $fetch("/api/request-otp", {
      method: "post",
      body: requestData,
      headers: { "API-KEY": runtimeConfig["public"]["apiKey"] },
    });
    uiStore.alertText = "OTP sent successfully";
    uiStore.alertStatus = true;
    uiStore.alert = true;
    showOTP.value = true;
    timer();
  } catch (error: any) {
    uiStore.alertText = error?.data?.data?.detail ?? error?.data?.data ?? error?.data?.message;
    uiStore.alertStatus = false;
    uiStore.alert = true;
  } finally {
    loading.value = false;
  }
};

const verifyOTP = async () => {
  formStore.loading = true;

  const otpData = {
    phone: phone.value,
    otp: otp.value,
  };
  try {
    const data = await $fetch("/api/verify-otp", {
      method: "post",
      body: otpData,
      headers: { "API-KEY": runtimeConfig["public"]["apiKey"] },
    });
    uiStore.alertText = "OTP verified successfully";
    uiStore.alertStatus = true;
    uiStore.alert = true;
    showOTP.value = false;
    showFields.value = true;
  } catch (error: any) {
    uiStore.alertText = error?.data?.data?.detail ?? error?.data?.message;
    uiStore.alertStatus = false;
    uiStore.alert = true;
  } finally {
    formStore.loading = false;
  }
};


const submitForm = async () => {
  const formData = new FormData();

  formData.append("agent_code", agent.value.toUpperCase());
  formData.append("id_card_front", frontImage.value);
  if (backImage.value) {
    formData.append("id_card_back", backImage.value);
  }
  formData.append("name", name.value);
  formData.append("phone", phone.value);
  formData.append("id_card_type", idType.value);
  formData.append("id_card_number", ghanaCard.value);
  formData.append("digital_address", address.value);
  formData.append("email", email.value);
  formData.append("otp", otp.value);

  if (agent.value) {
    localStorage.setItem('agent_code', agent.value)
  }

  try {
    uiStore.loading = true;
    const data = await $fetch("/api/submit", {
      method: "post",
      body: formData,
      headers: { "API-KEY": runtimeConfig["public"]["apiKey"] },
    });
    formStore.notify = true;
  } catch (error: any) {
    uiStore.alertText = error?.data?.data?.detail ?? error?.data?.data ?? error?.data?.message;
    uiStore.alertStatus = false;
    uiStore.alert = true;
  } finally {
    uiStore.loading = false;
  }
};

const formCheck = () => {
  frontImage.value = undefined;
  backImage.value = undefined;
  ghanaCard.value = "";
  if (idType.value == "gh_card") {
    ghCardNotSelected.value = false;
  } else {
    ghCardNotSelected.value = true;
  }
};

// watch(() => agent.value, () => {
//   if (agent.value) {
//     localStorage.setItem("agent_code", agent.value);
//   }
// }
// );

const clearAgentCode = () => {
  localStorage.removeItem("agent_code")
  agent.value = ''
  agentCode.value = undefined
}

onMounted(async () => {
  if (route.query?.agent == "true" || route.query?.agent == "1") {
    if (localStorage.getItem("agent_code")) {
      agent.value = localStorage.getItem("agent_code") as string
      agentCode.value = agent.value
    }
  }

 
});
</script>

<template>
  <v-container  style="margin-top: 72px;">
    <v-card max-width="700" class="mx-auto" elevation="2">
      <v-toolbar
        title="Customer Registration"
        class="bg-newgas text-white"
      />
      <v-form @submit.prevent="submitForm" v-model="form">
        <v-card-text>
          <p class="text-error text-body-1 font-weight-bold text-center">{{ formStore.error }}</p>
          <div v-if="route.query?.agent == 'true' || route.query?.agent == '1'">
            <p class="text-body-1 mb-1">Agent Code*</p>
            <div class="d-flex ga-2">
              <v-text-field variant="outlined" density="comfortable" v-model="agent"
                :rules="[rules.required]" placeholder="Eg. xxxx" :readonly="agentCode !== undefined" />
                <v-tooltip text="Clear Agent code" v-if="agentCode">
                  <template v-slot:activator="{ props }">
                    <v-btn text="Clear" color="newgas" v-bind="props" style="margin-top: 6px;" @click="clearAgentCode"/>
                  </template>
                </v-tooltip>
            </div>
          </div>
          <div>
            <p class="text-body-1 mb-1">
              Full Name <span class="text-error">*</span>
            </p>
            <v-text-field
              variant="outlined"
              density="comfortable"
              v-model="name"
              :rules="[rules.required]"
              placeholder="Eg. Kwadwo Mensah"
            />
          </div>
          <div>
            <p class="text-body-1 mb-1">Email</p>
            <v-text-field
              variant="outlined"
              density="comfortable"
              v-model="email"
              placeholder="Eg. kwadwomensah@example.com"
            />
          </div>
          <div>
            <p class="text-body-1 mb-1">
              Phone Number <span class="text-error">*</span>
            </p>
            <div class="d-flex ga-2">
              <v-text-field
                variant="outlined"
                density="comfortable"
                v-model="phone"
                type="number"
                :rules="[rules.phoneNumber]"
                placeholder="Eg. 024xxxxxxx"
              />

              <v-btn
                v-if="!showFields"
                text="Verify"
                color="newgas"
                :loading="loading"
                :disabled="phone.length !== 10 || timeDiff > 0"
                @click="getOTP"
                style="margin-top: 6px"
              />
              <v-tooltip text="Verified" v-else>
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-check-circle"
                    variant="text"
                    color="success"
                  />
                </template>
              </v-tooltip>
            </div>
            <div v-if="showOTP">
              <p class="text-body-1 mb-1">
                Please enter OTP code sent to {{ phone }}
              </p>
              <div class="d-flex align-center" :class="xs ? 'ga-0' : 'ga-5'">
                <v-otp-input v-model="otp" />
                <v-btn icon="mdi-send-variant" variant="text" color="newgas" @click="verifyOTP" v-if="xs" :loading="formStore.loading" :disabled="otp.length !== 6"/>
                <v-btn
                  text="Submit"
                  color="newgas"
                  @click="verifyOTP"
                  :loading="formStore.loading"
                  :disabled="otp.length !== 6"
                  v-else
                />
              </div>
              <div class="d-flex align-center ga-2">
                <div>
                  <p v-if="timeDiff > 0" class="text-body-2">
                    Haven’t received yet? Resend in {{ mins }}:{{ secs }}
                  </p>
                  <p v-if="timeDiff < 0" class="text-body-2">Resend</p>
                </div>
                <!-- <v-btn text="Resend" class="bg-newgas" @click="getOTP" :loading="loading" :disabled=""/> -->
                <v-tooltip text="Resend code">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-reload"
                      @click="getOTP"
                      v-bind="props"
                      variant="text"
                      color="newgas"
                      :disabled="timeDiff > 0"
                    />
                  </template>
                </v-tooltip>
              </div>
            </div>
          </div>
          <div v-if="showFields">
            <p class="text-body-1 mb-1">Digital Address</p>
            <v-text-field
              variant="outlined"
              density="comfortable"
              v-model="address"
              placeholder="Eg. BS-xxxx-xxxx"
            />
          </div>
          <div v-if="showFields">
            <p class="text-body-1 mb-1">
              ID Type <span class="text-error">*</span>
            </p>
            <v-select
              variant="outlined"
              density="comfortable"
              v-model="idType"
              placeholder="Eg. Passport"
              :items="[
                { title: 'Ghana Card', value: 'gh_card' },
                { title: 'Passport', value: 'passport' },
              ]"
              item-title="title"
              item-value="value"
              :rules="[rules.required]"
              @update:model-value="formCheck"
            />
          </div>
          <div v-if="idType == 'gh_card'">
            <div>
              <p class="text-body-1 mb-1">
                Ghana Card ID <span class="text-error">*</span>
              </p>
              <v-text-field
                variant="outlined"
                density="comfortable"
                v-model="ghanaCard"
                :rules="[rules.ghcard]"
                placeholder="Eg. GHA-XXXXXXXXX-X"
              />
            </div>

            <p class="text-body-1 mb-1">
              Upload Ghana Card <span class="text-error">*</span>
            </p>
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
              <p class="text-body-1 mb-1">
                Passport ID <span class="text-error">*</span>
              </p>
              <v-text-field
                variant="outlined"
                density="comfortable"
                v-model="ghanaCard"
                :rules="[rules.passport]"
                placeholder="Eg. GXXXXXXX"
              />
            </div>
            <p class="text-body-1 mb-1">
              Upload Passport Bio Page <span class="text-error">*</span>
            </p>
            <div class="w-100">
              <PictureUpload
                v-model="frontImage"
                side="Bio Page"
                class="w-100"
              />
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
        <v-card-actions v-if="showFields" class="px-5 pb-5">
          <v-btn
            type="submit"
            text="Submit"
            class="bg-newgas"
            size="large"
            :loading="uiStore.loading"
            :disabled="
              !(form && frontImage && (backImage || ghCardNotSelected))
            "
            block
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
  <Feedback />
  <SucessNotice />
</template>
