import pako from 'pako'
import { doIfDebug } from './debug'

export default function parseXmlMap(r, name) {
    var map = {
        name,
        properties: [],
        tilesets: [],
        layers: {},
        objectgroups: {
                spawn: [],
                keys: [],
                mapchange: [],
                other: [],
        },
    }
    if (r.name == "DOCTYPE") {
        r = r.children[0];
    }
    if (r.name == "map") {
        r.children.forEach((e) => {
            if (e.name == "objectgroup") {
                parseObjectgroups(e, map);
            } else if (e.name == "layer") {
                parseLayer(e, map, name);
            } else if (e.name == "tileset") {
                parseTileset(e, map, name);
            } else if (e.name == "properties") {
                map[e.name].push(e); // TODO
            } else {
                console.warn("Custom map section at '" + name + "':");
                console.warn(e);
                map[e.name].push(e);
            }
        });
    }
    mapLayers(map);
    return map;
}
function parseObjectgroups(r, map) {

    r.children?.forEach((e) => {

        switch(e.attributes.type) {
            case "spawn":
              map.objectgroups.spawn.push(mapSpawn(e, map));
              break;
            case "keys":
              map.objectgroups.keys.push(e);
              break;
            case "mapchange":
              map.objectgroups.mapchange.push(e);
              break;
            default:
              map.objectgroups.other.push(e);
        }
    });
}

function mapSpawn(e, map) {
    if (e.children?.length>1) {
         console.warn("More then one children!");
         console.warn(e);
    }


    var spawn = {
        ...e.attributes,
        ...e.children[0]?.attributes,
        width: e.attributes.width - 0,
        height: e.attributes.height - 0,
        x: e.attributes.x - 0,
        y: e.attributes.y - 0,
    }
    e.children[0]?.children?.forEach((c) => {
        doIfDebug(() => {
            if (spawn[c.attributes.name]) {
                console.warn("More then one children '" + c.attributes.name + "':");
                console.warn(spawn[c.attributes.name]);
                console.warn(c);
            }
            if (c.name != "property") {
                 console.warn("Unknown children!");
                 console.warn(c);
            }
            if (c.children?.length) {
                 console.warn("More then zero children!");
                 console.warn(c);
            }
            if (["spawngroup", "quantity", "ignoreAreas", "active", "map", "place"].indexOf(c.attributes.name) == -1 ) {
                 console.warn("Unknown children!");
                 console.warn(c);
            }
            if (Object.keys(c.attributes).filter(x => !["name", "value", "type"].includes(x)).length) {
                 console.warn("Unknown children!");
                 console.warn(c);
            }
        });
        spawn[c.attributes.name] = c.attributes.value;
    });
    return spawn;
}
function parseTileset(e, map, name) {
    var tileset = {
        //...e.attributes,
        //...e.children[0].attributes,
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
function parseLayerDebug(e, map, name) {
    if (map.width && (map.width != e.attributes.width))
        console.warn(name + " has different layers(" + map.width + "!=" + e.attributes.width + ")");
    if (map.height && (map.height != e.attributes.height))
        console.warn(name + " has different layers(" + map.height + "!=" + e.attributes.height + ")");
    if (map.layers[e.attributes.name]) {
        console.warn(name + " has several layers: " + e.attributes.name);
    }
    if (e.children.length != 1) {
        console.warn(name + " has multi layer: " + e.attributes.name);
    }
}
function parseLayer(e, map, name) {
    doIfDebug(() => parseLayerDebug(e, map, name));
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
function mapLayers(map) {
    map.field = [];
    for (let y = 0; y < map.height; y++) {
        map.field[y] = [];
        for (let x = 0; x < map.width; x++) {
            map.field[y][x] = {};
            setTileByLayerXY(map, "ground", x, y);
            setTileByLayerXY(map, "objects", x, y);
            setTileByLayerXY(map, "above", x, y);
        }
    }
}
function setTileByLayerXY(map, layer, x, y) {
    map.field[y][x][layer] = getTileById(map, map.layers[layer][y * map.width + x]);
}
function getTileById(map, id) {
    if (id == 0)
        return;
    var tileset = map.tilesets.find((e) => ((id >= e.firstgid) && (id < (e.firstgid + e.tilecount))));
    if (!tileset) {
        console.warn("No tileset for '" + map.name + "' " + id);
    }
    return {
        id,
        tileset: tileset,
        localid: (id - tileset?.firstgid),
    };
}
