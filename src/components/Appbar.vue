<script setup lang="ts">
import { useDisplay } from 'vuetify';

const { xs } = useDisplay()
</script>

<template>
    <v-app-bar class=" bg-newgas pa-2" :class="xs ? 'px-2' : 'px-8'">
        <template v-slot:prepend>
            <v-img src="../assets/Newgas.png" alt="Newgas Logo" width="50"/>
            <p class="text-h6 ml-3">NEWGAS</p>
        </template>
    </v-app-bar>
</template>