<script setup lang="ts">
import { computed, nextTick, ref } from "vue"
type PropiedadesDelComponente = {
    label?: string,
    modelValue: string,
    mensajeValidacion?: string,
};
const propiedades = withDefaults(defineProps<PropiedadesDelComponente>(), {
    label: "",
    modelValue: "",
    mensajeValidacion: "",
})
const referenciaAlTextarea = ref();
const emit = defineEmits(['update:modelValue'])
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
const enfocarVerdaderoTextarea = () => {
    if (referenciaAlTextarea.value) {
        nextTick(() => {
            referenciaAlTextarea.value.focus();
        });
    }
}
defineExpose({
    "enfocar": enfocarVerdaderoTextarea,
})
</script>
<template>
    <div class="flex flex-col p-1">
        <label class="inline-block font-semibold mb-1">{{ propiedades.label }}</label>
        <textarea ref="referenciaAlTextarea" :placeholder="propiedades.label" :class="clasesSegunValidacion()"
            class="max-w-full w-full border border-gray-200  rounded-md p-1 outline-none focus:border-2" v-bind="$attrs"
            v-model="value"></textarea>
        <small>{{ propiedades.mensajeValidacion }}</small>
    </div>
</template>