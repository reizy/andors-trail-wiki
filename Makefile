AT_FOLDER = "../andors-trail/AndorsTrail/"

build:
	export NODE_OPTIONS=--openssl-legacy-provider
	npm run build
	cp build/index.html build/404.html
gen:
	mkdir public/backgrounds || true
	node bin/generateMapImages.js
	node bin/getVersions.js
gen_test:
	mkdir public/backgrounds || true
	node bin/generateMapImages.js graveyard1
link:
	rm public/[rxdv][arm]* || true
	ln -s "../${AT_FOLDER}res/values" "public/values"
	ln -s "../${AT_FOLDER}res/xml" "public/xml"
	ln -s "../${AT_FOLDER}res/drawable" "public/drawable"
	ln -s "../${AT_FOLDER}res/raw" "public/raw"
run:
	export NODE_OPTIONS=--openssl-legacy-provider
	npm start