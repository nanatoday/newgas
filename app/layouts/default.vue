<script setup lang="ts">
import '~/assets/css/global.css'
</script>

<template>
  <v-app>
    <AppBar />
    <v-main>
      <slot />
    </v-main>

  </v-app>
</template>
