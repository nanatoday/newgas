<script setup lang="ts">
import { useDisplay } from 'vuetify';

const { xs,smAndDown } = useDisplay()
</script>

<template>
    <v-app-bar class=" bg-newgas elevation-0" :class="xs ? 'px-2' : 'px-8', xs? 'pa-0' : 'pa-1'">
        <template v-slot:prepend>
            <a href="https://newgas.online" class="d-flex align-center text-decoration-none text-white">
                <v-img src="~/assets/NewgasFinalLogo.png" alt="Newgas Logo" :width="smAndDown ? '40' : '50'"/>
                <p class="text-h6 ml-3">NEWGAS</p>
            </a>
        </template>
    </v-app-bar>
</template>
