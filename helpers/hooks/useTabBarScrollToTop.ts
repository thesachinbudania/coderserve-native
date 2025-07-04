import { useEffect } from 'react'
import { addListener, removeListener } from '@alexsandersarmento/react-native-event-emitter'

export const useTabPressScrollToTop = (
  scrollRef: React.RefObject<any>,
  tabName: string
) => {
  useEffect(() => {
    const eventName = `tabPress:${tabName}`
    const handler = () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true })
    }

    addListener(eventName, handler)
    return () => {
      removeListener(eventName)
    }
  }, [scrollRef, tabName])
}

