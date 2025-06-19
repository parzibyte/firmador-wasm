<script setup lang="ts">
import { ref, type Ref } from 'vue';
import CustomInput from '../Forms/CustomInput.vue';
import CustomButton from '../Forms/CustomButton.vue';
import { useDatabaseStore } from '@/stores/db';
import type { Cliente } from '@/Clases';
import { obtenerFechaActualComoISO8601 } from '@/fechas';
const dbStore = useDatabaseStore();

const cliente: Ref<Cliente> = ref({
    claveApi: "",
    correo: "",
    fechaRegistro: "",
    id: 0,
    nombre: "",
});
const generarCadenaHexAleatoria = (longitud: number) => {
    let resultado = '';
    const caracteresHex = '0123456789abcdef';
    for (let i = 0; i < longitud; i++) {
        resultado += caracteresHex.charAt(Math.floor(Math.random() * caracteresHex.length));
    }
    return resultado;
}

const guardar = async () => {
    while (true) {
        const clave = generarCadenaHexAleatoria(8);
        const clientesQueTienenEstaClaveApi = await dbStore.exec(`SELECT COUNT(*) AS conteo FROM clientes WHERE
        claveApi = ? LIMIT 1`, [clave])
        const primeraFila = clientesQueTienenEstaClaveApi[0];
        const conteo = primeraFila.conteo;
        if (conteo <= 0) {
            const clienteRecienInsertado = await dbStore.exec(`INSERT INTO clientes(nombre, correo, fechaRegistro, claveApi) 
    VALUES
(?, ?, ?, ?) RETURNING *`, [
                cliente.value.nombre,
                cliente.value.correo,
                obtenerFechaActualComoISO8601(),
                clave,
            ])
            console.log({clienteRecienInsertado})
            break
        }
    }
}
</script>
<template>
    <div class="flex flex-col">
        <CustomInput v-model="cliente.nombre" label="Nombre"></CustomInput>
        <CustomInput v-model="cliente.correo" type="email" label="Correo"></CustomInput>
        <CustomButton @click="guardar">Guardar</CustomButton>
    </div>
</template>