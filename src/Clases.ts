export type Cliente = {
    id: number,
    nombre: string,
    correo: string,
    claveApi: string,
    fechaRegistro: string,
}
export type TipoDeLicencia = "Local" | "API";
export type Clave = {
    id: number,
    privada: string,
    publica: string,
    nombre: string,
    costoMensual: number,
    plantilla: string,
    plantillaFirma: string,
    separador: string,
    tipo: TipoDeLicencia,
}
export type Firma = {
    firma: string,
    id: number,
    id_clave: number,
    id_cliente: number,
    fecha_inicio: string,
    fecha_fin: string,
    fecha_generacion: string,
    clienteJson: string,
    monto: number,
    cliente: Cliente,
    claveJson: string,
    clave: Clave,
};
export type Ajustes = {
    id: number,
    id_chat_telegram: string,
    token_telegram: string,
};