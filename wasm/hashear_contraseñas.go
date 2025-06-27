//go:build js && wasm
// +build js,wasm

package main

import (
	"crypto/hmac"
	"crypto/sha256"

	"golang.org/x/crypto/bcrypt"
)

/*
// Sal de contraseñas
// openssl rand -base64 32
*/

func hashearContraseña(contraseñaPlana string, claveHmac string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword(hmacHash(contraseñaPlana, claveHmac), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}
func hmacHash(contraseñaPlana string, claveHmac string) []byte {
	clave := []byte(claveHmac)
	mac := hmac.New(sha256.New, clave)
	mac.Write([]byte(contraseñaPlana))
	return mac.Sum(nil)
}

func compararContraseñaConHash(contraseñaPlana string, contraseñaHasheada string, claveHmac string) error {
	contraseñaPlanaConHmac := hmacHash(contraseñaPlana, claveHmac)
	hashComoByte := []byte(contraseñaHasheada)
	return bcrypt.CompareHashAndPassword(hashComoByte, contraseñaPlanaConHmac)
}
