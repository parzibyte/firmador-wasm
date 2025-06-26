<script setup lang="ts">
import { computed } from "vue";
import Loading from "vue-material-design-icons/Loading.vue";
import IndicadorCargando from "./IndicadorCargando.vue";
type TipoDeBoton = "success" | "info" | "warning" | "primary" | "danger" | "transparent"
type PropiedadesDelComponente = {
    loading?: boolean,
    disabled?: boolean,
    tipo?: TipoDeBoton,
};
const propiedades = withDefaults(defineProps<PropiedadesDelComponente>(), {
    loading: false,
    disabled: false,
    tipo: "info",
});
const clasesSegunTipo = computed(() => {
    return {
        "bg-red-500 hover:bg-red-400 focus:bg-red-400 disabled:bg-red-200 text-white": propiedades.tipo === "danger",
        "bg-sky-500 hover:bg-sky-400 focus:bg-sky-400 disabled:bg-sky-200 text-white": propiedades.tipo === "info",
        "bg-green-500 hover:bg-green-400 focus:bg-green-400 disabled:bg-green-200 text-white": propiedades.tipo === "success",
        "bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 disabled:bg-indigo-200 text-white": propiedades.tipo === "primary",
        "bg-yellow-500 hover:bg-yellow-400 focus:bg-yellow-400 disabled:bg-yellow-200 text-white": propiedades.tipo === "warning",
        "text-gray-400 hover:text-gray-600": propiedades.tipo === "transparent",
    };
});
</script>
<template>
    <button :disabled="propiedades.disabled || propiedades.loading" :class="clasesSegunTipo"
        class="cursor-pointer rounded-md px-3 py-2 m-1 text-sm font-semibold inline-flex items-center focus:outline-none max-h-min  max-w-max flex flex-row w-full">
        <IndicadorCargando :loading="propiedades.loading"></IndicadorCargando>
            <slot></slot>
    </button>
</template>