<script setup lang="ts">
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore()
</script>

<template>
  <v-snackbar
    v-model="uiStore.alert"
    :timeout="6000"
    location="top right"
    color="error"
  >
    <div class="d-flex ga-1 align-center">
      <p class="text-body-1 font-weight-medium">{{ uiStore.alertText }}</p>
    </div>
    <template v-slot:actions>
      <v-icon
        @click="uiStore.alert = false"
        icon="mdi-close-circle"
      />
    </template>
  </v-snackbar>
</template>
