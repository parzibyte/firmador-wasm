GO=go
GOFMT=gofmt
OUTPUT_FILE=main.wasm
.DEFAULT_GOAL=run
export GOOS=js
export GOARCH=wasm

run:
	set GOOS=js
	set GOARCH=wasm
	# Formateando
	${GOFMT} -w .
	# Compilando
	${GO} build -o ../src/${OUTPUT_FILE}