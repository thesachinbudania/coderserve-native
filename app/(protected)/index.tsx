import { ActivityIndicator, Pressable, Text } from 'react-native';
import { Dimensions, FlatList, View, Image, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '@/zustand/stores';
import ImageLoader from '@/components/ImageLoader';
import IconButton from '@/components/buttons/IconButton';
import BottomName from '@/components/profile/home/BottomName';
import SmallTextButton from '@/components/buttons/SmallTextButton';
import CourseCard from '@/components/general/CourseCard';
import { useRouter } from 'expo-router';
import React from 'react';
import protectedApi from '@/helpers/axios';
import ProgressRing from '@/components/general/ProgressRing';
import { useFocusEffect } from 'expo-router';


const { width } = Dimensions.get('window');
function Header() {
  const user = useUserStore(state => state);
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.headerContainer, { paddingTop: top + 8 }]} >
      <View style={{ flexDirection: "row", gap: 4 }}>
        {
          user.profile_image && (
            <ImageLoader size={48} uri={user.profile_image} border={1} />
          )
        }
        <View style={{ gap: 6, justifyContent: "center" }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.headerName}
          > {user.first_name} </Text>
          < Text style={styles.secondaryHeaderText} >
            AI Enthusiast
          </Text>
        </View>
      </View>
      < View style={{ flexDirection: 'row', gap: 16 }}>
        <IconButton>
          <Image
            source={require("@/assets/images/profile/home/notifications.png")}
            style={styles.headerIcon}
          />
        </IconButton>
        < IconButton >
          <Image
            source={require("@/assets/images/jobs/Chats.png")}
            style={styles.headerIcon}
          />
        </IconButton>
      </View>
    </View>
  );
}
const DateRing = ({ date, streak }: { date: string, streak: number }) => {
  return (
    <View>
      <ProgressRing progress={streak} />
      < Text style={{ fontSize: 9, color: '#a6a6a6', marginTop: 4, textAlign: 'center' }}> {date} </Text>
    </View>
  )
}

const StreakContainer = () => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const date = new Date();
  useFocusEffect(React.useCallback(() => {
    protectedApi.get('/home/last_week_streak/')
      .then((res) => {
        console.log(res.data)
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []))
  return (
    loading ? <View style={{ justifyContent: 'center', alignItems: 'center', height: 128 }}><ActivityIndicator size={'large'} color={'#202020'} /></View> :
      <Pressable
        style={({ pressed }) => [streakContainerStyles.container, pressed && { borderColor: "#006dff" }]}
        onPress={() => router.push('/(protected)/home/streak')}
      >
        <Text style={streakContainerStyles.heading}> Streak Rate </Text>
        < View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center' }
        }>
          <Image
            source={require('@/assets/images/home/streak.png')}
            style={{ width: 24, height: 24, marginRight: 8, objectFit: 'contain' }}
          />
          < Text style={{ fontSize: 21, fontWeight: 'bold' }}>{(data && data.length > 0) ? data[data.length - 1]['total_increment'] : '0.00'}</Text>
        </View>
        < View style={streakContainerStyles.datesContainer} >
          {
            [...Array(7).keys()].map((index, _) => {
              const currentDate = new Date(date); // clone the date
              currentDate.setDate(date.getDate() - (6 - index)); // subtract i days

              const formattedDate = currentDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short'
              });
              const streak = data.length > index ? data[index]['total_increment'] : 0;
              return (

                <DateRing
                  key={index}
                  date={formattedDate}
                  streak={streak}
                />
              )
            }
            )
          }
        </View>
      </Pressable>
  )
}

const streakContainerStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#f5f5f5',
  },
  heading: {
    fontSize: 11,
    color: "#a6a6a6",
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  }
})

interface SuggestionCardProps {
  name: string;
  id: 1;
  onPress?: () => void;
  rank: number;
  points: number;
  image: string;
}

export const SuggestionCard = ({ name, onPress, rank, points, image }: SuggestionCardProps) => {
  return (
    <Pressable style={({ pressed }) => [suggestionCardStyles.container, pressed && { borderColor: "#006dff" }]} onPress={onPress}>
      <ImageLoader
        size={80}
        uri={image}
      />
      <Text style={{ fontSize: 13, fontWeight: 'bold', marginTop: 12, textAlign: 'center' }}>
        {name}
      </Text>
      < Text style={{ fontSize: 11, color: '#a6a6a6', textAlign: 'center', marginTop: 4 }
      }>
        Ranked #{rank}  |  {points} Points
      </Text>
    </Pressable>
  )
}

const suggestionCardStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    width: 256,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#f5f5f5',
    alignItems: 'center',
  }
});

export default function Home() {
  const router = useRouter();
  const [topPerformrs, setTopPerformers] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    protectedApi.get('/home/top_performers/')
      .then((res) => {
        setTopPerformers(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: 'white', paddingHorizontal: 16 }
    }>
      <Header />
      < StreakContainer />
      <View style={{ marginTop: 48, gap: 16 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}> Main Courses </Text>
        < CourseCard
          name="Full Stack AI"
          time="6 Weeks"
          onPress={() => router.push('/(protected)/home/courses/courses/1')}
        />
        < CourseCard
          name="Generative AI"
          time="0 Weeks"
          available={false}
          onPress={() => { router.push(`/(freeRoutes)/home/courseUnavailable/Generative AI`) }}
        />
        <CourseCard
          name="Prompt Engineering"
          time="0 Weeks"
          onPress={() => { router.push(`/(freeRoutes)/home/courseUnavailable/Prompt Engineering`) }}
          available={false}
        />
      </View>
      < View style={{ marginTop: 48, gap: 16 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}> Your Projects </Text>
        < View style={{ padding: 16, borderWidth: 1, borderRadius: 12, borderColor: '#f5f5f5', alignItems: 'center' }}>
          <View style={{ marginVertical: 64, flexDirection: 'row' }}>
            <Text style={{ fontSize: 11, color: '#a6a6a6' }}> You have no projects to learn.</Text>
            < SmallTextButton
              title='Add Now'
              style={{ fontSize: 11, textDecorationLine: 'underline', marginLeft: 4 }}
            />
          </View>
        </View>
      </View>
      < View style={{ marginTop: 48, gap: 16, marginHorizontal: -16 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold', paddingHorizontal: 16 }}>Top 10 Experts</Text>
        {topPerformrs && !loading && (
          < FlatList
            data={topPerformrs.results}
            renderItem={({ item, index }) => <SuggestionCard
              name={item.first_name}
              id={item.id}
              rank={index + 1}
              points={item.points}
              onPress={() => router.push(`/(freeRoutes)/profile/userProfile/${item['username']}`)}
              image={item.profile_image || 'https://api.coderserve.com/media/profile_images/default_profile_image.png'}
            />}
            keyExtractor={(item) => item.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
          />
        )}
      </View>
      < BottomName />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 16,
  },
  headerName: {
    fontSize: 15,
    fontWeight: "bold",
    width: width - 192,
  },
  secondaryHeaderText: {
    fontSize: 11,
    color: "#737373",
  },
  headerIcon: {
    width: 24,
    height: 24,
  },

})
