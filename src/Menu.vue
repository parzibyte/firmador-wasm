<script setup lang="ts">
import Signature from "vue-material-design-icons/Signature.vue";
import FileDocumentMultiple from "vue-material-design-icons/FileDocumentMultiple.vue";
import AccountGroup from "vue-material-design-icons/AccountGroup.vue";
import KeyChain from "vue-material-design-icons/KeyChain.vue";
import ChartBar from "vue-material-design-icons/ChartBar.vue";
import BackupRestore from "vue-material-design-icons/BackupRestore.vue";
import Cogs from "vue-material-design-icons/Cogs.vue";
import { useRouter } from "vue-router";
const router = useRouter();
interface Props {
    mostrarMenu: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    mostrarMenu: false,
});

const navegarA = (destino: string) => {
    router.push({ name: destino })
}

</script>
<template>
    <div v-if="props.mostrarMenu" class="flex flex-col w-full md:w-max">
        <div @click="navegarA('crearFirma')"
            class="p-2  border-b-2 border-gray-500 hover:bg-gray-400 cursor-pointer font-bod flex flex-row text-gray-700 text-xl">
            <div>
                <Signature></Signature>
            </div>
            <div class="ml-2">
                Nueva firma
            </div>
        </div>
        <div @click="navegarA('firmas')"
            class="p-2  border-b-2 border-gray-500 hover:bg-gray-400 cursor-pointer font-bod flex flex-row text-gray-700 text-xl">
            <div>
                <FileDocumentMultiple></FileDocumentMultiple>
            </div>
            <div class="ml-2">
                Firmas
            </div>
        </div>
        <div @click="navegarA('clientes')"
            class="p-2  border-b-2 border-gray-500 hover:bg-gray-400 cursor-pointer font-bod flex flex-row text-gray-700 text-xl">
            <div>
                <AccountGroup></AccountGroup>
            </div>
            <div class="ml-2">
                Clientes
            </div>
        </div>
        <div @click="navegarA('claves')"
            class="p-2  border-b-2 border-gray-500 hover:bg-gray-400 cursor-pointer font-bod flex flex-row text-gray-700 text-xl">
            <div>
                <KeyChain></KeyChain>
            </div>
            <div class="ml-2">
                Claves
            </div>
        </div>
        <div @click="navegarA('reporte')"
            class="p-2  border-b-2 border-gray-500 hover:bg-gray-400 cursor-pointer font-bod flex flex-row text-gray-700 text-xl">
            <div>
                <ChartBar></ChartBar>
            </div>
            <div class="ml-2">
                Reporte
            </div>
        </div>
        <div @click="navegarA('copiaDeSeguridad')"
            class="p-2  border-b-2 border-gray-500 hover:bg-gray-400 cursor-pointer font-bod flex flex-row text-gray-700 text-xl">
            <div>
                <BackupRestore></BackupRestore>
            </div>
            <div class="ml-2">
                Copia de seguridad
            </div>
        </div>
        <div @click="navegarA('ajustes')"
            class="p-2  border-b-2 border-gray-500 hover:bg-gray-400 cursor-pointer font-bod flex flex-row text-gray-700 text-xl">
            <div>
                <Cogs></Cogs>
            </div>
            <div class="ml-2">
                Ajustes
            </div>
        </div>
    </div>
</template>