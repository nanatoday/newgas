<script setup lang="ts">

useHead({
  title: "Newgas Onboarding",
});

const runtimeConfig = useRuntimeConfig()
const uiStore = useUiStore()
const skeletonLoader = ref<boolean>(false)
const existingCustomer = ref<number>()
const { xs } = useDisplay()
const route = useRoute()

const reload = () => {
    window.location.reload();
};

onMounted(async () => {
    if (route.params?.token) {
        skeletonLoader.value = true;
        try {
            const data = await $fetch(`/api/verify-token/${route.params?.token}`, {
                method: "get",
                headers: { "API-KEY": runtimeConfig["public"]["apiKey"] },
            });
            existingCustomer.value = 1
        } catch (error: any) {
            existingCustomer.value = 2
            uiStore.alertText = error?.data?.data?.detail ?? error?.data?.data ?? error?.data?.message;
            uiStore.alertStatus = false;
            uiStore.alert = true;
        } finally {
            skeletonLoader.value = false;
        }
    }
})

</script>

<template>
    <v-skeleton-loader class="bg-transparent mx-auto mt-16" :class="xs ? 'w-100' : 'w-50', xs ? 'px-2' : 'px-0'" type="card" :loading="skeletonLoader">
        <div class="w-100">
            <v-window v-model="existingCustomer">
                <v-window-item :value="1">
                    <v-container>
                        <v-card max-width="500" class="mx-auto text-center" elevation="5">
                            <v-card-text>
                                <div class="d-flex align-center justify-center ga-2 mb-6 mt-6">
                                    <p class="text-body-1 font-weight-bold">
                                        Phone number verified
                                    </p>
                                    <v-icon icon="mdi-check-circle" color="success" />
                                </div>
                                <p class="text-body-1 font-weight-bold mb-6">
                                    You can click <a href="https://newgas.online" style="color: #A5101B;" class="text-decoration-none">here</a> to visit our website
                                </p>
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-window-item>
    
                <v-window-item :value="2" disabled>
                    <v-container>
                        <v-card max-width="500" class="mx-auto text-center" elevation="5">
                            <v-card-text>
                                <p class="text-body-1 font-weight-bold mt-6 mb-6">
                                    {{ uiStore.alertText }}
                                </p>
                                <div v-if="!uiStore.alertText.includes('registered')">
                                    <p class="text-body-1 font-weight-bold mb-6">
                                        Click the button to try again
                                    </p>
                                    <v-btn text="Try again" class="bg-newgas mb-3" @click="reload" />
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-window-item>
            </v-window>
        </div>
    </v-skeleton-loader>
</template>