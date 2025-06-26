import type { Cliente } from "./Clases";

export const generarMensaje = (plantilla: string, firma: string, cliente: Cliente, fechaInicio: string, fechaFin: string): string => {
    const formateadorFecha = new Intl.DateTimeFormat("es-MX", { dateStyle: 'medium', });
    return plantilla
        .replaceAll("{correoCliente}", cliente.correo)
        .replaceAll("{firma}", firma)
        .replaceAll("{fechaInicio}", formateadorFecha.format(new Date(fechaInicio + "T00:00:00")))
        .replaceAll("{fechaFin}", formateadorFecha.format(new Date(fechaFin + "T00:00:00")))
}
