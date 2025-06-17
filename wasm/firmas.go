//go:build js && wasm
// +build js,wasm

package main

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"errors"
)

func firmar(clavePrivadaComoCadena, mensaje string) (string, error) {
	clavePrivada, err := ParseRsaPrivateKeyFromPemStr(clavePrivadaComoCadena)
	if err != nil {
		return "", err
	}
	sumaDeVerificacionDeMensaje, err := hashearMensaje(mensaje)
	if err != nil {
		return "", err
	}

	mensajeFirmado, err := rsa.SignPSS(rand.Reader, clavePrivada, crypto.SHA256, sumaDeVerificacionDeMensaje, nil)
	if err != nil {
		return "", err
	}
	mensajeFirmadoEnBase64, err := base64.StdEncoding.EncodeToString(mensajeFirmado), nil
	return mensajeFirmadoEnBase64, err
}

func ParseRsaPrivateKeyFromPemStr(privPEM string) (*rsa.PrivateKey, error) {
	block, _ := pem.Decode([]byte(privPEM))
	if block == nil {
		return nil, errors.New("failed to parse PEM block containing the key")
	}

	priv, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		return nil, err
	}

	return priv, nil
}

func hashearMensaje(mensaje string) ([]byte, error) {
	mensajeComoBytes := []byte(mensaje)
	hasheador := sha256.New()
	_, err := hasheador.Write(mensajeComoBytes)
	if err != nil {
		return []byte{}, err
	}
	return hasheador.Sum(nil), nil
}

func firmarRegresandoBase64(clave, mensajeCompleto, separador string) (string, error) {
	firma, err := firmar(clave, mensajeCompleto)
	if err != nil {
		return "", err
	}
	serial := mensajeCompleto + separador + firma
	serialBase64 := base64.StdEncoding.EncodeToString([]byte(serial))
	return serialBase64, nil
}
