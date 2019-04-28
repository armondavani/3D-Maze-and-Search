import React, { Component } from 'react'
import {progressState} from './store'
import { connect } from 'react-redux'

import sketch1 from './sketch1'
import sketch2 from './sketch2'
import sketch3 from './sketch3'
import sketch3top from './sketch3top'
import sketch3left from './sketch3left'
import sketch3front from './sketch3front'


class P5Wrapper extends Component {
  
  
    componentDidMount() {
        // this.canvas1 = new window.p5(sketch1, 'canvas1-container')
        // // this.canvas1.props = this.props.p5Props
        // // this.canvas1.onSetAppState = this.props.onSetAppState

        // this.canvas2 = new window.p5(sketch2, 'canvas2-container')
        // this.canvas2.props = this.props.p5Props
        
        this.canvas1 = new window.p5(sketch1, 'canvas-container');
        
        // pass props like above. and can pass them into
        // should component update, and on component did update
        // but i dont need to i believe.
    }

    shouldComponentUpdate(nextProps) {
        // this.canvas1.props = nextProps.p5Props
        // this.canvas2.props = nextProps.p5Props
        // console.log('=========')
        // console.log(nextProps.appState);
        
        if (nextProps.appState.index === 0) {
          return true;
        } else if (nextProps.appState.index === 1) {
          return true;
        } else if (nextProps.appState.index === 3) {
          return true;
        } else {
          return false
        }
        
        
    }
    
    componentDidUpdate() {
      if (this.props.appState.index === 0) {
        this.canvas1.remove();
        this.canvas1 = new window.p5(sketch1, 'canvas-container');
        this.canvas3.remove()
        this.canvasLeft.remove();
        this.canvasTop.remove();
        this.canvasFront.remove();
        
      }
      if (this.props.appState.index === 1) {
        this.canvas1.remove();
        this.canvas1 = new window.p5(sketch2, 'canvas-container');
      }

      if (this.props.appState.index === 3) {
      this.canvas1.remove();
        this.canvas3 = new window.p5(sketch3, 'canvas-container')
        this.canvas3.props = {maze: this.props.maze, grid: this.props.grid}
        
        this.canvasLeft = new window.p5(sketch3top, 'top-view')
        this.canvasLeft.props = {maze: this.props.maze, grid: this.props.grid}
        
        this.canvasTop = new window.p5(sketch3left, 'left-view')
        this.canvasTop.props = {maze: this.props.maze, grid: this.props.grid}
        
        this.canvasFront = new window.p5(sketch3front, 'front-view')
        this.canvasFront.props = {maze: this.props.maze, grid: this.props.grid}
        
        
        
        
      }
    }

    // componentWillUnmount() {
    //     // this.canvas1.remove()
    //     // this.canvas2.remove()
    // }
    
    

    render() {
        
        
        return (
          <div id="all-canvases">
            <div id="left-canvas">
              <div id="top-view">
                
              </div>
              <div id="left-view">
                
              </div>
              <div id="front-view">
                
              </div>
            </div>
            <div id="canvas-container">
              
            </div>
            
            
          </div>
          
        )
    }
}


const mapState = (state) => {
  return {
    appState: state.appState,
    maze: state.maze,
    grid: state.grid,
  }
}

const mapDispatch = (dispatch) => {
  return {
    progressState: () => dispatch(progressState())
  }
}



export default connect(mapState, mapDispatch)(P5Wrapper);
