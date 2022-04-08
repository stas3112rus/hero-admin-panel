import heroes from '../reducers/heroes';
import filters from '../reducers/filters';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {heroes, filters},
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: process.env.NODE_EW !== 'production',    
})

export default store;