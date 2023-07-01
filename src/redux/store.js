import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'

// The store now has the ability to accept thunk functions in `dispatch`
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))
export default store