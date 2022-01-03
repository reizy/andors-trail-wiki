# Andor's Trail Directory V2

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## To run localy

1. You need game sources (values, xml, drawable, raw) at "public" directry. I use "link.bat" to make Symbolic Link.
2. You need have NPM installed. You can get it at https://nodejs.org/en/download/. 
3. Run 'npm install'
4. Run 'npm run gen' to render TMS to JPG for global map pages. Yes, it really takes a long time. (You can run 'npm run gen graveyard1' to render only one map 'graveyard1')
5. Run 'npm start' for starting local development server.
6. Run 'npm build' to generate production build.
7. To make route from any page to index.html I use "build.bat"

## To run localy (for UNIX-system)

If your system is UNIX, you can ues makefile instead of ".bat". Tested on my MacBookPro.

1. `make link`: Make symbolic link to game resources (values, xml, drawable, raw) at "public" directry.
2. You need have NPM installed. You can get it at https://nodejs.org/en/download/.
3. `npm install`: Install required node.js package from package.json
4. `make gen`: Render TMS to JPG for global map pages. Yes, it really takes a long time. (You can run `make gen_grave` to render only one map 'graveyard1' for test). Execute 1602.92s in my MBP.
5. `make run`: Starting local development server.
6. `npm run build`: Generate production build.
<!-- 7. To make route from any pages to index.html I use "build.bat" -->

## Learn More

<p>If you want more information about game, please visit the [official game page on Google Play](https://play.google.com/store/apps/details?id=com.gpl.rpg.AndorsTrail) or the [main game forum](https://www.andorstrail.com).</p> 


