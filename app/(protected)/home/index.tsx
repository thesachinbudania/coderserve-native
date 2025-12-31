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
import { useNotificationsUnreadStore } from '@/zustand/stores';
import useSearchBar from '@/helpers/general/searchBar';
import Search from '@/components/talks/home/Search';
import BottomDrawer from '@/components/BottomDrawer';
import { MenuButton } from '@/components/jobs/Menu';
import FunnelChart from '@/components/home/FunnelChart';
import { ActivityIndicator } from 'react-native-paper';

const { width } = Dimensions.get('window');


function Header({ rank, menuRef }: { rank: number | null, menuRef?: any }) {
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
        < IconButton
          onPress={() => router.push('/(freeRoutes)/messages')}
        >
          <Image
            source={require("@/assets/images/jobs/Chats.png")}
            style={styles.headerIcon}
          />
        </IconButton>
        <IconButton
          onPress={() => menuRef.current?.open()}
        >
          <Image
            source={require("@/assets/images/profile/home/menu.png")}
            style={styles.headerIcon}
          />
        </IconButton>
      </View>
    </View>
  );
}

const StreakContainer = () => {
  const [data, setData] = React.useState({
    basics: 0,
    text: 0,
    image: 0,
    video: 0,
    multimodal: 0,
    voice: 0
  })
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    protectedApi.get('/home/user_specialization_stats/').then(res => {
      setData({
        basics: res.data.basics,
        text: res.data.text,
        image: res.data.image,
        video: res.data.video,
        multimodal: res.data.multimodel,
        voice: res.data.voice
      })
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])
  const isData = Object.values(data).reduce((a, b) => a + b, 0) === 0
  const sheetRef = React.useRef<any>(null);
  return (<>
    <View style={{ flexDirection: 'row', marginTop: 32, gap: 16 }}>
      <Pressable
        style={({ pressed }) => [{ borderRadius: 12, backgroundColor: "#f7f7f7", flex: 1 / 2, padding: 16 }, !isData && pressed && { backgroundColor: '#202020' }]}
        onPress={!isData ? () => sheetRef.current?.open() : () => { }}
      >
        <Text style={{ fontSize: 11, color: "#a6a6a6" }}>Expertise in</Text>
        {
          loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator color='#202020' />
            </View>
          ) : isData ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('@/assets/images/home/frowny.png')} style={{ height: 45, width: 45 }} />
            </View>
          ) : (
            <FunnelChart
              data={data}
              showLabels={false}
              lineColor="#a6a6a6"
              contentContainerStyle={{ marginTop: 8 }}
            />
          )
        }
      </Pressable>
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
    <BottomDrawer sheetRef={sheetRef}>
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: 'bold', marginTop: 16, marginBottom: 32, textAlign: 'center' }}>Expertise In</Text>
        <View style={{ borderWidth: 1, borderColor: '#f5f5f5', borderRadius: 12, overflow: 'hidden', height: 390 }}>
          <FunnelChart
            data={data}
            contentContainerStyle={{ marginTop: -2, marginBottom: -2 }}
          />
        </View>
      </View>
    </BottomDrawer>
  </>
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

const ResultsComponent = ({ data }: { data: any }) => {
  const router = useRouter();
  const SearchResult = ({ title, subTitle, onPress = () => { } }: { title: string, subTitle?: string, onPress?: () => void }) => {
    return (
      <Pressable onPress={onPress} >
        {
          ({ pressed }) => (
            <>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <Image source={require('@/assets/images/searchIcon.png')} style={{ height: 15, width: 15 }} />
                <Text style={[{ fontSize: 15 }, pressed && { color: "#006dff" }]}>{title}</Text>
              </View>
              {subTitle && <Text style={[{ fontSize: 11, color: "#a6a6a6", marginLeft: 23, marginTop: 8 }, pressed && { color: "#a1c2ed" }]}>{subTitle}</Text>}
            </>
          )
        }
      </Pressable>
    )
  }
  return (
    data.type === 'course' ? <SearchResult
      title={data.title}
      subTitle={data.category === 'super_set' ? 'Super Set' : 'Additional Resources'}
      onPress={data.course_type === 'lesson' ? () => router.push(`/(protected)/home/courses/lesson/${data.id}`) : () => router.push(`/(protected)/home/courses/modules/${data.id}`)}
    />
      : data.type === 'module' ? <SearchResult
        title={data.title}
        subTitle={data.category.startsWith('Module') ? 'Module' : data.category}
        onPress={data.unlocked ? () => router.push(`/(protected)/home/courses/lesson/${data.module_lessons[0]}`) : () => router.push(`/(protected)/home/courses/modules/${data.course_id}`)}
      />
        : data.type === 'lesson' ?
          <View style={{ gap: 24 }}>
            {
              data.matches.map((match: any, index: number) => (
                <SearchResult key={index} title={match} onPress={() => router.push(`/(protected)/home/courses/lesson/${data.id}`)} />
              ))
            }
          </View> : <></>
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
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const { searchBarMarginTop, contentOpacity, scaleX } = useSearchBar({ setIsSearchFocused, isSearchFocused });
  const [searchResults, setSearchResults] = React.useState<any>([]);
  const menuRef = React.useRef<any>(null)
  React.useEffect(() => {
    if (search.length < 3) {
      setSearchResults([])
      return;
    };
    protectedApi.get(`/home/search/?q=${search}`)
      .then((res) => {
        setSearchResults(res.data)
      })
      .catch(err => console.log(err.response.data))
  }, [search])

  React.useEffect(() => {
    if (!isSearchFocused) {
      setSearchResults([]);
      setSearch('');
    }
  }, [isSearchFocused])

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: 'white', alignItems: 'center' }}
      scrollEnabled={!isSearchFocused}
    >
      <Animated.View style={{ width: '100%', paddingHorizontal: 16, transform: [{ scaleX: scaleX }] }}>
        <Animated.View style={{ opacity: contentOpacity }}>
          <Header rank={70} menuRef={menuRef} />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateY: searchBarMarginTop }] }}>
          <Search
            search={search}
            setSearch={setSearch}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            searchResults={searchResults}
            ResultComponent={ResultsComponent}
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
      <BottomDrawer sheetRef={menuRef} draggableIconHeight={0}>
        <View style={{ gap: 16, marginHorizontal: 16 }}>
          <MenuButton heading='Challenges' text='Level up with problem-solving tasks.' />
          <MenuButton heading='Leaderboard' text='See where you stand among others.' />
          <MenuButton heading='Contests' text='Compete with real-world champions.' />
          <MenuButton heading='Go Pro' text='Unlock advanced features and accelerate your skills.' dark />
        </View>
      </BottomDrawer>
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
