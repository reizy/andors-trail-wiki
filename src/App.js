import React,{useState,useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './components/Main.jsx';
import XMLParser from 'react-xml-parser';
import parseXmlMap from './utils/MapParser.jsx';
import parseGlobalMap from './utils/GlobalMapParser.jsx';

function App() {
  const [data,setData]=useState([]);
  var  temp = { maps: {} };
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  const getXmlData=(fileName, thenDo)=>{
    const headers = {
      'Content-Type': 'text/xml',
      'Accept': 'text/xml'
    };
    fetch(''+fileName, {headers})
      .then(response => {
        return response.text();
      })
      .then(str => {
        return str.replace(/<!--.*-->/g,'');
      })
      .then(thenDo);
  }
  const saveTempResources = (str) => {
    var parser = new XMLParser();
    var myXml = parser.parseFromString(str);

    var xmlData=myXml.getElementsByTagName("array");
    const resources = xmlData.reduce(function(map, obj) {
      map[obj.attributes.name] = obj.children.map(o=>o.value).filter(e=>e);
      return map;
    }, {});
    temp = {
        ...temp,
        resources
    };
    getMaps(temp, setData);
  }

  const getXmlMap=(resource, name, downcounter)=>{
    const thenDo = (xmlString) => {
      var parser = new XMLParser();
      var myXml = parser.parseFromString(xmlString);
      
      temp.maps[name] = parseXmlMap(myXml, name);
      downcounter.progress--
      if (downcounter.progress==0){
        downcounter.tryDo();
      }
    }
    getXmlData(resource, thenDo)
  }

  const getGlobalMap =(downcounter) => {
    const thenDo = (xmlString) => {
      var parser = new XMLParser();
      var myXml = parser.parseFromString(xmlString);
      
      temp.globalMap = parseGlobalMap(myXml);
      downcounter.progress--
      if (downcounter.progress==0){
        downcounter.tryDo();
      }
    }
    getXmlData("/xml/worldmap.xml", thenDo);
  }

  const getMaps=(temp, thenDo)=>{
    var maps = temp.resources.loadresource_maps;
    var downcounter = {progress:maps.length+1, tryDo:()=>thenDo(temp)};
    getGlobalMap(downcounter);
    maps.forEach((path)=>{
      getXmlMap(path.replace('@','/')+".tmx", path.replace('@xml/',''), downcounter);
    });
  }
  
  useEffect(()=>{
    getXmlData('/values/loadresources.xml', saveTempResources);
  },[])

  return (
    <div className="App">
        {/* { data.resources && <Main resources = { data.resources } maps = { data.maps } globalMap = { data.globalMap }/> } */}
        <Main
          resources = { data.resources }
          maps = { data.maps }
          globalMap = { data.globalMap }
        />
    </div>
  );
}

export default App;
