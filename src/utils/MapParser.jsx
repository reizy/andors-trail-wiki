import pako from 'pako'
import { doIfDebug } from './debug'

export default function parseXmlMap(r, name) {
    var map = {
        name,
        properties: [],
        tilesets: [],
        layers: {},
        layerList: [],
        objectgroups: {
                spawn: [],
                rests: [],
                signs: [],
                keys: [],
                scripts: [],
                containers: [],
                mapchange: [],
                replaces: [],
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
    validateTilesets(map);
    mapLayers(map);
    return map;
}
function parseObjectgroups(r, map) {
    var objectgroup = { name: r?.attributes?.name };
    r.children?.forEach((e) => {
        if (e.name == 'properties') {
            e.children?.forEach((p) => {
                const key = p.attributes?.name;
                const value = p?.attributes?.value;
                objectgroup[key] = value;
            });
        } else {
            switch(e.attributes.type) {
                case "spawn":
                  map.objectgroups.spawn.push(mapSpawn(e, map, objectgroup));
                  break;
                case "key":
                  map.objectgroups.keys.push(e);
                  break;
                case "rest":
                  map.objectgroups.rests.push(e);
                  break;
                case "sign":
                  map.objectgroups.signs.push(mapSign(e, map, objectgroup));
                  break;
                case "script":
                  map.objectgroups.scripts.push(mapScript(e, map, objectgroup));
                  break;
                case "container":
                  map.objectgroups.containers.push(mapContainers(e, map, objectgroup));
                  break;
                case "mapchange":
                  map.objectgroups.mapchange.push(mapMapchange(e, map, objectgroup));
                  break;
                case "replace":
                  map.objectgroups.replaces.push(e);
                  break;
                default:
                  console.warn(map);
                  console.warn(e);
                  map.objectgroups.other.push(e);
            }
        }
    });
}

function mapSpawn(e, map, objectgroup) {
    oneChildCheck(e);

    var spawn = {
        ...e.attributes,
        ...e.children[0]?.attributes,
        objectgroup,
        width: e.attributes.width - 0,
        height: e.attributes.height - 0,
        x: e.attributes.x - 0,
        y: e.attributes.y - 0,
    }
    e.children[0]?.children?.forEach((c) => {
        propertyCheck(c, spawn, ["spawngroup", "quantity", "ignoreAreas", "active"]);
        spawn[c.attributes.name] = c.attributes.value;
    });
    return spawn;
}

function mapScript(e, map, objectgroup) {
    oneChildCheck(e);

    var script = {
        ...e.attributes,
        objectgroup,
        width: e.attributes.width - 0,
        height: e.attributes.height - 0,
        x: e.attributes.x - 0,
        y: e.attributes.y - 0,
    }
    e.children[0]?.children?.forEach((c) => {
        propertyCheck(c, script, ["when"]);
        script[c.attributes.name] = c.attributes.value;
    });
    return script;
}
function mapContainers(e, map, objectgroup) {
    noChildCheck(e);

    var container = {
        ...e.attributes,
        objectgroup,
        width: e.attributes.width - 0,
        height: e.attributes.height - 0,
        x: e.attributes.x - 0,
        y: e.attributes.y - 0,
    }
    e.children[0]?.children?.forEach((c) => {
        propertyCheck(c, container, ["when"]);
        container[c.attributes.name] = c.attributes.value;
    });
    return container;
}
function mapMapchange(e, map, objectgroup) {
    oneChildCheck(e);

    var event = {
        ...e.attributes,
        ...e.children[0]?.attributes,
        objectgroup,
        width: e.attributes.width - 0,
        height: e.attributes.height - 0,
        x: e.attributes.x - 0,
        y: e.attributes.y - 0,
        xxx:e
    }
    e.children[0]?.children?.forEach((c) => {
        propertyCheck(c, event, ["place", "map"]);
        event[c.attributes.name] = c.attributes.value;
    });
    return event;
}

function mapSign(e, map, objectgroup) {
    noChildCheck(e);

    var event = {
        ...e.attributes,
        objectgroup,
        width: e.attributes.width - 0,
        height: e.attributes.height - 0,
        x: e.attributes.x - 0,
        y: e.attributes.y - 0,
    }
  
    return event;
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
            doIfDebug(() => {
                console.warn("Intersecting tilesets indexes at '" + map.name + "'");
                console.warn(tileset);
                console.warn(t);
            });
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
    if (!tileset) {
        doIfDebug(() => console.warn("No tileset for '" + map.name + "." + layer + "' " + id));
    }
    return {
        id,
        tileset: tileset,
        localid: (id - tileset?.firstgid),
    };
}

function oneChildCheck(e) {
    doIfDebug(() => {
        if (e.children?.length > 1) {
             console.warn("More then one children!");
             console.warn(e);
        }
    }, true);
}
function noChildCheck(e) {
    doIfDebug(() => {
        if (e.children?.length > 0) {
             console.warn("More then zero children!");
             console.warn(e);
        }
    }, true);
}
function propertyCheck(c, e, names) {
        doIfDebug(() => {
            if (e[c.attributes.name]) {
                console.warn("More then one children '" + c.attributes.name + "':");
                console.warn(e[c.attributes.name]);
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
            if (names.indexOf(c.attributes.name) == -1 ) {
                 console.warn("Unknown children!");
                 console.warn(c);
            }
            if (Object.keys(c.attributes).filter(x => !["name", "value", "type"].includes(x)).length) {
                 console.warn("Unknown children!");
                 console.warn(c);
            }
        }, true);
}
