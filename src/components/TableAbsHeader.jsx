import React, { Component } from 'react';

export default class TableAbsHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            scrollY: window.scrollY,
            scrollX: window.scrollX,
        };
        this.onScroll = this.onScroll.bind(this);
    }

    onScroll() {
        this.setState({ scrollY: window.scrollY,  scrollX: window.scrollX,});
    }

    componentDidMount() {
       if (window.onscroll) {
           const tmp = window.onscroll;
           window.onscroll = () => {tmp(); this.onScroll();}
       } else {
           window.onscroll = this.onScroll;
       }
    }

    componentWillUnmount() {
       window.onscroll = undefined;
    }

    render() {

        const columns = this.props.columns
        const size = this.props.size
        const bot = this.props.bot

        if (window.scrollY < size.top) return "";
        if (window.scrollY > (size.top + size.height - 50)) return "";


        var style = {marginLeft:2-this.state.scrollX, width: 3000}

        return (<div>
                <RenderHead style1={style} columns={columns}/>
                </div>
              )

    }
}
const RenderHead = (props) => {
    return <div className='absHeader' style={props.style1}  >
                {props.columns
                    .filter((e)=> !(e.visible == false))
                    .map((e)=>{return (
                            <div key={e.id} className='absSubHeader' style={{width:`${e.width}`}}>
                                <div className='absSubHeaderInner' >{e.label}</div>
                            </div>
                        )})}
           </div>
}