import { State } from '$renderer/lib/types';
import { create, type StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Store = State & {
  setApiKey: (apiKey: string) => void;
};

const store: StateCreator<Store> = persist(
  (set) => ({
    speeches: [],
    currentSpeech: null,
    apiKey: '',
    setApiKey: (apiKey: string) => set({ apiKey }),
  }),
  {
    name: 'speech-gpt-ui',
    storage: createJSONStorage(() => sessionStorage),
  },
) as StateCreator<Store>;

const useStore = create<Store>(store);

export default useStore;
