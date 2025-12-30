import { Animated, Pressable, Text } from 'react-native';
import { Dimensions, FlatList, View, Image, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '@/zustand/stores';
import ImageLoader from '@/components/ImageLoader';
import IconButton from '@/components/buttons/IconButton';
import BottomName from '@/components/profile/home/BottomName';
import CourseCard from '@/components/general/CourseCard';
import { useRouter } from 'expo-router';
import React from 'react';
import protectedApi from '@/helpers/axios';
import ProgressRing from '@/components/general/ProgressRing';
import { useNotificationsUnreadStore } from '@/zustand/stores';
import useSearchBar from '@/helpers/general/searchBar';
import Search from '@/components/talks/home/Search';

const { width } = Dimensions.get('window');


function Header({ rank }: { rank: number | null }) {
  const user = useUserStore(state => state);
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { account, journey, job_alerts, follow_requests, upvotes, downvotes, comments, replies, tags, support } = useNotificationsUnreadStore();

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
          >{user.first_name}</Text>
          < Text style={styles.secondaryHeaderText} >
            {rank ? `Ranked #${rank}` : "Your Journey Begins"}

          </Text>
        </View>
      </View>
      < View style={{ flexDirection: 'row', gap: 16 }}>
        <IconButton
          onPress={() => router.push('/(freeRoutes)/notifications')}
          unread={account + journey + job_alerts + follow_requests + upvotes + downvotes + comments + replies + tags + support > 0}
        >
          <Image
            source={require("@/assets/images/profile/home/notifications.png")}
            style={styles.headerIcon}
          />
        </IconButton>
        < IconButton
          onPress={() => router.push('/(freeRoutes)/messages')}
        >
          <Image
            source={require("@/assets/images/jobs/Chats.png")}
            style={styles.headerIcon}
          />
        </IconButton>
      </View>
    </View>
  );
}
const DateRing = ({ date, streak, faded = false }: { date: string, streak: number, faded?: boolean }) => {
  return (
    <View>
      <ProgressRing progress={streak} backgroundColor={faded ? '#f5f5f5' : '#eeeeee'} />
      < Text style={{ fontSize: 9, color: faded ? '#d9d9d9' : '#a6a6a6', marginTop: 4, textAlign: 'center' }}> {date} </Text>
    </View>
  )
}

const StreakContainer = () => {
  return (
    <View style={{ flexDirection: 'row', marginTop: 32, gap: 16 }}>
      <View style={{ borderRadius: 12, backgroundColor: "#f7f7f7", flex: 1 / 2 }}>
        <Text style={{ fontSize: 11, color: "#a6a6a6", marginTop: 16, marginLeft: 16 }}>Expertise in</Text>
        <View style={{ marginVertical: 48, alignItems: 'center' }}>
          <Image source={require('@/assets/images/home/frowny.png')} style={{ height: 45, width: 45 }} />
        </View>
      </View>
      <View style={{ flex: 1 / 2, gap: 16 }}>
        <View style={{ borderRadius: 12, backgroundColor: "#f7f7f7", padding: 16 }}>
          <Text style={{ fontSize: 11, color: '#a6a6a6' }}>Streak Rate</Text>
          <Text style={{ marginTop: 8, fontSize: 19, fontWeight: 'bold' }}>0.00%</Text>
        </View>
        <View style={{ borderRadius: 12, backgroundColor: '#f7f7f7', padding: 16 }}>
          <Text style={{ fontSize: 11, color: '#a6a6a6' }}>Hands on Challenges</Text>
          <View style={{ marginTop: 8, flex: 1, backgroundColor: '#eeeeee', height: 21, borderRadius: 6 }}></View>
        </View>
      </View>
    </View>
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
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ fontSize: 13, fontWeight: 'bold', marginTop: 12, textAlign: 'center', maxWidth: 240 }}>
        {name}
      </Text>
      < Text style={{ fontSize: 11, color: '#a6a6a6', textAlign: 'center', marginTop: 4 }
      }>
        Ranked #{rank}  |  {points} Points
      </Text>
    </Pressable>
  )
}

const ResultsComponent = (data: any) => {
  console.log('happeing')
  return (
    data.type === 'course' ? <View style={{ backgroundColor: 'blue', height: 165, width: 354 }}>
      <Image source={require('@/assets/images/searchIcon.png')} style={{ height: 15, width: 15, marginLeft: 16 }} />
      <Text>{data.title}</Text>
    </View> : null
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
  const [loading, setLoading] = React.useState(true);




  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const { searchBarMarginTop, contentOpacity, scaleX } = useSearchBar({ setIsSearchFocused, isSearchFocused });
  const [searchResults, setSearchResults] = React.useState<any>([]);
  React.useEffect(() => {
    if (search.length < 3) return;
    protectedApi.get(`/home/search/?q=${search}`)
      .then((res) => {
        console.log(res.data)
        setSearchResults(res.data)
      })
      .catch(err => console.log(err.response.data))
  }, [search])

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: 'white', alignItems: 'center' }
    }>
      <Animated.View style={{ width: '100%', paddingHorizontal: 16, transform: [{ scaleX: scaleX }] }}>
        <Animated.View style={{ opacity: contentOpacity }}>
          <Header rank={70} />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateY: searchBarMarginTop }] }}>
          <Search
            search={search}
            setSearch={setSearch}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            searchResults={searchResults}
            resultComponent={(data) => <ResultsComponent data={data} />}
          />
        </Animated.View>
        <Animated.View style={{ opacity: contentOpacity }}>
          <StreakContainer />
          <View style={{ marginTop: 48, gap: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Basics</Text>
            < CourseCard
              name="Full Stack AI"
              time="20 Hours"
              onPress={() => router.push('/(protected)/home/courses/courses/1')}
            />
            <CourseCard
              name="Generative AI Fundamentals"
              time="0 Hours"
              available={false}
              onPress={() => { router.push(`/(freeRoutes)/home/courseUnavailable/Generative AI`) }}
            />
            <CourseCard
              name="Prompt Engineering Mastery"
              time="0 Hours"
              onPress={() => { router.push(`/(freeRoutes)/home/courseUnavailable/Prompt Engineering`) }}
              available={false}
            />
            <CourseCard
              name="Data Engineering for AI"
              time="0 Hours"
              onPress={() => { router.push(`/(freeRoutes)/home/courseUnavailable/Data Engineering for AI`) }}
              available={false}
            />
            <CourseCard
              name="AI Project Architecture & MLOps"
              time="0 Hours"
              onPress={() => { router.push(`/(freeRoutes)/home/courseUnavailable/Data Engineering for AI`) }}
              available={false}
            />
            <CourseCard
              name="Responsible AI & Safety"
              time="0 Hours"
              onPress={() => { router.push(`/(freeRoutes)/home/courseUnavailable/Data Engineering for AI`) }}
              available={false}
            />
          </View>
          < BottomName />
        </Animated.View>
      </Animated.View>
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
