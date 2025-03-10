<template>
    <div :style="navbarStyle">
        <slot name="start"></slot>

        <div :style="{ textAlign: menuPlacement, flex: 1 }">
            <n-drawer v-if="isMobileOrTablet" v-model:show="drawerActive" :placement="drawerPlacement">
                <n-drawer-content title="Menu" :body-content-style="{ padding: 0 }" :header-style="{
                    padding: '15px'
                }">
                    <template #header>
                        <slot name="start"></slot>
                    </template>
                    <n-menu mode="vertical" :default-value="$route.path" :inverted="menuInverted" :options="menuOptions" />
                </n-drawer-content>
            </n-drawer>

            <n-menu v-if="!isMobileOrTablet" :default-value="$route.path" :inverted="menuInverted" mode="horizontal"
                :options="menuOptions" />
        </div>

        <slot name="end"></slot>

        <n-button v-if="isMobileOrTablet" text @click="() => drawerActive = true">
            <NaiveIcon :name="menuToggleIcon" :size="menuToggleIconSize"></NaiveIcon>
        </n-button>

    </div>
</template>

<script setup lang = "ts" >
//@ts-ignore
import { ref, computed, h, useRoute, watch } from "#imports"
//@ts-ignore
import { NuxtLink } from "#components"
import type { StyleValue } from "vue"
import type { MenuOption } from "naive-ui"
import NaiveIcon from "./NaiveIcon.vue"
import useNaiveDevice from "../composables/useNaiveDevice"
import useNaiveTheme from "../composables/useNaiveTheme"
import type { NavbarRoute } from "../types"
import { NDrawer, NMenu, NDrawerContent, NButton } from "naive-ui"

const { isMobileOrTablet } = useNaiveDevice()

const drawerActive = ref(false)
const route = useRoute()
watch(route, () => drawerActive.value = false)

const props = withDefaults(defineProps<{
    routes: NavbarRoute[],
    menuToggleIcon?: string,
    menuToggleIconSize?: number,
    menuInverted?: boolean,
    menuPlacement?: "right" | "left" | "center",
    drawerPlacement?: "top" | "right" | "bottom" | "left",
    sticky?: boolean,
}>(), {
    menuToggleIcon: "material-symbols:menu-rounded",
    menuPlacement: "left",
    drawerPlacement: "left",
    menuInverted: false,
    sticky: true,
    menuToggleIconSize: 26
})

const naiveTheme = useNaiveTheme()

const navbarStyle = computed<StyleValue>(() => ({
    position: props.sticky ? 'sticky' : 'static',
    backgroundColor: naiveTheme.value?.common?.bodyColor,
    top: "0px",
    zIndex: 100,
    padding: isMobileOrTablet ? "15px" : "10px 15px",
    boxShadow: '0px 0px 2px 0px #a3a3a3',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1em',
}))


const menuOptions = computed<MenuOption[]>(() => {
    const cb = (routes: NavbarRoute[]) => routes.map(route => {

        const menuOption: MenuOption =
        {
            label: route.path ? () => h(NuxtLink, { to: route.path }, { default: () => route.label }) : route.label,
            icon: route.icon ? () => h(NaiveIcon, { name: route.icon }) : undefined,
            key: route.path || route.label,
        }

        if (route.children) {
            menuOption.children = cb(route.children);
        }

        return menuOption;
    });

    return cb(props.routes)
})
</script>
