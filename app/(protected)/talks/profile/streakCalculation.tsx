import { Text, Image, View, StyleSheet } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import UnorderedList from '@/components/general/UnorderedList';
import BottomName from '@/components/profile/home/BottomName';

export default function StreakCalculation() {
  return (
    <PageLayout headerTitle='About Streak' bottomPadding={false}>
      <Image source={require('@/assets/images/home/streak.png')} style={{ height: 104, objectFit: 'contain', marginHorizontal: 'auto' }} />
      <Text style={{ marginHorizontal: 'auto', fontSize: 15, fontWeight: "bold", marginTop: 16 }}>Streak Tracker</Text>
      <Text style={{ textAlign: 'center', fontSize: 13, color: "#737373", marginTop: 8 }}>A smart way to visualize your daily progress and stay consistent with your learning journey.</Text>
      <Text style={{ marginTop: 48, fontSize: 15, fontWeight: "bold" }}>What Is A Streak?</Text>
      <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373", marginTop: 4 }}>
        A streak reflects your daily learning activity. Each day you complete certain tasks, your streak for that day increases up to 100%. The streak chart shows your activity for the last 182 days (about 6 months).
      </Text>
      <View style={{ marginTop: 16 }}>
        <UnorderedList items={['1 box = 1 day', 'Color intensity = how active you were']} gap={-2} >
        </UnorderedList>
      </View>
      <View style={{ marginTop: 48 }}>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>How We Calculate Your Daily Streak</Text>
        <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373", marginTop: 4 }}>
          You can earn up to 100% streak per day by doing the following:
        </Text>
        <View style={{ marginTop: 16, borderRadius: 12, backgroundColor: '#737373', padding: 16, gap: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
            <Text style={[styles.tableText, {flex: 3/4}]}>Completed a full course/project module</Text>
            <Text style={[styles.tableText, {flex: 1/4}]}>100% Streak</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
            <Text style={[styles.tableText, {flex: 3/4}]}>Completed 75% of a course/project module</Text>
            <Text style={[styles.tableText, {flex: 1/4}]}>75% Streak</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
            <Text style={[styles.tableText, {flex: 3/4}]}>Compelted 50% of a course/project module</Text>
            <Text style={[styles.tableText, {flex: 1/4}]}>50% Streak</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
            <Text style={[styles.tableText, {flex: 3/4}]}>Completed 25% of a course/project module</Text>
            <Text style={[styles.tableText, {flex: 1/4}]}>25% Streak</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
            <Text style={[styles.tableText, {flex: 3/4}]}>Posted a useful post</Text>
            <Text style={[styles.tableText, {flex: 1/4}]}>25% Streak</Text>
          </View>
        </View>
        <Text style={{ marginTop: 16, fontSize: 11, color: "#a6a6a6" }}>Note: Streak percentage caps at 100% per day. Any extra effort is appreciated, but won't cout beyond that limit.</Text>
      </View>
      <Text style={{ marginTop: 48, fontSize: 15, fontWeight: "bold", marginBottom: 4 }}>Example Streak Combinations</Text>
      <UnorderedList items={['Complete 50% of a module (50%) + post something useful (25%) = 75% streak', 'Complete 1 full module (100%) + post something = still 100%', 'Only post a helpful update = 25% streak', 'No activity = 0% streak']} gap={16} />
      <Text style={{ marginTop: 48, fontSize: 15, fontWeight: "bold", marginBottom: 4 }}>What Is Streak Rate?</Text>
      <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373" }}>
        Streak Rate is your overall consistency score. It's the average of all your daily streak percentages from the day you joined.
      </Text>
      <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373", marginTop: 12 }}>
        Streak Rate = (Total streak % from all days) ÷ (Total days on the platform)
      </Text>
      <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373", marginTop: 12 }}>
        This gives a better picture of how regularly you’ve been learning - not just recently, but since day one.
      </Text>
      <View style={{ marginBottom: -64 }}>
        <BottomName />
      </View>
    </PageLayout>
  )
}

const styles = StyleSheet.create({
  tableText: {
    fontSize: 13,
    color: 'white',
  }
})
