import type { Cliente } from "./Clases";

export const generarMensaje = (plantilla: string, firma: string, cliente: Cliente, fechaInicio: string, fechaFin: string): string => {
    return plantilla
        .replaceAll("{correoCliente}", cliente.correo)
        .replaceAll("{firma}", firma)
        .replaceAll("{fechaInicio}", fechaInicio)
        .replaceAll("{fechaFin}", fechaFin)
}
