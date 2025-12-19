import { create } from 'zustand'

interface PopUpState {
  visible: boolean
  title: string | null
  body: string | null

  setPopUp: (popUp: Partial<PopUpState>) => void
  hidePopUp: () => void
}

export const popUpStore = create<PopUpState>((set) => ({
  visible: false,
  title: null,
  body: null,

  setPopUp: (popUp) => {
    set(popUp)
  },
  hidePopUp: () => set({ visible: false })
}))


