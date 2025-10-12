import { StyleSheet, Pressable, Text, View } from 'react-native';
import protectedApi from '@/helpers/axios';
import React from 'react';
import BottomName from './BottomName';
import { useRouter } from 'expo-router';
import SmallTextButton from '@/components/buttons/SmallTextButton';

const Post = ({ item }: { item: any }) => {
  const Hashtag = ({ tag }: { tag: string }) => (
    <View style={{ padding: 4, borderRadius: 6, borderColor: "#a6a6a6", borderWidth: 1 }}>
      <Text style={{ color: '#a6a6a6', fontSize: 11 }}>{tag} </Text>
    </View>
  )
  return (
    <View
      style={{ padding: 16, backgroundColor: 'white' }}
    >
      <Text style={{ fontSize: 13, color: "#737373" }}>{item.title}</Text>
      <View style={{ marginTop: 16, flexDirection: 'row', gap: 8 }}>
        {
          item.hashtags.map((tag: string, index: number) => {
            return (
              index < 3 ?
                <Hashtag key={tag} tag={'#' + tag} />
                : index == 3 ? <Hashtag key={tag} tag={`+${item.hashtags.length - 3}`} /> : null
            )
          })
        }
      </View>
    </View>
  )
}

export default function({ editable = true }: { editable?: boolean }) {
  const [data, setData] = React.useState<any>(null);
  React.useEffect(() => {
    protectedApi.get('/talks/self_posts/').then((response) => {
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
        <View style={{ marginTop: -16, marginHorizontal: -16, gap: 8, backgroundColor: "#f5f5f5" }}>
          {data.results.map((item: any) => (
            <Pressable
              android_ripple={{ color: '#f5f5f5' }}
              onPress={() => router.push('/talks/viewPost/' + item.id)}
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
              <SmallTextButton title="Create your first post" style={styles.link} />
            </>
          ) :
            <Text style={styles.text}>User hasn't shared any talks yet.</Text>
          }
        </View>}
    </>
  )
}
const styles = StyleSheet.create({
  container: {
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
