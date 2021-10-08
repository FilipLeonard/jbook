import { combineReducers } from 'redux';
import { cellsReducer } from './cellsReducer';
import { bundlesReducer } from './bundlesReducer';

export const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
});

// applying types to react redux
export type RootState = ReturnType<typeof reducers>;
