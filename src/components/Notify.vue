<script setup lang="ts">
import { useFormStore } from '@/stores/form';

const formStore = useFormStore()

const refresh = () => {
    formStore.notify = false
    window.location.reload()
}
</script>

<template>
   <v-dialog
    v-model="formStore.notify"
    persistent
    transition="dialog-top-transition"
  >
    <v-card width="400" class="mx-auto pa-3 text-center">
        <v-card-text>
            <p class="text-h6">Form Submitted Successfully</p>
            <div class="mt-7 text-center">
                <v-btn text="Close" color="newgas" @click="refresh"/>
            </div>
        </v-card-text>
    </v-card>
  </v-dialog>
</template>
