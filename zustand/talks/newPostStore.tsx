import { create } from 'zustand';

interface NewPostState {
  title: string;
  hashtags: string[];
  thumbnail: any;
  setNewPost: (post: Partial<NewPostState>) => void;
}

export const useNewPostStore = create<NewPostState>((set) => ({
  title: '',
  hashtags: [],
  thumbnail: null,

  setNewPost: (post) => set(post)
}))
