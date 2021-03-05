import React, { Component } from 'react';


export default class Table extends React.Component {

    constructor(props) {
        super(props);
    }




    render() {
        return ( <div style={{textAlign:'left', margin:10}}>
            <p>Welcome to <b>Andor's Trail Directory V2</b> the fan page about amazing, beautiful a great game <a href="https://play.google.com/store/apps/details?id=com.gpl.rpg.AndorsTrail">Andor's Trail</a>.</p>

            <h2>About</h2>
            <p><b>Andor's Trail</b> is quest-driven Roguelike fantasy dungeon crawler RPG with a powerful story on Android, with open source code (GPL).</p>

            <p>I created this web because <a href="http://andorstrail.irkalla.cz/0.7.0/">previous one</a> was abandoned for years.</p>

            <p>This pages get data directly from source files, witch are in easy-to-read JSON and XML format, and redner it birectly in your browser. </p>

            <h2>Spoiler alert</h2>

            <p>This whole web ïs a little bit of spoiler and it contains some informations witch you probably shouldn't know and can reveal some surprises and story twists. It is not such big deal, just be careful a consider yourself warned.</p> 

            <p>But if you are affraid of spoilers, stay away from <b>quest page</b>.</p>

            <h2>Contact and links</h2>

            <p>If you want more information about game, please visit the <a href="https://play.google.com/store/apps/details?id=com.gpl.rpg.AndorsTrail">official game page on Google Play</a> or the <a href="https://www.andorstrail.com">main game forum</a>. </p>

        </div> );
    }
}

