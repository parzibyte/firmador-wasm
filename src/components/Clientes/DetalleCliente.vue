<script setup lang="ts">
import type { Cliente } from '@/Clases';
import CustomButton from '../Forms/CustomButton.vue';
import { useFilterStore } from '@/stores/filter';
const filterStore = useFilterStore()
interface Props {
    cliente: Cliente,
}
const props = withDefaults(defineProps<Props>(), {
    cliente: () => ({
        claveApi: "",
        correo: "",
        fechaRegistro: "",
        id: 0,
        nombre: "",
    })
});
</script>
<template>
    <div class="flex flex-col shadow-sm p-1 rounded-md">
        <div class="flex flex-row">
            {{ props.cliente.nombre }}
            <strong class="ml-1">
                {{ props.cliente.correo }}
            </strong>
        </div>
        <div class="flex flex-row">
            <CustomButton tipo="warning">Editar</CustomButton>
            <CustomButton tipo="danger">Eliminar</CustomButton>
        </div>
    </div>
</template>