<script setup lang="ts">
import { computed, ref } from "vue"
type PropiedadesDelComponente = {
    label: string,
    modelValue: number | string,
    mensajeValidacion?: string,
};
const propiedades = withDefaults(defineProps<PropiedadesDelComponente>(), {
    label: "",
    modelValue: "",
    mensajeValidacion: "",
})
const emit = defineEmits(['update:modelValue'])
const referenciaAlVerdaderoInput = ref();
const value = computed({
    get() {
        return propiedades.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
});

const clasesSegunValidacion = () => {
    if (propiedades.mensajeValidacion) {
        return "focus:border-red-500 border-red-500";
    }
    return "focus:border-blue-500";
}

const enfocarVerdaderoInput = () => {
    if (referenciaAlVerdaderoInput.value) {
        referenciaAlVerdaderoInput.value.focus();
    }
}
const enfocarYseleccionar = () => {
    enfocarVerdaderoInput();
    if (referenciaAlVerdaderoInput.value) {
        referenciaAlVerdaderoInput.value.select();
    }
}
defineExpose({ enfocar: enfocarVerdaderoInput, enfocarYseleccionar, });

const manejarScroll = (e: Event) => {
    if (estaEnfocado.value) {
        e.preventDefault();
        referenciaAlVerdaderoInput.value.blur()
    }
}
const estaEnfocado = ref(false);
</script>
<template>
    <div class="flex flex-col p-1">
        <label class="inline-block font-semibold mb-1 text-md">{{ propiedades.label }}</label>
        <input @focus="estaEnfocado = true" @blur="estaEnfocado = false" @wheel="manejarScroll"
            ref="referenciaAlVerdaderoInput" :class="clasesSegunValidacion()"
            class="focus:border-2 max-w-full w-full max-h-10 h-10 border border-gray-200  rounded-md p-1 outline-none text-xl disabled:bg-gray-200 disabled:cursor-not-allowed"
            v-bind="$attrs" v-model="value" :placeholder="propiedades.label">
        <small>{{ propiedades.mensajeValidacion }}</small>
    </div>
</template>