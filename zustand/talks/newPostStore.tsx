import { create } from 'zustand';

interface NewPostState {
  title: string;
  hashtags: string[];
  thumbnail: any;
  content: string | null;
  editId: string | null;
  setNewPost: (post: Partial<NewPostState>) => void;
}

export const useNewPostStore = create<NewPostState>((set) => ({
  title: '',
  hashtags: [],
  thumbnail: null,
  content: null,
  editId: null,

  setNewPost: (post) => set(post)
}))


interface UndoRedoState {
  undoEnabled: boolean;
  redoEnabled: boolean;
  setUndoEnabled: (enabled: boolean) => void;
  setRedoEnabled: (enabled: boolean) => void;
}

export const useUndoRedoStore = create<UndoRedoState>((set) => ({
  undoEnabled: false,
  redoEnabled: false,
  setUndoEnabled: (enabled) => {
    set({ undoEnabled: enabled })
  },
  setRedoEnabled: (enabled) => set({ redoEnabled: enabled }),
}));
