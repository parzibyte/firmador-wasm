<script setup lang="ts">
import Loading from "vue-material-design-icons/Loading.vue";
type PropiedadesDelComponente = {
    loading?: boolean,
};
const propiedades = withDefaults(defineProps<PropiedadesDelComponente>(), {
    loading: false,
});
</script>
<template>
    <Loading v-if="propiedades.loading" class="animate-spin mr-1"></Loading>
</template>