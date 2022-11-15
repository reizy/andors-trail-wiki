const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')

const {XMLParser} = require('./xmlParser.js');
const {parseXmlMap}  = require('./mapParser.js');

const ZOOM = 32;
const ZOOM_OUT = 12;

var counter = 0;
var counterSize = 0;

function saveVersion(xml) {
    const buffer = "REACT_APP_AT_VERSION=" + xml.attributes["android:versionName"];
    fs.writeFileSync('./.env', buffer)
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

const getXml=(name) => {
   
    const thenDo = (xmlString) => {
        var parser = new XMLParser();
        var myXml = parser.parseFromString(xmlString);
        saveVersion(myXml);
    }
    getXmlData(resource, thenDo);
}

const generateAll = (tmxFolder) => {

    
}

const resource = "../andors-trail/AndorsTrail/app/src/main/AndroidManifest.xml";
getXml(resource);



