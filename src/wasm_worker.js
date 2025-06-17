import "./wasm_exec.js"
//import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
//import * as Comlink from "comlink"
import MODULO_WASM from "./main.wasm?url"
const go = new Go();
const result = await WebAssembly.instantiateStreaming(fetch(MODULO_WASM), go.importObject)
go.run(result.instance);
self.onmessage = async (evento) => {
    if (evento.data.accion === "firmar") {
        const resultado = self.firmar(...evento.data.argumentos)
        self.postMessage({ accion: "firmado", argumentos: resultado })
    }
    console.log({ evento })
}
