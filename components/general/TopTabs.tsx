import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  StyleSheet,
  ScrollView,
} from 'react-native'

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated'

import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  PanGesture,
} from 'react-native-gesture-handler'

type Tab = {
  name: string
  content: React.ReactNode
  height?: number
}

interface Props {
  tabs: Tab[]
  setScrollEnabled?: (enabled: boolean) => void
  index?: number
  setIndex?: (index: number) => void
}

const MIN_TAB_WIDTH = 80
const HORIZONTAL_PADDING = 0

export default function AnimatedTopTabs({ tabs, setScrollEnabled, index, setIndex }: Props) {
  const { width: screenWidth } = useWindowDimensions()
  const totalRequiredWidth = tabs.length * MIN_TAB_WIDTH
  const isScrollable = totalRequiredWidth + 16 * 2 > screenWidth

  const tabWidth = isScrollable
    ? MIN_TAB_WIDTH
    : (screenWidth - 16 * 2) / tabs.length

  const [activeIndex, setActiveIndex] = useState(0)
  const indicatorX = useSharedValue(activeIndex * tabWidth)
  const contentX = useSharedValue(-activeIndex * screenWidth)
  const startX = useSharedValue(0)

  const scrollRef = useRef<ScrollView>(null)

  const handleTabChange = (index: number) => {
    setActiveIndex(index)
    if (setIndex) setIndex(index)
    indicatorX.value = withTiming(index * tabWidth, { duration: 250 })
    contentX.value = withTiming(-index * screenWidth, { duration: 300 })

    if (isScrollable && scrollRef.current) {
      scrollRef.current.scrollTo({
        x: index * tabWidth - screenWidth / 2 + tabWidth / 2,
        animated: true,
      })
    }
  }

  React.useEffect(() => {
    if (typeof index === 'number' && index !== activeIndex) {
      handleTabChange(index)
    }
  }, [index])

  const handlePress = (index: number) => {
    if (index !== activeIndex) {
      handleTabChange(index)
    }
  }

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }))

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: contentX.value }],
  }))

  const swipeGesture: PanGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .failOffsetY([-5, 5])
    .runOnJS(true)
    .onBegin(() => {
      if (setScrollEnabled) runOnJS(setScrollEnabled)(false)
    })
    .onStart(() => {
      startX.value = contentX.value
    })
    .onUpdate((event) => {
      if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
        contentX.value = startX.value + event.translationX
      }
    })
    .onEnd((event) => {
      const progress = -contentX.value / screenWidth
      let nextIndex = Math.round(progress)

      // Fast swipe detection
      if (Math.abs(event.velocityX) > 500) {
        if (event.velocityX < 0) nextIndex += 1
        else nextIndex -= 1
      }

      const clampedIndex = Math.max(0, Math.min(tabs.length - 1, nextIndex))

      runOnJS(handleTabChange)(clampedIndex)
      if (setScrollEnabled) runOnJS(setScrollEnabled)(true)
    })
    .onFinalize(() => {
      if (setScrollEnabled) runOnJS(setScrollEnabled)(true)
    })

  // not being use currently anywhere
  const [heights, setHeights] = useState<any>({});

  return (
    <GestureHandlerRootView >
      <View style={styles.tabRowContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.tabRow,
          ]}
          scrollEnabled={isScrollable}
        >
          {tabs.map((tab, i) => {
            const isActive = i === activeIndex
            return (
              <Pressable
                key={i}
                onPress={() => handlePress(i)}
                style={[styles.tab, { width: tabWidth }]}
              >
                {
                  ({ pressed }) => (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.tabText, isActive && styles.activeText, pressed && !isActive && { color: '#006dff', fontWeight: 'bold' }]}
                    >
                      {tab.name}
                    </Text>
                  )
                }

              </Pressable>
            )
          })}
          <Animated.View
            style={[
              styles.indicator,
              { width: tabWidth },
              indicatorStyle,
            ]}
          />
        </ScrollView>
      </View>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View
          style={[
            styles.contentWrapper,
            contentStyle,
          ]}
        >
          {tabs.map((tab, i) => (
            <View
              key={i}
              style={{
                width: screenWidth,
                paddingHorizontal: 16,
              }}
            >
              <View
                onLayout={(event) => {
                  const height = event.nativeEvent.layout.height;
                  setHeights((prev: any) => {
                    const next = { ...prev, [i]: height };
                    return next;
                  })
                }}
              >
                {
                  // only render active tab content to measure height 
                  i === activeIndex ? tab.content : null
                }
              </View>
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabRowContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    backgroundColor: '#fff',
    marginHorizontal: 16
  },
  tabRow: {
    flexDirection: 'row',
    position: 'relative',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  tabText: {
    fontSize: 13,
    color: '#737373',
    lineHeight: 13
  },
  activeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#202020',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  contentWrapper: {
    flexDirection: 'row',
    marginTop: 32,
  },
})
