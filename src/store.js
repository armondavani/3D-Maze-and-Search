import {createStore} from 'redux';

let appStates = ['pre-generate', 'generating', 'pre-solve', 'solving', 'done']
let buttonTexts = ['Generate Maze', '(Generating)', 'Solve Maze', '(Solving)', 'Restart']



const PROGRESS_STATE = 'PROGRESS_STATE'
const UPDATE_GRID = 'UPDATE_GRID'
const UPDATE_MAZE = 'UPDATE_MAZE'

const defaultState = {
  grid: [[[]]],
  maze: [],
  appState: {name: appStates[0], index: 0}
}

// const SET_SELECTED_CAMPUS = 'SET_SELECTED_CAMPUS';
// export const setSelectedCampus = (campus) => ({
//   type: SET_SELECTED_CAMPUS,
//   campus
// });

// export const fetchSingleCampus = (campusId) => {
//   return async (dispatch) => {
//     try {
//       const singleCampusResponse = await axios.get(`/api/campuses/${campusId}`);
//       dispatch(setSelectedCampus(singleCampusResponse.data))
//     } catch (error) {
//       console.log('failed to retrieve single campus data in fetchSingleCampus thunk');
//       console.log(error);
//     }
//   }
// };

export const progressState = () => {
  return {
    type: PROGRESS_STATE
  }
}

export const updateGrid = (newGrid) => {
  return {
    type: UPDATE_GRID,
    grid: newGrid
  }
}

export const updateMaze = (newMaze) => {
  return {
    type: UPDATE_MAZE,
    maze: newMaze
  }
}


const handlers = {
  // [HANLDER_NAME]: (state, action) => {
  //   return action.whatever
  // }
  
  [PROGRESS_STATE]: (state, action) => {
    let stateIndex = state.appState.index;
    stateIndex++;
    if (stateIndex >= appStates.length) {
      stateIndex = 0;
    }
    return {...state, appState: {name: appStates[stateIndex], index: stateIndex}}
  },
  
  [UPDATE_GRID]: (state, action) => {
    return {...state, grid: action.grid}
  },
  
  [UPDATE_MAZE]: (state, action) => {
    return {...state, maze: action.maze}
  }
  
}


const reducer = (state = defaultState, action) => {
  if (handlers.hasOwnProperty(action.type)) {
    return handlers[action.type](state, action);
  } else {
    return state;
  }
}


const store = createStore(reducer);


export default store;
