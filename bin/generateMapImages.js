const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')

const {XMLParser} = require('./xmlParser.js');
const {parseXmlMap}  = require('./mapParser.js');

const ZOOM = 32;
const ZOOM_OUT = 12;

function saveCanvas(canvas, fileName) {
    console.log(fileName);
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 })
    fs.writeFileSync('./public/backgrounds/' + fileName +'.jpg', buffer)
}

function drawCell(context, x, y, cell, layerList, thenDo) {
    layerList.forEach((e) => drawCellLayer(context, x, y, cell[e.name], thenDo));
}
function drawCellLayer(context, x, y, cell, thenDo) {
    if (!cell) return thenDo();

    const tileset = cell.tileset;


    loadImage('./public/drawable/' + tileset.name + '.png').then(image => {
      const dx = cell.localid % tileset.columns;
      const dy = Math.floor(cell.localid / tileset.columns);

      context.drawImage(image, dx * ZOOM, dy * ZOOM, ZOOM, ZOOM, x * ZOOM_OUT, y * ZOOM_OUT, ZOOM_OUT, ZOOM_OUT)
      thenDo();
    })
}
function drawCanvas(fileName, map) {
    const width = map.width * ZOOM_OUT;
    const height = map.height * ZOOM_OUT;

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    const layerList = map.layerList
        .filter((e)=>e.visible)
        .filter((l)=>!l.name.startsWith("walkable"));

    var downcounter = {progress:map.width * map.height * layerList.length};
    const thenDo = () => {
        downcounter.progress--
        if (downcounter.progress == 0) {
            saveCanvas(canvas, fileName);
        }
    }

    for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
            const cell = map.field[y][x];
            drawCell(context, x, y, cell, layerList, thenDo);
        }
    }
}

function getXmlData(fileName, thenDo) {
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (!data) {
            console.warn("'" + fileName + "' doesn't exist");
            return;
        }
        var str = data.replace(/<!--.*-->/g,'');
        thenDo(str);
    })
}

const getXmlMap=(name) => {
    const resource = "./public/xml/" + name + ".tmx";
    const thenDo = (xmlString) => {
        var parser = new XMLParser();
        var myXml = parser.parseFromString(xmlString);

        var temp = parseXmlMap(myXml, name);
        drawCanvas(name, temp);
    }
    getXmlData(resource, thenDo);
}

const generateAll = (tmxFolder) => {

    fs.readdir(tmxFolder, (err, files) => {
        files.forEach(file => {
            fileName = file.split('.');
            if (fileName[1] == 'tmx') {
                getXmlMap(fileName[0]);
            }
      });
    });
}

const tmxFolder = './public/xml/';

var args = process.argv.filter((e,i) => (i >= 2));

console.log(args)
if (args.length) {
    args.forEach((e)=>getXmlMap(e));
} else {
    generateAll(tmxFolder)
}
/**/

