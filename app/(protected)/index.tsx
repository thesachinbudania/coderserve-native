import { Text } from 'react-native';
import { Dimensions, FlatList, View, Image, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '@/zustand/stores';
import ImageLoader from '@/components/ImageLoader';
import IconButton from '@/components/buttons/IconButton';
import BottomName from '@/components/profile/home/BottomName';
import SmallTextButton from '@/components/buttons/SmallTextButton';
import CourseCard from '@/components/general/CourseCard';
import { useRouter } from 'expo-router';


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
const DateRing = () => {
  return (
    <View>
      <View style={{ width: 32, height: 32, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#eee' }
      }> </View>
      < Text style={{ fontSize: 9, color: '#a6a6a6', marginTop: 4, textAlign: 'center' }}> 16 Jan </Text>
    </View>
  )
}

const StreakContainer = () => {
  return (
    <View style={streakContainerStyles.container} >
      <Text style={streakContainerStyles.heading}> Streak Rate </Text>
      < View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center' }
      }>
        <Image
          source={require('@/assets/images/home/streak.png')}
          style={{ width: 24, height: 24, marginRight: 8, objectFit: 'contain' }}
        />
        < Text style={{ fontSize: 21, fontWeight: 'bold' }}> 0.00 </Text>
      </View>
      < View style={streakContainerStyles.datesContainer} >
        {
          [...Array(7)].map((_, index) => (
            <DateRing key={index} />
          ))
        }
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

const SuggestionCard = () => {
  return (
    <View style={suggestionCardStyles.container} >
      <ImageLoader
        size={80}
        uri='https://api.coderserve.com/media/profile_images/default_profile_image.png'
      />
      <Text style={{ fontSize: 13, fontWeight: 'bold', marginTop: 12, textAlign: 'center' }}>
        George
      </Text>
      < Text style={{ fontSize: 11, color: '#a6a6a6', textAlign: 'center', marginTop: 4 }
      }>
        @georgeorwell
      </Text>
    </View>
  )
}

const suggestionCardStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#f5f5f5',
    alignItems: 'center',
  }
});

export default function Home() {
  const router = useRouter();
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
          time="4 Weeks"
        />
        <CourseCard
          name="Prompy Engineering"
          time="4 Weeks"
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
        <Text style={{ fontSize: 15, fontWeight: 'bold', paddingHorizontal: 16 }}> Suggestions </Text>
        < FlatList
          data={[1, 2, 3, 4, 5]}
          renderItem={() => <SuggestionCard />}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
        />
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
