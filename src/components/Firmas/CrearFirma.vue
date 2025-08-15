<script setup lang="ts">
import type { Clave, Cliente } from '@/Clases';
import { useDatabaseStore } from '@/stores/db';
import { computed, onMounted, ref, type Ref } from 'vue';
import SelectWithAutocomplete from '../Forms/SelectWithAutocomplete.vue';
import SelectWithoutAutocomplete from '../Forms/SelectWithoutAutocomplete.vue';
import { diferenciaEnDiasDeDosFechas, fechaISO8601ADate, obtenerFechaActualAjustada, obtenerFechaActualComoISO8601, obtenerFechaFuturoComoISO8601 } from '@/fechas';
import CustomInput from '../Forms/CustomInput.vue';
import CustomButton from '../Forms/CustomButton.vue';
import { generarMensaje } from '@/utiles';
import { useFilterStore } from '@/stores/filter';
import { useToastStore } from '@/stores/toast';
import { useRouter } from 'vue-router';
const router = useRouter();
const filterStore = useFilterStore()
const toastStore = useToastStore();
const meses = ref(0);
const fechaInicio: Ref<string> = ref(obtenerFechaActualComoISO8601())
const fechaFin: Ref<string> = ref(obtenerFechaActualComoISO8601())
const cargando = ref(false);
const clienteSeleccionado: Ref<Cliente> = ref({
    claveApi: "",
    correo: "",
    fechaRegistro: "",
    id: 0,
    nombre: "",
});
const claveSeleccionada: Ref<Clave> = ref({
    costoMensual: 0,
    nombre: "",
    plantillaFirma: "",
    separador: "",
    plantilla: "",
    privada: "",
    publica: "",
    id: 0,
    tipo: "Local",
});
const dbStore = useDatabaseStore();
const claves: Ref<Array<Clave>> = ref([]);
const filtrarClientes = async (busqueda: string) => {
    return await dbStore.exec(`SELECT 
    id, nombre, correo, claveApi, fechaRegistro 
    FROM clientes 
    WHERE clientes.nombre LIKE ? OR clientes.correo LIKE ? LIMIT 10`, [
        `%${busqueda}%`,
        `%${busqueda}%`,
    ]);
}
const init = async () => {
    claves.value = await dbStore.exec(`SELECT id, nombre, privada,
    publica, costoMensual, plantilla, plantillaFirma, separador, tipo
     FROM claves`, []);
    aumentarMeses();
}

const mensajeGenerado = () => {
    if (!clienteSeleccionado.value) {
        return "";
    }
    if (!claveSeleccionada.value.plantillaFirma) {
        return "";
    }
    if (!clienteSeleccionado.value.id) {
        return "";
    }
    return claveSeleccionada.value.plantillaFirma
        .replace("{claveApiCliente}", clienteSeleccionado.value.claveApi)
        .replace("{fechaInicio}", fechaInicio.value)
        .replace("{fechaFin}", fechaFin.value);

}
onMounted(init)
const aumentarMeses = () => {
    meses.value++;
    refrescarFechaFin()
}
const disminuirMeses = () => {
    meses.value--;
    refrescarFechaFin()
}

const refrescarFechaFin = () => {
    fechaFin.value = obtenerFechaFuturoComoISO8601(meses.value * 30, fechaISO8601ADate(fechaInicio.value));
}
const firmar = async () => {
    cargando.value = true;
    let firma, error;
    if (claveSeleccionada.value.tipo === "Local") {
        const respuestaFirmaLocal = await dbStore.firmar(claveSeleccionada.value.privada, mensajeGenerado(), claveSeleccionada.value.separador);
        firma = respuestaFirmaLocal.datos;
        error = respuestaFirmaLocal.error;
    } else {
        try {
            const respuestaHttp = await fetch(claveSeleccionada.value.plantillaFirma, {
                body: JSON.stringify({
                    claveApi: clienteSeleccionado.value.claveApi,
                    fechaInicio: fechaInicio.value,
                    fechaFin: fechaFin.value,
                    clavePrivada: claveSeleccionada.value.privada,
                    contraseña: claveSeleccionada.value.separador,
                }),
                method: "POST",
            });
            firma = await respuestaHttp.text();
        } catch (e: any) {
            error = e.message;
        }
    }
    if (error) {
        alert("Error firmando: " + error);
        return;
    }

    const firmasInsertadas = await dbStore.exec(`INSERT INTO firmas
    (id_cliente, id_clave, firma, fecha_inicio, fecha_fin, monto, fecha_generacion)
    VALUES
    (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
    `, [
        clienteSeleccionado.value.id,
        claveSeleccionada.value.id,
        firma,
        fechaInicio.value,
        fechaFin.value,
        costo.value,
        obtenerFechaActualComoISO8601(),
    ]);
    const firmaInsertada = firmasInsertadas[0];
    const mensaje = generarMensaje(claveSeleccionada.value.plantilla, firmaInsertada.firma, clienteSeleccionado.value, fechaInicio.value, fechaFin.value)
    await navigator.clipboard.writeText(mensaje)
    cargando.value = true;
    toastStore.mostrarToast("Guardado", "success", 500);
    router.push({ name: "firmas" });
}
const cantidadMeses = computed(() => {
    return diferenciaEnDiasDeDosFechas(fechaISO8601ADate(fechaFin.value), fechaISO8601ADate(fechaInicio.value)) / 30;
});

const costo = computed(() => {
    return cantidadMeses.value * claveSeleccionada.value.costoMensual;
});

const puedeFirmar = computed(() => {
    if (!claveSeleccionada.value.id) {
        return false;
    }
    if (!clienteSeleccionado.value.id) {
        return false;
    }
    return true;
});

const mostrarClienteSeleccionado = (cliente: Cliente) => {
    if (!cliente.id) {
        return "";
    }
    return cliente.nombre + ' (' + cliente.correo + ')'
}
</script>
<template>
    <div class="flex flex-col">
        <h2 class="text-xl">Crear firma</h2>
        <SelectWithAutocomplete v-model="clienteSeleccionado" :get-items-function="filtrarClientes" label="Cliente"
            :display-item-function="mostrarClienteSeleccionado">
            <template #item="{ item, index }">
                {{ item.nombre }} <strong>{{ item.correo }}</strong>
            </template>
        </SelectWithAutocomplete>
        <SelectWithoutAutocomplete label="Clave" v-model="claveSeleccionada" :elementos="claves"
            :to-string="(clave: Clave) => clave.nombre">
        </SelectWithoutAutocomplete>
        <strong>{{ mensajeGenerado() }}{{ claveSeleccionada.separador }}AQUÍ LA FIRMA</strong>
        <CustomInput @change="refrescarFechaFin()" type="date" label="Fecha inicio" v-model="fechaInicio"></CustomInput>
        <div class="flex flex-row items-center w-full">
            <CustomButton :loading="cargando" :disabled="meses <= 1" @click="disminuirMeses">-</CustomButton>
            <CustomInput class="w-full" v-model="fechaFin" type="date" label="Fecha fin"></CustomInput>
            <CustomButton :loading="cargando" @click="aumentarMeses">+</CustomButton>
        </div>
        <p>
            {{ diferenciaEnDiasDeDosFechas(fechaISO8601ADate(fechaFin), fechaISO8601ADate(fechaInicio)) }} días
            <strong>({{
                cantidadMeses }} meses)</strong> desde
            <strong>
                {{
                    filterStore.fechaSinHoraDesdeCadenaISO8601(fechaInicio)
                }}
            </strong>
        </p>
        <div class="text-xl text-green-500">{{ filterStore.dinero(costo) }}</div>
        <CustomButton :loading="cargando" :disabled="!puedeFirmar" @click="firmar()">Firmar</CustomButton>
    </div>
</template>