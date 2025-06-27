//go:build js && wasm
// +build js,wasm

package main

import (
	"syscall/js"
)

var envolturaBd EnvolturaDeBaseDeDatos

type EnvolturaDeBaseDeDatos struct {
	BaseDeDatos js.Value
}

type Respuesta struct {
	Datos  interface{}
	Accion string
}

func main() {
	c := make(chan struct{}, 0)

	js.Global().Set("comparar", js.FuncOf(func(this js.Value, args []js.Value) any {
		contraseñaPlana := args[0]
		contraseñaHasheada := args[1]
		claveHmac := args[2]
		respuesta := js.Global().Get("Object").New()
		err := compararContraseñaConHash(contraseñaPlana.String(), contraseñaHasheada.String(), claveHmac.String())
		respuesta.Set("datos", err == nil)
		respuesta.Set("error", "")
		if err != nil {
			respuesta.Set("error", err.Error())
		}
		return respuesta
	}))

	js.Global().Set("hashear", js.FuncOf(func(this js.Value, args []js.Value) any {
		contraseñaPlana := args[0]
		claveHmac := args[1]
		respuesta := js.Global().Get("Object").New()
		contraseñaHasheada, err := hashearContraseña(contraseñaPlana.String(), claveHmac.String())
		respuesta.Set("datos", contraseñaHasheada)
		respuesta.Set("error", "")
		if err != nil {
			respuesta.Set("error", err.Error())
		}
		return respuesta
	}))

	js.Global().Set("firmar", js.FuncOf(func(this js.Value, args []js.Value) any {
		clave := args[0]
		mensajeCompleto := args[1]
		separador := args[2]

		respuesta := js.Global().Get("Object").New()
		firma, err := firmarRegresandoBase64(clave.String(), mensajeCompleto.String(), separador.String())

		respuesta.Set("datos", firma)
		respuesta.Set("error", "")
		if err != nil {
			respuesta.Set("error", err.Error())

		}

		return respuesta
	}))
	<-c
}
