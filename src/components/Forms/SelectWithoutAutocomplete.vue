<script setup lang="ts">
import { computed, ref } from 'vue';

type PropiedadesDelComponente = {
    label?: string,
    modelValue: any,
    mensajeValidacion?: string,
    elementos: any,
    toString: (arg0: any) => string,
};

const propiedades = withDefaults(defineProps<PropiedadesDelComponente>(), {
    label: "",
    modelValue: "",
    mensajeValidacion: "",
    elementos: [],
    toString: (arg0: any) => arg0.toString(),
})
const emit = defineEmits(['update:modelValue', "blur"])
const value = computed({
    get() {
        return propiedades.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
});

const referenciaAlVerdaderoSelect = ref();
const enfocarVerdaderoSelect = () => {
    if (referenciaAlVerdaderoSelect.value) {
        referenciaAlVerdaderoSelect.value.focus();
    }
}
const abrirVerdaderoSelect = () => {
    if (referenciaAlVerdaderoSelect.value) {
        if (referenciaAlVerdaderoSelect.value.showPicker) {
            referenciaAlVerdaderoSelect.value.showPicker()
        } else {
            referenciaAlVerdaderoSelect.value.focus()
        }
    }
}

defineExpose({
    abrir: abrirVerdaderoSelect,
    enfocar: enfocarVerdaderoSelect,
});
const clasesSegunValidacion = () => {
    if (propiedades.mensajeValidacion) {
        return "focus:border-red-500 border-red-500";
    }
    return "focus:border-blue-500";
}
const onBlur = () => {
    emit("blur");
}

</script>
<template>
    <div class="flex flex-col p-1">
        <label class="inline-block font-semibold mb-1 text-md">{{ propiedades.label }}</label>
        <select @keydown.native.escape="onBlur" @blur="onBlur" ref="referenciaAlVerdaderoSelect" v-model="value" :class="clasesSegunValidacion()"
            class="focus:border-2 border border-gray-200 focus:border-blue-500 rounded-md h-10 w-full p-1 outline-none text-xl">
            <option :value="elemento" v-for="elemento in elementos">{{ propiedades.toString(elemento) }}</option>
        </select>
        <small>{{ propiedades.mensajeValidacion }}</small>
    </div>
</template>