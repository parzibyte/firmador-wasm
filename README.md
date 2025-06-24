# firmador-wasm
Copiar wasm_exec.js

```
cp "C:\Program Files\Go\misc\wasm\wasm_exec.js" ./src/
```

# Versiones

```
C:\Users\parzibyte>go version
go version go1.21.5 windows/amd64

C:\Users\parzibyte>node -v
v20.11.0

C:\Users\parzibyte>
```

# Generar claves RSA

**OpenSSL 3.5.0 8 Apr 2025 (Library: OpenSSL 3.5.0 8 Apr 2025)**

## Privada

`openssl genrsa -traditional -out clave_privada.pem 3072`

## Pública

`openssl rsa -in clave_privada.pem -pubout -out clave_publica.pem`

# Todo junto

```
openssl genrsa -traditional -out clave_privada.pem 3072
openssl rsa -in clave_privada.pem -pubout -out clave_publica.pem
```
