<script setup lang="ts">
import { ref } from 'vue';
import CustomInput from '../Forms/CustomInput.vue';
import CustomButton from '../Forms/CustomButton.vue';
import { useDatabaseStore } from '@/stores/db';
import { useToastStore } from '@/stores/toast';
const dbStore = useDatabaseStore();
const toastStore = useToastStore();
const plana = ref("")
const hasheada = ref("")
const hmac = ref("")
const cargando = ref(false);
const comparar = async () => {
    cargando.value = true;
    const resultado = await dbStore.comparar(plana.value, hasheada.value, hmac.value);
    if (resultado.error) {
        toastStore.mostrarToast(`Error: ${resultado.error}`, "error", 1500);
    } else {
        toastStore.mostrarToast("Coinciden", "success", 1000);
    }
    cargando.value = false;
}
const hashear = async () => {
    cargando.value = true;
    const resultado = await dbStore.hashear(plana.value, hmac.value);
    if (resultado.error) {
        toastStore.mostrarToast(`Error: ${resultado.error}`, "error", 1500);
    } else {
        hasheada.value = resultado.datos;
    }
    cargando.value = false;
}
</script>
<template>
    <div class="flex flex-col">
        <p>Aquí puedes hashear contraseñas con Bcrypt usando HMAC. Para hashear escribe la clave HMAC y la contraseña
            plana, el resultado se mostrará en la clave hasheada. Para comprobar escribe el hash y la clave HMAC, luego
            haz clic en Comprobar</p>
        <CustomInput v-model="hmac" label="HMAC"></CustomInput>
        <CustomInput v-model="plana" label="Contraseña plana"></CustomInput>
        <CustomInput v-model="hasheada" label="Contraseña hasheada"></CustomInput>
        <div class="flex flex-row">
            <CustomButton :disabled="!hmac || !plana" :loading="cargando" @click="hashear()">Hashear</CustomButton>
            <CustomButton :disabled="!hmac || !hasheada" :loading="cargando" @click="comparar()">Comparar</CustomButton>
        </div>
    </div>
</template>