<script setup lang="ts">
import { useUiStore } from '~/stores/ui';

const uiStore = useUiStore()
const{ smAndDown } = useDisplay()
</script>

<template>
  <v-snackbar
    v-model="uiStore.alert"
    :color="uiStore.alertStatus ? 'success' : 'error'"
    location="top right"
    multi-line
    :timeout="4000"
    :class="smAndDown ? 'mt-3' : 'mt-4'"
    max-width="100%"
  >
    <div class="d-flex ga-1 align-center">
      <p class="text-body-1 font-weight-medium overflow-auto">{{ uiStore.alertText }}</p>
    </div>
    <template #actions>
      <v-icon
        :icon="uiStore.alertStatus ? 'mdi-check-circle' : 'mdi-close-circle'"
        @click="uiStore.alert = false"
      />
    </template>
  </v-snackbar>
</template>
