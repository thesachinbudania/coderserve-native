import ProfileTab from './ProfileContent';
import React from 'react';
import { View } from 'react-native';
import PostsTab from './PostsTab';
import AnimatedTopTabs from '@/components/general/TopTabs';

export default function Tabs({ index, setIndex, profileEditable = false }: { index?: number, setScrollEnabled?: (enabled: boolean) => void, setIndex?: (index: number) => void, profileEditable?: boolean }) {
  const [profileHeight, setProfileHeight] = React.useState(0);
  return (
    <View style={{ marginTop: 16 }}>
      <AnimatedTopTabs
        tabs={[
          {
            name: 'Profile',
            content: <ProfileTab
              editable={profileEditable}
              setHeight={setProfileHeight}
            />,
            height: profileHeight
          },
          {
            name: 'Posts',
            content: <PostsTab
            />
          }
        ]}
        index={index}
        setIndex={setIndex}
      />
    </View>
  );
}

