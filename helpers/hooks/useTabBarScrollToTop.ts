import { useEffect } from 'react'
import { addListener, removeListener } from '@alexsandersarmento/react-native-event-emitter'

export const useTabPressScrollToTop = (
  scrollRef: React.RefObject<any>,
  tabName: string,
  refresh?: () => void
) => {
  useEffect(() => {
    const eventName = `tabPress:${tabName}`
    const handler = () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true })
      refresh?.()
    }

    addListener(eventName, handler)
    return () => {
      removeListener(eventName)
    }
  }, [scrollRef, tabName])
}

