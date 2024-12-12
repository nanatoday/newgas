<script setup lang="ts">
import { useDisplay } from 'vuetify';

const { xs,smAndDown } = useDisplay()
</script>

<template>
    <v-app-bar class=" bg-newgas" :class="xs ? 'px-2' : 'px-8', xs? 'pa-0' : 'pa-1'">
        <template v-slot:prepend>
            <v-img src="../assets/Newgas.png" alt="Newgas Logo" :width="smAndDown ? '40' : '50'"/>
            <p class="text-h6 ml-3">NEWGAS</p>
        </template>
    </v-app-bar>
</template>