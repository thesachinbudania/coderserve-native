import {create} from 'zustand';

interface GeneralStoreState {
    hashtagsFollowed: string[];
    setHashtagsFollowed: (hashtags: string[]) => void;
}

export const useGeneralStore = create<GeneralStoreState>((set) => ({
    hashtagsFollowed: [],
    setHashtagsFollowed: (hashtags) => set({ hashtagsFollowed: hashtags }),
}));