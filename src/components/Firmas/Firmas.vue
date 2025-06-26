<script setup lang="ts">
import type { Firma } from '@/Clases';
import { useDatabaseStore } from '@/stores/db';
import { onMounted, ref, type Ref } from 'vue';
import DetalleFirma from './DetalleFirma.vue';
import CustomButton from '../Forms/CustomButton.vue';
import { useRouter } from 'vue-router';
const firmas: Ref<Array<Firma>> = ref([]);
const dbStore = useDatabaseStore()
const router = useRouter();


const refrescarFirmas = async () => {
    const firmasSinMapear = await dbStore.exec(`SELECT 
    firmas.id,
    firmas.firma,
    firmas.fecha_inicio,
    firmas.fecha_fin,
    firmas.monto,
    firmas.fecha_generacion,
    json_object('id', clientes.id, 'nombre', clientes.nombre, 'correo', clientes.correo) AS clienteJson,
    json_object('id', claves.id, 'nombre', claves.nombre, 'plantilla', claves.plantilla) AS claveJson
    FROM firmas
    INNER JOIN clientes ON clientes.id = firmas.id_cliente
    INNER JOIN claves ON claves.id = firmas.id_clave`, []);
    firmas.value = firmasSinMapear.map((firma: Firma) => {
        firma.cliente = JSON.parse(firma.clienteJson);
        firma.clave = JSON.parse(firma.claveJson);
        return firma;
    })
}
const init = async () => {
    await refrescarFirmas();
}

const nuevaFirma = () => {
    router.push({ name: "crearFirma" })
}
onMounted(() => {
    init()
})

const eliminar = async (firma: Firma) => {
    await dbStore.exec(`DELETE FROM firmas WHERE id = ?`, [firma.id]);
    await refrescarFirmas();
}

</script>
<template>
    <div class="flex flex-col">
        <CustomButton @click="nuevaFirma()">Nueva</CustomButton>
        <DetalleFirma @eliminar="eliminar(firma)" v-for="firma in firmas" :firma></DetalleFirma>
    </div>
</template>