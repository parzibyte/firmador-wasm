import "./wasm_exec.js"
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import * as Comlink from "comlink"
import MODULO_WASM from "./main.wasm?url"
const NOMBRE_BASE_DE_DATOS = "firmador.sqlite3";
let db;
Comlink.expose({
    exec: async (consulta, argumentos) => {
        argumentos = argumentos || [];
        console.log("Exec desde wasm!")
        return await db.exec({
            sql: consulta,
            bind: argumentos,
            returnValue: "resultRows",
            rowMode: "object"
        })
    },
    initWasm: async () => {
        const go = new Go();
        const result = await WebAssembly.instantiateStreaming(fetch(MODULO_WASM), go.importObject)
        go.run(result.instance);
        console.log("initWasm listo")
    },
    initDatabase: async () => {
        const sqlite3 = await sqlite3InitModule({
            print: console.log,
            printErr: console.error,
        });
        if ('opfs' in sqlite3) {
            db = new sqlite3.oo1.OpfsDb(NOMBRE_BASE_DE_DATOS);
            console.log('OPFS is available, created persisted database at', db.filename);
        } else {
            db = new sqlite3.oo1.DB(NOMBRE_BASE_DE_DATOS, 'ct');
            console.log('OPFS is not available, created transient database', db.filename);
        }
        await db.exec(`CREATE TABLE IF NOT EXISTS claves(
				id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
				privada TEXT NOT NULL,
				publica TEXT NOT NULL
				)`);
        console.log("initDatabase listo")
    },
});