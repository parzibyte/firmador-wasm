import { defineStore } from 'pinia'
import DbWorker from "@/wasm_worker?worker"
import * as Comlink from "comlink"
const worker = new DbWorker();
const DbHelper = Comlink.wrap(worker);
/*
Ignoramos los errores de TypeScript porque no encuentro la manera
de que se respeten los tipos de Comlink de dbworker.js
*/
// @ts-ignore
await DbHelper.initWasm()
// @ts-ignore
await DbHelper.initDatabase()
export const useDatabaseStore = defineStore('database', () => {
    async function firmar(clavePrivadaRSA: string, mensaje: string, separador: string): Promise<any> {
        // @ts-ignore
        return await DbHelper.firmar(clavePrivadaRSA, mensaje, separador);
    }
    async function exec(consulta: string, argumentos: Array<any>): Promise<any> {
        // @ts-ignore
        return await DbHelper.exec(consulta, argumentos);
    }
    return { exec, firmar };
});