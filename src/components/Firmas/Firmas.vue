<script setup lang="ts">
import type { Firma } from '@/Clases';
import { useDatabaseStore } from '@/stores/db';
import { onMounted, ref, type Ref } from 'vue';
import DetalleFirma from './DetalleFirma.vue';
const firmas: Ref<Array<Firma>> = ref([]);
const dbStore = useDatabaseStore()

const init = async () => {
    firmas.value = await dbStore.exec(`SELECT 
    firmas.id,
    firmas.firma,
    firmas.fecha_inicio,
    firmas.fecha_fin,
    firmas.monto,
    firmas.fecha_generacion,
    json_object('id', clientes.id) AS clienteJson
    FROM firmas
    INNER JOIN clientes ON clientes.id = firmas.id_cliente
    INNER JOIN claves ON claves.id = firmas.id_clave`, []);
}
onMounted(() => {
    init()
})

</script>
<template>
    <div class="flex flex-col">
        <DetalleFirma v-for="firma in firmas" :firma></DetalleFirma>
    </div>
</template>