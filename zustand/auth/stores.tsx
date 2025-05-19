import { create } from 'zustand';


type StoreState = {
	email: string | null;
	refresh: string | null;
	access: string | null;

	setStore: (data: Partial<StoreState>) => void;
}

export const useStore = create<StoreState>((set) => ({
	email: null,
	refresh: null,
	access: null,

	setStore: (data) => set(data),
}));


