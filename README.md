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

# Compilar para producción

Abre una terminal en la raíz. Ejeucta:

```bash
npm run build
workbox generateSW workbox-config.cjs

```

Distribuye la carpeta `dist`. Recuerda configurar los encabezados para que el OPFS y SQLite3 funcionen bien.

Ejemplo de **.htaccess** si usas Apache:

```apache
Header always set Cross-Origin-Opener-Policy "same-origin"
Header always set Cross-Origin-Embedder-Policy "require-corp"
AddType application/wasm wasm
```