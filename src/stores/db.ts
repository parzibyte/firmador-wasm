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
console.log("Y terminamos de todo")
export const useDatabaseStore = defineStore('database', () => {
    async function exec(consulta: string, argumentos: Array<any>): Promise<any> {
        console.log("Invocando a exec cuando DbHelper es %o y su exec es %o pero si es undefined es %o", DbHelper, DbHelper.exec, DbHelper.asasasxxx)
        // @ts-ignore
        return await DbHelper.exec(consulta, argumentos);
    }
    return { exec };
});