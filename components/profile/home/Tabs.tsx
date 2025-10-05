import ProfileTab from './ProfileContent';
import React from 'react';
import { View } from 'react-native';
import PostsTab from './PostsTab';
import AnimatedTopTabs from '@/components/general/TopTabs';

export default function Tabs({ }: { setScrollEnabled?: (enabled: boolean) => void }) {
  return (
    <View style={{ marginTop: 16 }}>
      <AnimatedTopTabs
        tabs={[
          {
            name: 'Profile',
            content: <ProfileTab />
          },
          {
            name: 'Posts',
            content: <PostsTab
            />
          }
        ]}
      />
    </View>
  );
}

