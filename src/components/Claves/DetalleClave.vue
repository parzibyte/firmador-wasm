<script setup lang="ts">
const router = useRouter()
import type { Clave } from '@/Clases';
import CustomButton from '../Forms/CustomButton.vue';
import { useFilterStore } from '@/stores/filter';
import { useRouter } from 'vue-router';
const filterStore = useFilterStore();
const emit = defineEmits(["eliminar"]);

interface Props {
    clave: Clave,
}
const props = withDefaults(defineProps<Props>(), {
    clave: () => ({
        costoMensual: 0,
        id: 0,
        nombre: "",
        plantilla: "",
        plantillaFirma: "",
        privada: "",
        publica: "",
        separador: "",
        tipo: 'Local',
    })
});
const editar = () => {
    router.push({
        name: "editarClave", params: {
            id: props.clave.id,
        }
    })
}

const eliminar = () => {
    emit("eliminar", props.clave);
}
</script>
<template>
    <div class="flex flex-col border border-gray-200 rounded-md p-1 mb-1">
        <div class="flex flex-row justify-between">
            <div class="font-bold text-lg">
                {{ props.clave.nombre }}
            </div>
            <div class="text-2xl text-green-500">{{ filterStore.dinero(props.clave.costoMensual) }}</div>
        </div>
        <div class="flex flex-row">
            <CustomButton @click="editar()" tipo="warning">Editar</CustomButton>
            <CustomButton @click="eliminar()" tipo="danger">Eliminar</CustomButton>
        </div>
    </div>
</template>