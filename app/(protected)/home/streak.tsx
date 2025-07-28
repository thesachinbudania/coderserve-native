import { FlatList, Text, Image, View, StyleSheet } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import React from 'react';
import protectedApi from '@/helpers/axios';
import { useRouter } from 'expo-router';
import { SuggestionCard } from '..';
import FaqComponent from '@/components/general/Faq';
import BottomName from '@/components/profile/home/BottomName';

function StreakBox({ header, content }: { header: string, content: string }) {
  return (
    <View style={{ flex: 1 / 2, paddingVertical: 16, borderRadius: 8, backgroundColor: "#f5f5f5", alignItems: 'center' }}>
      <Text style={{ color: "#a6a6a6", fontSize: 11 }}>{header}</Text>
      <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 8 }}>{content}</Text>
    </View>
  )
}

const chainData = [
  { streak: 100, title: 'Module - Python Basics' },
  { streak: 50, title: 'Advanced Python Concepts' },
];

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
        <Text style={styles.titleText}>{item.title}</Text>
      </View>
    </View>
  );
};

const ChainComponent = () => {
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
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

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
    <PageLayout
      headerTitle='Streak'
    >
      <Image source={require("@/assets/images/home/streak.png")} style={{ width: 96, height: 96, alignSelf: 'center', objectFit: 'contain' }} />
      <Text style={{ marginTop: 16, fontSize: 15, textAlign: "center", fontWeight: 'bold' }}>Consistency is key!</Text>
      <Text style={{ fontSize: 13, color: "#737373", textAlign: 'center', marginTop: 8 }}>Your dedication is paving the way for great achievement.</Text>
      <View style={{ marginTop: 32, flexDirection: 'row', gap: 16 }}>
        <StreakBox
          header='Streak Rate'
          content='100.00'

        />
        <StreakBox
          header='Current Streak'
          content='1 Day'
        />
      </View>
      <View style={{ marginTop: 48 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Activities</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 11 }}>Today</Text>
            <Image source={require("@/assets/images/home/greyDownArrow.png")} style={{ height: 12, width: 12 }} />
          </View>
        </View>
        <ChainComponent />
      </View>
      < View style={{ gap: 16, marginHorizontal: -16 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold', paddingHorizontal: 16 }}>Leaderboard</Text>
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
    </PageLayout>

  );
}
