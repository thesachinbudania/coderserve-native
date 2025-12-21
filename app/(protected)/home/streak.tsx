import { ActivityIndicator, FlatList, Pressable, Text, Image, View, StyleSheet } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import React from 'react';
import protectedApi from '@/helpers/axios';
import { useRouter } from 'expo-router';
import { SuggestionCard } from '..';
import FaqComponent from '@/components/general/Faq';
import BottomName from '@/components/profile/home/BottomName';
import { DateSelectorStreak } from '@/components/home/DateSelectorStreak';
import BottomSheet from '@/components/messsages/BottomSheet';
import BlueButton from '@/components/buttons/BlueButton';

function StreakBox({ header, content }: { header: string, content: string }) {
  return (
    <View style={{ flex: 1 / 2, paddingVertical: 16, borderRadius: 8, backgroundColor: "#f5f5f5", alignItems: 'center' }}>
      <Text style={{ color: "#a6a6a6", fontSize: 11 }}>{header}</Text>
      <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 8 }}>{content}</Text>
    </View>
  )
}


const ChainItem = ({ item, isLastItem }: { item: any, isLastItem: boolean }) => {
  return (
    <View style={styles.itemContainer}>
      {/* The line is now positioned absolutely relative to the container */}
      {!isLastItem && <View style={styles.line} />}
      <View style={styles.dotContainer}>
        <View style={styles.dot} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.streakText}>{item.streak}% Streak</Text>
        <Text style={styles.titleText}>{item.additional ? 'Additional Resources' : 'Module'} - {item.title}</Text>
      </View>
    </View>
  );
};

const ChainComponent = ({ data }: { data: any }) => {
  const chainData = data.map((item: any) => ({
    streak: item.streak_increment,
    title: item.module.title,
    additional: item.module.additionalResources
  }))
  return (
    <View style={styles.container}>
      <FlatList
        data={chainData}
        renderItem={({ item, index }) => (
          <ChainItem item={item} isLastItem={index === chainData.length - 1} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    position: 'relative', // Necessary for absolute positioning of the line
  },
  dotContainer: {
    // This view is now just a placeholder for the dot
    marginRight: 16,
    paddingTop: 6
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
    zIndex: 1, // Ensures the dot is rendered on top of the line
  },
  line: {
    // Absolutely positioned to connect the dots
    position: 'absolute',
    top: 6, // Start the line at the vertical center of the dot
    left: 5, // Position the line at the horizontal center of the dot
    bottom: -20,
    width: 2,
    backgroundColor: '#f5f5f5',
  },
  textContainer: {
    flex: 1,
  },
  streakText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#737373',
  },
  titleText: {
    fontSize: 13,
    color: '#a6a6a6',
    marginBottom: 48,
    marginTop: 8
  },
  dividerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 32, // Set height to match the star image
    marginTop: 48
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f5f5f5',
  },
  starImage: {
    width: 32,
    height: 32,
    marginHorizontal: 8, // Creates the 8px gap on both sides
  },
});

export default function Streak() {
  const [topPerformrs, setTopPerformers] = React.useState<any>(null);
  const [activities, setActivities] = React.useState<any>(null);
  const [loaded, setLoaded] = React.useState(0);
  const menuRef = React.useRef<any>(null);
  const router = useRouter();

  React.useEffect(() => {
    protectedApi.get('/home/leaderboard/')
      .then((res) => {
        setTopPerformers(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoaded((prev) => prev + 1);
      });
  }, [])

  const [dateSelectorVisible, setDateSelectorVisible] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<any>(null);
  const [currentStreak, setCurrentStreak] = React.useState<any>(null);
  const [streakRate, setStreakRate] = React.useState<any>(null);
  const [todayDate, setTodayDate] = React.useState('');

  React.useEffect(() => {
    const today = new Date();
    // Normalize to the start of the day in UTC to prevent timezone issues.
    today.setUTCHours(0, 0, 0, 0);
    const date = new Date(today.getTime());
    date.setUTCDate(today.getUTCDate() + 0);
    setTodayDate(date.toISOString());
    setSelectedDate(date.toISOString())
    fetchActivities();
  }, [])


  const fetchActivities = () => {
    if (!selectedDate) return;
    protectedApi.get(`/home/streak_activities/?date=${selectedDate}`).then(
      (res) => {
        setActivities(res.data)
      }
    )
  }

  const [initialFetch, setInitialFetch] = React.useState(false);

  React.useEffect(() => {
    if (!selectedDate || initialFetch) return;
    setInitialFetch(true);
    fetchActivities();
  }, [selectedDate])


  React.useEffect(() => {
    protectedApi.get("/home/streak/").then((res) => {
      setCurrentStreak(res.data.current_streak);
      setStreakRate(res.data.streak_rate);
      setLoaded((prev) => prev + 1);
    })
  }, [])
  const date = new Date(selectedDate);
  return (
    <PageLayout
      headerTitle='Streak'
      scrollEnabled={!dateSelectorVisible}
      contentContainerStyle={{ paddingBottom: 44 }}
    >
      {
        loaded < 2 ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <ActivityIndicator size='large' color={'#202020'} />
        </View>
          : <>
            <Image source={require("@/assets/images/home/streak.png")} style={{ width: 96, height: 96, alignSelf: 'center', objectFit: 'contain' }} />
            <Text style={{ marginTop: 16, fontSize: 15, textAlign: "center", fontWeight: 'bold' }}>Consistency is key!</Text>
            <Text style={{ fontSize: 13, color: "#737373", textAlign: 'center', marginTop: 8 }}>Your dedication is paving the way for great achievement.</Text>
            <View style={{ marginTop: 32, flexDirection: 'row', gap: 16 }}>
              <StreakBox
                header='Streak Rate'
                content={streakRate ? streakRate.toFixed(2) : '0.00'}
              />
              <StreakBox
                header='Current Streak'
                content={`${currentStreak} ${currentStreak > 1 ? 'days' : 'day'}`}
              />
            </View>
            <View style={{ marginTop: 48 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Activites</Text>
                <Pressable
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                  onPress={() => {
                    setDateSelectorVisible(!dateSelectorVisible)
                    menuRef.current?.open();
                  }}
                >
                  {
                    ({ pressed }) => <>
                      <Text style={[{ fontSize: 11 }, pressed && { color: "#006dff" }]}>{selectedDate === todayDate ? 'Today' : date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</Text>
                      <Image source={pressed ? require('@/assets/images/home/blueDownArrow.png') : require("@/assets/images/home/greyDownArrow.png")} style={{ height: 12, width: 12, objectFit: 'contain' }} />
                    </>
                  }
                </Pressable>
              </View>
              <BottomSheet menuRef={menuRef} height={308}>
                <DateSelectorStreak
                  selectedValue={selectedDate}
                  onValueChange={setSelectedDate}
                />
                <BlueButton
                  title='Apply'
                  onPress={() => {
                    fetchActivities();
                    menuRef.current?.close();
                  }}
                />
              </BottomSheet>
              {activities && activities.length > 0 ? <ChainComponent
                data={activities}
              /> : <View style={{ paddingVertical: 96, marginTop: 16, marginBottom: 48, borderWidth: 1, borderRadius: 12, borderColor: '#f5f5f5' }}>
                <Text style={{ textAlign: 'center', color: "#d9d9d9", fontSize: 11 }}>{todayDate === selectedDate ? 'Start learning  or posting to see your progress here.' : 'No Activity Logged'}</Text>
              </View>}
            </View>
            < View style={{ gap: 16, marginHorizontal: -16 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', paddingHorizontal: 16 }}>Leaderboard</Text>
              {topPerformrs && (
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
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Image
                source={require("@/assets/images/home/greyStar.png")}
                style={styles.starImage}
              />
              <View style={styles.dividerLine} />
            </View>
            <View style={{ marginTop: 48 }}>
              <Text style={{ fontSize: 15, color: "#a6a6a6", fontWeight: 'bold' }}>FAQs</Text>
              <FaqComponent />
            </View>
            <BottomName />
          </>
      }
    </PageLayout>

  );
}
