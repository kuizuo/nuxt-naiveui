<template>
    <n-button text @click="toggleColorMode">
        <NaiveIcon v-if="colorMode === 'dark'" name="material-symbols:light-mode-outline-sharp"></NaiveIcon>
        <NaiveIcon v-else name="material-symbols:dark-mode-outline-rounded"></NaiveIcon>
    </n-button>
</template>

<script setup>
import NaiveIcon from "./NaiveIcon.vue"
import useNaiveColorMode from "../composables/useNaiveColorMode";
import { NButton } from "naive-ui"

const { colorMode } = useNaiveColorMode()

function toggleColorMode() {
    colorMode.value = colorMode.value === "light" ? "dark" : "light"
}
</script>