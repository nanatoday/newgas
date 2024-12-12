  <script lang="ts" setup>
import { useFormStore } from '@/stores/form';
import { useUiStore } from '@/stores/ui';

  const uiStore = useUiStore()
  const formStore = useFormStore()
</script>

<template>
  <v-responsive>
    <Form/>
    <Notify v-if="formStore.notify"/>
    <Feedback v-if="uiStore.alert"/>
  </v-responsive>
</template>

<route lang="json">
  {
    "meta": {
      "title": "Newgas Form",
      "layout": "FormLayout"
    }
  }
</route>
