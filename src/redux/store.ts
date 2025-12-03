import { configureStore } from '@reduxjs/toolkit'
import blocReducer from './features/blogSlice';

export const store = configureStore({
    reducer: {
        blog: blocReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch