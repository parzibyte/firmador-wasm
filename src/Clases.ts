export type Cliente = {
    id: number,
    nombre: string,
    correo: string,
    claveApi: string,
    fechaRegistro: string,
}
export type Clave = {
    privada: string,
    publica: string,
    nombre: string,
    costo: number,
    plantilla: string,
    plantillaFirma: string,
    separador: string,
}