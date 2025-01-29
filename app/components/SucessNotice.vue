<script setup lang="ts">
import { useFormStore } from '~/stores/form';
import { useDisplay } from 'vuetify';
const { xs } = useDisplay()

const formStore = useFormStore()

const refresh = () => {
  formStore.notify = false
  window.location.reload()
}
</script>

<template>
  <v-dialog v-model="formStore.notify" persistent transition="dialog-top-transition">
    <v-card max-width="400" class="mx-auto text-center" :class="xs ? 'pa-1' : 'pa-2'">
      <v-card-text>
        <v-icon class="text-success" size="70px">mdi-check-circle</v-icon>
        <p class="text-body-1 font-weight-bold" v-if="xs">Form Submitted Successfully</p>
        <p class="text-h6" v-else>Form Submitted Successfully</p>
        <div :class="xs ? 'mt-5' : 'mt-7'" class=" text-center">
          <v-btn text="Close" color="newgas" @click="refresh" />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>