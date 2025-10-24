import { StyleSheet, Pressable, Text, View } from 'react-native';
import protectedApi from '@/helpers/axios';
import React from 'react';
import BottomName from './BottomName';
import { useRouter } from 'expo-router';
import SmallTextButton from '@/components/buttons/SmallTextButton';
import BottomSheet from '@/components/messsages/BottomSheet';
import DefaultButton from '@/components/buttons/BlueButton';
import { isTalksProfileCompleted } from '@/zustand/jobsStore';
import { SingleLineHashtags } from '@/app/(protected)/talks';

const Post = ({ item }: { item: any }) => {
  return (
    <View
      style={{ padding: 16, backgroundColor: 'white' }}
    >
      <Text style={{ fontSize: 13, color: "#737373", marginBottom: 16 }}>{item.title}</Text>
      <SingleLineHashtags hashtags={item.hashtags} />
    </View>
  )
}

export default function({ editable = true, username }: { editable?: boolean, username?: string }) {
  const [data, setData] = React.useState<any>(null);
  const sheetRef = React.useRef<any>(null);
  React.useEffect(() => {
    const route = editable ? '/talks/self_posts/' : `/talks/posts/by_username/${username}/`;
    protectedApi.get(route).then((response) => {
      setData(response.data);
    }).catch((error) => {
      console.error('Error fetching user posts:', error);
    });
  }, []);
  const router = useRouter();
  return (
    <>
      {data && data.results.length > 0 ? (
        <>
        <View style={{ marginTop: -16, marginHorizontal: -16, gap: 8, backgroundColor: "#f5f5f5", paddingBottom: 8 }}>
          {data.results.map((item: any) => (
            <Pressable
              android_ripple={{ color: '#f5f5f5' }}
              onPress={() => {
                  router.push('/talks/viewPost/' + item.id)
              }}
              id={item.id}
            >
              <Post key={item.id} item={item} />
            </Pressable>
          ))}
        </View>
      <BottomName />
      </>
      ) :
        <View style={styles.container}>
          {editable ? (
            <>
              <Text style={styles.text}>You haven't shared any talks yet.</Text>
              <Text style={styles.text}>Let your voice be heard and inspire others.</Text>
              <SmallTextButton 
                  title="Create your first post"
                  style={styles.link}
                  onPress={() => {
                    if (isTalksProfileCompleted()) {
                    router.push('/talks/createPost')
                    }
                    else {
                      sheetRef?.current.open();
                    }
                  }}
               />
            </>
          ) :
            <Text style={styles.text}>User hasn't shared any talks yet.</Text>
          }
        </View>}
<BottomSheet
        menuRef={sheetRef}
        height={168}>
        <View style={{ gap: 32 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>Complete Your Profile</Text>
            <Text style={{ textAlign: 'center', color: '#a6a6a6', fontSize: 13 }}>
Your profile is incomplete. Please complete your profile to start creating and sharing posts with the community. 
            </Text>
          </View>
          <DefaultButton
            title='Update Profile'
            onPress={() => {
              sheetRef?.current.close();
              router.push("/(protected)/talks/profile/update");
            }}
          />
        </View>
      </BottomSheet>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    minHeight: 128,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 13,
    textAlign: 'center',
    color: "#737373",
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 15,
    fontWeight: 'bold',

  }
})
