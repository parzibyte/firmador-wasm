import { defineStore } from 'pinia'
export const useFilterStore = defineStore('filter', () => {
    const formateadorDinero = new Intl.NumberFormat("es-MX", { style: "currency", "currency": "MXN" });
    const formateadorFecha = new Intl.DateTimeFormat("es-MX", { dateStyle: 'medium', });
    function dinero(cantidad: number): string {
        return formateadorDinero.format(cantidad);
    }

    function fecha(f: Date): string {
        return formateadorFecha.format(f);
    }

    function fechaSinHoraDesdeCadenaISO8601(f: string): string {
        return formateadorFecha.format(new Date(f + "T00:00:00"));
    }
    return { dinero, fecha, fechaSinHoraDesdeCadenaISO8601 };
});