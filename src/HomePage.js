import React from 'react';
import { connect } from 'react-redux'
import { progressState } from './store'
import P5Wrapper from './P5Wrapper'

let appStates = ['pre-generate', 'generating', 'pre-solve', 'solving', 'done']
let buttonTexts = ['Generate Maze', '(Generating)', 'Solve Maze', '(Solving)', 'Restart']

class HomePage extends React.Component {
  constructor() {
    super()
  }




  render() {

    let buttonText = buttonTexts[this.props.appState.index]
    let buttonActivation;
    if (buttonText[0] === '(') {
      buttonActivation = 'disabled'
    } else {
      buttonActivation = ''
    }




    return (
      <div>

        <div id="button-div">

          <button type="button" disabled={buttonActivation} onClick={this.props.progressState}>
            {buttonText}
          </button>

        </div>


        <div id="bottom-container">
          <div></div>
          <P5Wrapper id="wrapper"></P5Wrapper>
          <div id="legend">
            <h1>Legend</h1>
            <div id="legend-details">
            <div>
              <span className="yellow">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp; Light-Yellow: Maze passageways
            </div>

            <div>
              <span className="gray">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp; Gray: Maze walls
            </div>

            <div>
              <span className="purple">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp; Purple: Goal
            </div>

            <div>
              <span className="blue">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp; Blue: Current best path
            </div>

            <div>
              <span className="green">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp; Light Green: Nodes next in list to be analyzed
            </div>

            <div>
              <span className="red">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp; Light Red: Nodes already analyzed
            </div>
            </div>
          </div>
        </div>




      </div>
    )
  }
}



// const mapState = (state) => {
//   return {
//     campuses: state.campuses
//   }
// }

const mapState = (state) => {
  return {
    appState: state.appState
  }
}

const mapDispatch = (dispatch) => {
  return {
    progressState: () => dispatch(progressState())
  }
}



export default connect(mapState, mapDispatch)(HomePage);
