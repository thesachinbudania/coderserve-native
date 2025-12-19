import { create } from 'zustand';

interface AccountInfoState {
  commentedPosts: any[];
  your_commentedPosts: any[];
  votedPosts: any[];
  your_votedPosts: any[];
  commentMentionedPosts: any[];
  your_commentMentionedPosts: any[];
  usernameChanges: any[];
  your_usernameChanges: any[];
  fullName?: string;

  setAccountInfo: (accountInfo: Partial<AccountInfoState>) => void;
}

export const useAccountInfoStore = create<AccountInfoState>((set) => ({
  commentedPosts: [],
  your_commentedPosts: [],
  votedPosts: [],
  your_votedPosts: [],
  commentMentionedPosts: [],
  your_commentMentionedPosts: [],
  usernameChanges: [],
  your_usernameChanges: [],

  setAccountInfo: (accountInfo) => set(accountInfo),
}))
