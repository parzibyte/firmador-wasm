export type Cliente = {
    id: number,
    nombre: string,
    correo: string,
    claveApi: string,
    fechaRegistro: string,
}
export type Clave = {
    id: number,
    privada: string,
    publica: string,
    nombre: string,
    costoMensual: number,
    plantilla: string,
    plantillaFirma: string,
    separador: string,
}