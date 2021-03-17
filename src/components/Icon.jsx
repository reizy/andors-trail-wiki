import React, { Component } from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const custom = {
    monsters_demon1:{x:64, y:64},
    monsters_demon2:{x:64, y:64},
    monsters_hydra1:{x:64, y:64},
    monsters_cyclops:{x:64, y:96},
    monsters_bosses_2x2:{x:64, y:64},
    monsters_giantbasilisk:{x:64, y:64},
}

export const getDimentionById = (id) => getDimention(id?.split(":")[0]);
export const getDimention = (file) => custom[file]||{x:32,y:32};

export default class Icon extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {data, prefix, noBackground}= this.props;
        const zoom = this.props.zoom || 32;

        const href = (data.rootLink || prefix) + (data.id||data.name);
        const key = "i" + (new Date() -0) +"_"+ Math.random();
        const tmp = data.iconID?.split(":");
        const file = tmp[0];
        const index = tmp[1];
        const src = getSrc(file);
        const d = getDimention(file);
        
        d.x = d.x * zoom / 32;
        d.y = d.y * zoom / 32;

        var style = {
            width:d.x,
            height:d.y,
            overflow: 'hidden'
        }
        if (!noBackground) {
            style = {
                ...style,
                backgroundImage: 'url("/drawable/ui_selections.png")',
                backgroundRepeat: 'no-repeat', 
                backgroundPosition: (data.iconBg * d.x) + "px 0px",
                backgroundSize: (d.x * 5) + "px " + d.y + "px",

            };
        };

        return <div style={{ display:'flex'}}>

                        <Link style={style} 
                           title={data.displaytype} 
                           to={href}>
                                <div id={data.id} className="TableAncor"/>
                                <img id={key} 
                                    src={src} 
                                    onLoad={onImgLoad(index, d, key)}
                                    />
                        </Link>
                    </div>;
    }
}
    const getSrc = (file) => {
        if (!file) return;
        return "/drawable/"+file+".png";
    }
    const getPosition = (i, width, d) => {
        var x = - i % width * d.x;
        var y = (- i * d.y - x) / width;
        return {x, y};
    }
    const onImgLoad = (index, d, key) => {
        return ()=> {
            if (!index) return;
            var img = document.getElementById(key);
            var p = getPosition(index, img.width / d.x, d);
            img.style = `margin: ${p.y}px 0 0 ${p.x}px; display: 'block'`;
        }
    }

