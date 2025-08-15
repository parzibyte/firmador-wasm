<script setup lang="ts">
import { type Clave } from '@/Clases';
import { onMounted, ref, type Ref } from 'vue';
import CustomButton from '../Forms/CustomButton.vue';
import { useRouter } from 'vue-router';
import { useDatabaseStore } from '@/stores/db';
import DetalleClave from './DetalleClave.vue';
const router = useRouter();
const claves: Ref<Array<Clave>> = ref([]);
const dbStore = useDatabaseStore();
const crearClave = () => {
    router.push({ name: "crearClave" });
}

const refrescarClaves = async () => {

    claves.value = await dbStore.exec(`SELECT id, privada, publica, nombre, costoMensual, plantilla, separador, plantillaFirma, tipo FROM claves`, []);
}

const init = async () => {
    refrescarClaves();
}

const onEliminarClave = async (clave: Clave) => {
    if (!confirm(`¿Eliminar clave ${clave.nombre}? Esta opción no se puede deshacer`)) {
        return;
    }
    await dbStore.exec(`DELETE FROM claves WHERE id = ?`, [clave.id]);
    await refrescarClaves();
}
onMounted(() => { init() });
</script>
<template>
    <div class="flex flex-col">
        <CustomButton @click="crearClave()">Nueva</CustomButton>
        <DetalleClave @eliminar="onEliminarClave" v-for="clave in claves" :clave></DetalleClave>
    </div>
</template>