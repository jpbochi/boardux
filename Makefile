all: test lint

DRUN_VERSION=master
DNODE=./drun -ND -e NPM_CONFIG_LOGLEVEL=

drun:
	curl -sSL https://raw.githubusercontent.com/jpbochi/drun/${DRUN_VERSION}/drun > drun
	chmod +x drun

install: drun
	${DNODE} yarn --no-progress --prefer-offline --silent

install-force: drun
	${DNODE} yarn --no-progress --check-files

ci: install-force test lint

test: install
	${DNODE} npm test

lint: install
	${DNODE} npm run lint
