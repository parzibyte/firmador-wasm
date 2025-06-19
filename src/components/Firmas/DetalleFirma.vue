<script setup lang="ts">
import type { Firma } from '@/Clases';

interface Props {
    firma: Firma,
}
const props = withDefaults(defineProps<Props>(), {
    firma: () => ({
        cliente: {
            claveApi: "",
            correo: "",
            fechaRegistro: "",
            id: 0,
            nombre: "",
        },
        clienteJson: "",
        fecha_fin: "",
        fecha_generacion: "",
        fecha_inicio: "",
        id: 0,
        id_clave: 0,
        id_cliente: 0,
        monto: 0,
    })
});
</script>
<template>
    <div class="flex flex-col shadow-sm p-1 rounded-md">{{ props.firma.fecha_inicio }}</div>
</template>