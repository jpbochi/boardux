all: test lint

DRUN_VERSION=master

drun:
	curl -sSL https://raw.githubusercontent.com/jpbochi/drun/${DRUN_VERSION}/drun > drun
	chmod +x drun

install: drun
	./drun -ND yarn --no-progress

test: install
	./drun -ND npm test

lint: install
	./drun -ND npm run lint
