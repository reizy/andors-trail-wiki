AT_FOLDER = "../andors-trail/AndorsTrail/"

gen:
	mkdir public/backgrounds || true
	node bin/generateMapImages.js
gen_grave:
	mkdir public/backgrounds || true
	node bin/generateMapImages.js graveyard1
link:
	rm public/[rxdv][arm]* || true
	ln -s "../${AT_FOLDER}res/values" "public/values"
	ln -s "../${AT_FOLDER}res/xml" "public/xml"
	ln -s "../${AT_FOLDER}res/drawable" "public/drawable"
	ln -s "../${AT_FOLDER}res/raw" "public/raw"
run:
	npm start