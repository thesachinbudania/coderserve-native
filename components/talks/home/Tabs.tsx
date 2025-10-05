import ProfileTab from './ProfileContent';
import { TabView } from 'react-native-tab-view';
import React from 'react';
import { Animated, Dimensions, Platform, TouchableOpacity, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Portal } from '@gorhom/portal';
import PostsTab from '@/components/talks/home/PostsTab';
import AnimatedTopTabs from '@/components/general/TopTabs';

const width = Dimensions.get('window').width;

const routes = [
  { key: 'profile', title: 'Profile' },
  { key: 'posts', title: 'Posts' },
]

function TabBar({ index, setIndex }: { index: number, setIndex: React.Dispatch<React.SetStateAction<number>> }) {
  const indicatorPosition = React.useRef(new Animated.Value(index)).current;

  // Animate the indicator position when the index changes
  React.useEffect(() => {
    Animated.timing(indicatorPosition, {
      toValue: index,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [index]);

  const margin = 16;
  const tabWidth = (width - margin * 2) / 2; // Account for margins

  return (
    <View style={[tabBarStyles.container]}>
      <View style={tabBarStyles.tabContainer}>
        {/* Profile Tab */}
        <TouchableOpacity style={tabBarStyles.tabButton} onPress={() => setIndex(0)}>
          <Text style={[tabBarStyles.tabText, index === 0 && tabBarStyles.activeTab]}>
            Profile
          </Text>
        </TouchableOpacity>

        {/* Posts Tab */}
        <TouchableOpacity style={tabBarStyles.tabButton} onPress={() => setIndex(1)}>
          <Text style={[tabBarStyles.tabText, index === 1 && tabBarStyles.activeTab]}>
            Posts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Animated Indicator */}
      <Animated.View
        style={[
          tabBarStyles.indicator,
          {
            width: tabWidth, // Full tab width
            transform: [{
              translateX: indicatorPosition.interpolate({
                inputRange: [0, 1],
                outputRange: [0, tabWidth], // Slide across full tab width
              })
            }],
          },
        ]}
      />
    </View>
  );
}

const tabBarStyles = StyleSheet.create({
  container: {
    position: 'relative',
    borderBottomWidth: 1.5,
    borderColor: '#eeeeee',
  },
  tabContainer: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 13,
    color: '#737373',
  },
  activeTab: {
    fontWeight: 'bold',
    color: 'black',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: 'black',
  },
});

export default function Tabs({ hostName = 'tabsContent' }: { hostName?: string }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const renderScene = ({ route }: { route: any }) => {
    if (route.key !== routes[index].key) {
      return null; // Ensure only the active tab is rendered
    }

    return (
      <AnimatedTopTabs
        tabs={[
          {
            name: 'Profile',
            content: <ProfileTab />
          }
        ]}
      />
    );
  };



  return (
    <View style={{ flex: 1 }}>
      <TabBar index={index} setIndex={setIndex} />
      <View style={{ flex: 1, pointerEvents: Platform.OS === 'ios' ? 'none' : 'auto' }}>
        <TabView
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          style={{ marginHorizontal: 16 }}
          swipeEnabled={Platform.OS === 'ios' ? false : true} // Disable swipe gesture
          renderScene={renderScene}
          renderTabBar={() => (
            <></>
          )}
        />
      </View>
    </View>
  );
}

