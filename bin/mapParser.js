const pako = require('pako');
const atob = require('atob');

const parseXmlMap = (r, name) => {
    var map = {
        name,
        properties: [],
        tilesets: [],
        layers: {},
        layerList: [],
    }
    if (r.name == "DOCTYPE") {
        r = r.children[0];
    }
    if (r.name == "map") {
        r.children.forEach((e) => {
            if (e.name == "layer") {
                parseLayer(e, map, name);
            } else if (e.name == "tileset") {
                parseTileset(e, map, name);
            } else if (e.name == "properties") {
                map[e.name].push(e); // TODO
            } else {
                // nothing to do
            }
        });
    }
    validateTilesets(map);
    mapLayers(map);
    return map;
}

function parseTileset(e, map, name) {
    var tileset = {
        height: e.children[0].attributes.height - 0,
        width: e.children[0].attributes.width - 0,
        name: e.attributes.name,
        firstgid: e.attributes.firstgid - 0,
        tileheight: e.attributes.tileheight - 0,
        tilewidth: e.attributes.tilewidth - 0,
    };
    tileset.columns = tileset.width / tileset.tilewidth;
    tileset.tilecount = tileset.height / tileset.tileheight * tileset.columns;

    map.tilesets.push(tileset);
}

function parseLayer(e, map, name) {

    map.layerList.push({
        name: e.attributes.name.toLowerCase(),
        visible: (e.attributes.visible != "0"),
    });
    map.width = e.attributes.width - 0;
    map.height = e.attributes.height - 0;
    try {
        var b64Data = e.children[0].value;
        var strData = atob(b64Data);
        var charData = strData.split('').map((x) => x.charCodeAt(0));
        var binData = new Uint8Array(charData);
        const tmp = pako.inflate(binData);
        map.layers[e.attributes.name.toLowerCase()] = new Uint32Array(tmp.buffer);
    } catch (err) {
        console.log(err);
    }
}
function validateTilesets(map) {
    map.tilesets.forEach((t) => {
        const id = t.firstgid;
        var tileset = map.tilesets.find((e) => ((id >= e.firstgid) && (id < (e.firstgid + e.tilecount))));
        if (tileset != t) {
            tileset.firstgid = -9999; // current game use last tileset, so we disable prevoious ones
        }
    });
}
function mapLayers(map) {
    map.field = [];
    for (let y = 0; y < map.height; y++) {
        map.field[y] = [];
        for (let x = 0; x < map.width; x++) {
            map.field[y][x] = {};
            map.layerList.forEach((e) => setTileByLayerXY(map, e.name, x, y));
        }
    }
}
function setTileByLayerXY(map, layer, x, y) {
    if (map.layers[layer]) {
        map.field[y][x][layer] = getTileById(map, layer, map.layers[layer][y * map.width + x]);
    }
}
function getTileById(map, layer, id) {
    if (id == 0)
        return;
    var tileset = map.tilesets.find((e) => ((id >= e.firstgid) && (id < (e.firstgid + e.tilecount))));
    return {
        id,
        tileset: tileset,
        localid: (id - tileset?.firstgid),
    };
}

module.exports = {
    parseXmlMap,
}