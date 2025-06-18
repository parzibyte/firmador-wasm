<script setup lang="ts">
import { ref, type Ref } from 'vue';
import CustomInput from '../Forms/CustomInput.vue';
import CustomButton from '../Forms/CustomButton.vue';
import { useDatabaseStore } from '@/stores/db';
import type { Cliente } from '@/Clases';
const UN_MINUTO_EN_MILISEGUNDOS = 60000;
const SEPARADOR_FECHA_Y_HORA_ISO8601 = "T";
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
const obtenerFechaActual = (): string => {
    /*
               toISOString devuelve la fecha como:
               2024-02-15T17:05:50.957Z
               El substring es para remover lo que hay después de la T
               teniendo una fecha como:
               2024-06-26
           */
    const fecha = fechaActualEnFormatoISO8601();
    return fecha.substring(0, fecha.lastIndexOf(SEPARADOR_FECHA_Y_HORA_ISO8601))
}
const fechaActualEnFormatoISO8601 = (): string => {
    return new Date(Date.now() - new Date().getTimezoneOffset() * UN_MINUTO_EN_MILISEGUNDOS).toISOString()
}

const guardar = async () => {
    while (true) {
        const clave = generarCadenaHexAleatoria(20);
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
                obtenerFechaActual(),
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