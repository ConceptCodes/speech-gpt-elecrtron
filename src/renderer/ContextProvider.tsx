import { createContext } from 'react';
import { State } from '$renderer/lib/types';

export const ContextProvider = createContext<State | null>(null);
