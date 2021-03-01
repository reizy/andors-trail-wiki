export default function parseGlobalMap(myXml) {
    var result = {
        segments: [],
        segmentsMap: {},
    };
    myXml.children.forEach((segment) => {
        var value = parseSegment(segment);
        result.segments.push(value);
        result.segmentsMap[segment.attributes.id] = value;
    });
    return result;
}

function parseSegment(segment) {
    var result = {
        id: segment.attributes.id,
        x: segment.attributes.x * 1,
        y: segment.attributes.y * 1,
        areas: parseArea(segment.children),
    }
    result = {
        ...result,
        ...parseMaps(segment.children, result.areas),
    }
    return result;
}
function parseArea(children) {
    var result = {};
    children.filter((e) => e.name == "namedarea").forEach((e) => {
        result[e.attributes.id] = e.attributes;
    });
    return result;
}
function parseMaps(children, areas) {
    var result = {
        maps: [],
        mapsMap: {},
    };
    children.filter((e) => e.name == "map").forEach((e) => {
        var map = {
            ...e.attributes,
            x: e.attributes.x * 1,
            y: e.attributes.y * 1,
        };
        if (map.area) {
            map.areaLink = areas[map.area];
            map.areaLink.maps = map.areaLink.maps || [];
            map.areaLink.maps.push(map);
        }
        result.maps.push(map);
        result.mapsMap[e.attributes.id] = map;
    });

    return result;
}
