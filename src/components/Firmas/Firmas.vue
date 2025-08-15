<script setup lang="ts">
import type { Clave, Cliente, Firma } from '@/Clases';
import { useDatabaseStore } from '@/stores/db';
import { computed, onMounted, ref, type Ref } from 'vue';
import DetalleFirma from './DetalleFirma.vue';
import CustomButton from '../Forms/CustomButton.vue';
import { useRouter } from 'vue-router';
import SelectWithAutocomplete from '../Forms/SelectWithAutocomplete.vue';
import SelectWithoutAutocomplete from '../Forms/SelectWithoutAutocomplete.vue';
import { obtenerFechaActualComoISO8601 } from '@/fechas';
import CustomInput from '../Forms/CustomInput.vue';
import FilterVariant from "vue-material-design-icons/FilterVariant.vue";
import PlusCircle from "vue-material-design-icons/PlusCircle.vue";
import SortAscending from "vue-material-design-icons/SortAscending.vue";
import SortDescending from "vue-material-design-icons/SortDescending.vue";
import { useFilterStore } from '@/stores/filter';
const filterStore = useFilterStore();
const firmas: Ref<Array<Firma>> = ref([]);
const claves: Ref<Array<Clave>> = ref([]);
const dbStore = useDatabaseStore()
const router = useRouter();
const cargando = ref(false);
type Ordenacion = {
    etiqueta: string,
    valor: string,
}
const columnasOrden: Ref<Array<Ordenacion>> = ref([
    {
        etiqueta: "Fecha inicio",
        valor: "firmas.fecha_inicio",
    },
    {
        etiqueta: "Fecha fin",
        valor: "firmas.fecha_fin",
    },
    {
        etiqueta: "Fecha generación",
        valor: "firmas.fecha_generacion",
    },
    {
        etiqueta: "Nombre cliente",
        valor: "clientes.nombre",
    },
    {
        etiqueta: "Monto",
        valor: "firmas.monto",
    },
]);
const modosOrden = ref(["Ascendente", "Descendente"]);

const ordenarPor = ref(columnasOrden.value[1]);
const modoOrden = ref(modosOrden.value[0]);
const mostrarFiltros = ref(false);
const montoTotal = computed(() => {
    let total = 0;
    for (const firma of firmas.value) {
        total += firma.monto;
    }
    return total;
})
const refrescarFirmas = async () => {
    let consulta = `SELECT 
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
    INNER JOIN claves ON claves.id = firmas.id_clave
    WHERE firmas.fecha_fin >= ?`
    const parametros: Array<any> = [fecha.value];
    if (clienteSeleccionado.value && clienteSeleccionado.value.id) {
        parametros.push(clienteSeleccionado.value.id);
        consulta += ` AND clientes.id = ?`
    }
    if (claveSeleccionada.value.id) {
        parametros.push(claveSeleccionada.value.id);
        consulta += ` AND claves.id = ?`
    }
    // Riesgo de inyección SQL pero estamos en el lado del cliente, podríamos sanitizar e incluso así podría seguir accediendo
    let verdaderoOrden = "DESC";
    if (modoOrden.value === "Ascendente") {
        verdaderoOrden = "ASC";
    }
    consulta += ` ORDER BY ${ordenarPor.value.valor} ${verdaderoOrden}`;
    cargando.value = true;
    const firmasSinMapear = await dbStore.exec(consulta, parametros);
    firmas.value = firmasSinMapear.map((firma: Firma) => {
        firma.cliente = JSON.parse(firma.clienteJson);
        firma.clave = JSON.parse(firma.claveJson);
        return firma;
    })
    cargando.value = false;
}
const init = async () => {
    const clavesObtenidas = await dbStore.exec(`SELECT id, nombre, privada,
    publica, costoMensual, plantilla, plantillaFirma, separador
     FROM claves`, []);
    clavesObtenidas.unshift({
        costoMensual: 0,
        nombre: "-- Todas --",
        plantillaFirma: "",
        separador: "",
        plantilla: "",
        privada: "",
        publica: "",
        id: 0,
    });
    claves.value = clavesObtenidas;
    claveSeleccionada.value = claves.value[0];
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

const fecha: Ref<string> = ref(obtenerFechaActualComoISO8601())

const clienteSeleccionado: Ref<Cliente> = ref({
    claveApi: "",
    correo: "",
    fechaRegistro: "",
    id: 0,
    nombre: "",
})

const filtrarClientes = async (busqueda: string) => {
    return await dbStore.exec(`SELECT 
    id, nombre, correo, claveApi, fechaRegistro 
    FROM clientes 
    WHERE clientes.nombre LIKE ? OR clientes.correo LIKE ? LIMIT 10`, [
        `%${busqueda}%`,
        `%${busqueda}%`,
    ]);
}


const mostrarClienteSeleccionado = (cliente: Cliente) => {
    if (!cliente.id) {
        return "";
    }
    return cliente.nombre + ' (' + cliente.correo + ')'
}

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


const esOrdenAscendente = computed(() => modoOrden.value === "Ascendente");

const cambiarModo = (nuevoModo: string) => {
    modoOrden.value = nuevoModo;
    refrescarFirmas();
}

</script>
<template>
    <div class="flex flex-col">
        <div class="flex flex-row">
            <CustomButton :loading="cargando" @click="nuevaFirma()">
                <PlusCircle></PlusCircle>
                Nueva
            </CustomButton>
            <CustomButton tipo="warning" @click="mostrarFiltros = !mostrarFiltros" :loading="cargando">
                <FilterVariant></FilterVariant>
                Filtrar
            </CustomButton>
        </div>

        <div class="flex flex-col" v-show="mostrarFiltros">
            <SelectWithAutocomplete @change="refrescarFirmas" v-model="clienteSeleccionado"
                :get-items-function="filtrarClientes" label="Filtrar por cliente"
                :display-item-function="mostrarClienteSeleccionado">
                <template #item="{ item, index }">
                    {{ item.nombre }} <strong>{{ item.correo }}</strong>
                </template>
            </SelectWithAutocomplete>
            <SelectWithoutAutocomplete @change="refrescarFirmas" label="Clave" v-model="claveSeleccionada"
                :elementos="claves" :to-string="(clave: Clave) => clave.nombre">
            </SelectWithoutAutocomplete>
            <CustomInput @change="refrescarFirmas" type="date" v-model="fecha"
                label="Cuya fecha de terminación sea superior o igual a">
            </CustomInput>
            <div class="flex flex-row items-end">
                <SelectWithoutAutocomplete @change="refrescarFirmas" label="Ordenar por" v-model="ordenarPor"
                    :elementos="columnasOrden" :to-string="(columna: Ordenacion) => columna.etiqueta">
                </SelectWithoutAutocomplete>
                <CustomButton v-show="esOrdenAscendente" @click="cambiarModo('Descendente')">
                    <SortAscending></SortAscending>
                </CustomButton>
                <CustomButton v-show="!esOrdenAscendente" @click="cambiarModo('Ascendente')">
                    <SortDescending></SortDescending>
                </CustomButton>
            </div>
        </div>
        <div class="flex flex-col">
            {{ firmas.length }} firmas.
            {{ filterStore.dinero(montoTotal) }}
        </div>
        <DetalleFirma @eliminar="eliminar(firma)" v-for="firma in firmas" :firma></DetalleFirma>
    </div>
</template>