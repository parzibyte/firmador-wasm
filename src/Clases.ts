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
export type Firma = {
    id: number,
    id_clave: number,
    id_cliente: number,
    fecha_inicio: string,
    fecha_fin: string,
    fecha_generacion: string,
    clienteJson: string,
    monto: number,
    cliente: Cliente,
};