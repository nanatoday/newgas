<script setup lang="ts">
import { useDisplay } from "vuetify";
import { useUiStore } from "~/stores/ui";

const runtimeConfig = useRuntimeConfig()
const formStore = useFormStore();
const uiStore = useUiStore();
const { balance } = storeToRefs(formStore);
const route = useRoute();
const router = useRouter()
const { smAndDown } = useDisplay();

const form = ref<boolean>(false);
const frontImage = ref<any>();
const backImage = ref<any>();
const name = ref<string>("");
const email = ref<string>("");
const phone = ref<string>("");
const address = ref<string>("");
const agent = ref<any>();
const ghanaCard = ref<string>("");
const idType = ref<string>("");
const ghCardNotSelected = ref<boolean>(true);
const rules = ref({
  required: (val: string) => {
    if (val) {
      return true;
    }
    return "Field is required";
  },
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
  amount: (val: string) => {
    // must not be less than 0
    if (parseFloat(val) > 0 && parseFloat(val) <= balance.value) {
      return true;
    }
    return "Must be a valid amount or Insufficient funds";
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
const agentCode = ref<any>();

const submitForm = async () => {
  const formData = new FormData();

  formData.append("agent_code", agent.value);
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
  try {
    uiStore.loading = true;
    const data = await $fetch("/api/submit", {
      method: "post",
      body: formData,
      headers: { "API-KEY": runtimeConfig['public']['apiKey'] },
    });
    formStore.notify = true
  } catch (error: any) {
    uiStore.alertText = error?.data?.data ?? error?.data?.message;
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

watch(
  () => agent.value,
  () => {
    localStorage.setItem("agent_code", agent.value);
  }
);

onMounted(() => {
  if (route.query?.agent == "true" || route.query?.agent == "1") {
    if (localStorage.getItem("agent_code")) {
      agent.value = localStorage.getItem("agent_code")?.toString();
    }
  }
});
</script>

<template>
  <v-container :class="smAndDown ? 'mt-10' : 'mt-16'" class="bg-accent">
    <v-card max-width="700" class="mx-auto">
      <v-toolbar title="Customer Registration" class="bg-newgas text-white" />
      <v-form
        @submit.prevent="
          form && frontImage && (backImage || ghCardNotSelected)
            ? submitForm()
            : ''
        "
        v-model="form"
      >
        <v-card-text>
          <!-- <p class="text-error text-body-1 font-weight-bold text-center">{{ formStore.error }}</p> -->
          <div v-if="route.query?.agent == 'true' || route.query?.agent == '1'">
            <p class="text-body-1 mb-1">Agent Code*</p>
            <v-text-field
              variant="outlined"
              density="comfortable"
              v-model="agent"
              placeholder="Eg. xxxx"
            />
          </div>
          <div>
            <p class="text-body-1 mb-1">Name*</p>
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
            <p class="text-body-1 mb-1">Phone Number*</p>
            <v-text-field
              variant="outlined"
              density="comfortable"
              v-model="phone"
              :rules="[rules.required, rules.phoneNumber]"
              placeholder="Eg. 024xxxxxxx"
            />
          </div>
          <div>
            <p class="text-body-1 mb-1">Digital Address</p>
            <v-text-field
              variant="outlined"
              density="comfortable"
              v-model="address"
              placeholder="Eg. BS-xxxx-xxxx"
            />
          </div>
          <div>
            <p class="text-body-1 mb-1">ID Type*</p>
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
              <p class="text-body-1 mb-1">Ghana Card ID*</p>
              <v-text-field
                variant="outlined"
                density="comfortable"
                v-model="ghanaCard"
                :rules="[rules.required]"
                placeholder="Eg. GHA-xxxxxxxxx-x"
              />
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
              <v-text-field
                variant="outlined"
                density="comfortable"
                v-model="ghanaCard"
                :rules="[rules.required]"
                placeholder="Eg. xxxxxxxxx"
              />
            </div>
            <p class="text-body-1 mb-1">Upload Passport Bio Page*</p>
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
        <v-card-actions class="px-5 pb-5">
          <v-btn
            class="bg-newgas"
            :disabled="
              !(form && frontImage && (backImage || ghCardNotSelected))
            "
            :loading="uiStore.loading"
            type="submit"
            text="Submit"
            size="large"
            block
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
  <Feedback />
  <SucessNotice />
</template>
