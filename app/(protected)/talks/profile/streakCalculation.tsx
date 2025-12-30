import { Text, Image, View, StyleSheet } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import UnorderedList from '@/components/general/UnorderedList';
import BottomName from '@/components/profile/home/BottomName';

export default function StreakCalculation() {
  return (
    <PageLayout headerTitle='About Streak' bottomPadding={false}>
      <Image source={require('@/assets/images/home/streak.png')} style={{ height: 105, width: 82, marginHorizontal: 'auto' }} />
      <Text style={{ marginHorizontal: 'auto', fontSize: 15, fontWeight: "bold", marginTop: 16 }}>Streak Tracker</Text>
      <Text style={{ textAlign: 'center', fontSize: 13, color: "#737373", marginTop: 8 }}>
        The Streak Tracker is a smart, visual way to understand a user's daily learning momentum. It helps users stay consistent and build long-term habits that lead to real skill growth.
      </Text>
      <Text style={{ marginTop: 48, fontSize: 15, fontWeight: "bold" }}>What Is A Streak?</Text>
      <Text style={[styles.content, { marginTop: 4 }]}>
        A streak represents how active a user was on a given day.
      </Text>
      <Text style={[styles.content, { marginTop: 24 }]}>
        Every day the user completes learning tasks, a streak percentage is earned (up to 100%)
      </Text>
      <Text style={[styles.content, { marginTop: 24 }]}>
        The Streak Chart displays the user's activity for the last 182 days (about 6 months).
      </Text>
      <View style={{ marginTop: 24 }}>
        <UnorderedList items={['1 box = 1 day', 'Color intensity = how active you were']} gap={-2} >
        </UnorderedList>
      </View>
      <View style={{ marginTop: 48 }}>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>How We Calculate Your Daily Streak</Text>
        <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373", marginTop: 4 }}>
          A user can earn upt to 100% streak per day from courses and challenges.
        </Text>
        <Text style={{ marginTop: 24, color: '#737373', fontSize: 13, marginBottom: 8, fontWeight: "bold" }}>Course Progress:</Text>
        <View style={{ borderRadius: 12, backgroundColor: '#202020', padding: 16, gap: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
            <Text style={[styles.tableText, { flex: 3 / 4 }]}>Completing a full course module</Text>
            <Text style={[styles.tableText, { flex: 1 / 4 }]}>100% Streak</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
            <Text style={[styles.tableText, { flex: 3 / 4 }]}>Completing 75% of a course module</Text>
            <Text style={[styles.tableText, { flex: 1 / 4 }]}>75% Streak</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
            <Text style={[styles.tableText, { flex: 3 / 4 }]}>Compelting 50% of a course module</Text>
            <Text style={[styles.tableText, { flex: 1 / 4 }]}>50% Streak</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
            <Text style={[styles.tableText, { flex: 3 / 4 }]}>Completing 25% of a course module</Text>
            <Text style={[styles.tableText, { flex: 1 / 4 }]}>25% Streak</Text>
          </View>
        </View>
        <Text style={{ marginTop: 24, color: '#737373', fontSize: 13, marginBottom: 8, fontWeight: "bold" }}>Challenge Completion:</Text>
        <View style={{ borderRadius: 12, backgroundColor: '#202020', padding: 16, gap: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
            <Text style={[styles.tableText, { flex: 3 / 4 }]}>1 Easy challenge</Text>
            <Text style={[styles.tableText, { flex: 1 / 4 }]}>20% Streak</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
            <Text style={[styles.tableText, { flex: 3 / 4 }]}>1 Medium Challenge</Text>
            <Text style={[styles.tableText, { flex: 1 / 4 }]}>30% Streak</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
            <Text style={[styles.tableText, { flex: 3 / 4 }]}>1 Hard Challenge</Text>
            <Text style={[styles.tableText, { flex: 1 / 4 }]}>50% Streak</Text>
          </View>
        </View>
        <Text style={{ marginTop: 16, fontSize: 11, color: "#a6a6a6" }}>Note: The streak percentage is capped at 100% per day. Any additional activity is appreciated but will not increase the streak beyond this limit.</Text>
      </View>
      <Text style={{ marginTop: 48, fontSize: 15, fontWeight: "bold", marginBottom: 4 }}>Example Streak Scenarios</Text>
      <UnorderedList items={['50% module completion (50%) + 1 Easy challenge (20%) = 70% streak', 'Full module completion (100%) + 1 Easy challenge (20%) = still 100% streak', 'Only 1 Easy challenge = 20% streak', 'No activity = 0% streak']} gap={16} />
      <Text style={{ marginTop: 48, fontSize: 15, fontWeight: "bold", marginBottom: 4 }}>What Is Streak Rate?</Text>
      <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373" }}>
        Streak Rate represents a user's overall learning consistency score. It reflects how regularly the user has been active since joining the platform.
      </Text>
      <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373", marginTop: 24 }}>
        <Text style={{ fontWeight: "bold" }}>Streak Rate </Text>= (Total streak % across all days) / (Total days on the platform)
      </Text>
      <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373", marginTop: 12 }}>
        This gives a better picture of how regularly you’ve been learning - not just recently, but since day one.
      </Text>
      <View style={{ marginBottom: -0 }}>
        <BottomName />
      </View>
    </PageLayout>
  )
}

const styles = StyleSheet.create({
  tableText: {
    fontSize: 13,
    color: 'white',
  },
  content: {
    textAlign: 'justify',
    color: '#737373',
    fontSize: 13
  }
})
