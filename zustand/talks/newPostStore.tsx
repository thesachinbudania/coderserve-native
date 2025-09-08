import { create } from 'zustand';

interface NewPostState {
  title: string;
  hashtags: string[];
  thumbnail: any;
  content: string | null;
  setNewPost: (post: Partial<NewPostState>) => void;
}

export const useNewPostStore = create<NewPostState>((set) => ({
  title: '',
  hashtags: [],
  thumbnail: null,
  content: null,

  setNewPost: (post) => set(post)
}))
