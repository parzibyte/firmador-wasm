const UN_MINUTO_EN_MILISEGUNDOS = 60000;
const SEPARADOR_FECHA_Y_HORA_ISO8601 = "T";
/**
 * Recibe una fecha de tipo Date y
 * la devuelve en formato ISO8601 
 * por ejemplo 2013-01-18
 */
export const formatearFechaComoISO8601 = (fecha: Date) => {
    const fechaFormateada = fecha.toISOString();
    return fechaFormateada.substring(0, fechaFormateada.lastIndexOf(SEPARADOR_FECHA_Y_HORA_ISO8601))
}
export const obtenerFechaActualComoISO8601 = (): string => {
    return formatearFechaComoISO8601(obtenerFechaActualAjustada());
}

export const obtenerFechaActualAjustada = (): Date => {
    return new Date(Date.now() - new Date().getTimezoneOffset() * UN_MINUTO_EN_MILISEGUNDOS);
}

export const obtenerFechaFuturo = (dias: number, desde: Date): Date => {
    return new Date(desde.getTime() + (dias * 24 * 60 * 60 * 1000))
}

export const obtenerFechaFuturoComoISO8601 = (dias: number, desde: Date): string => {
    return formatearFechaComoISO8601(obtenerFechaFuturo(dias, desde));
}

export const fechaISO8601ADate = (fecha: string): Date => {
    return new Date(fecha + "T00:00:00");
}



export const diferenciaEnDiasDeDosFechas = (fecha1: Date,fecha2: Date): number => {
    return (fecha1.getTime() - fecha2.getTime()) / 1000 / 60 / 60 / 24;
}