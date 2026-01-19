import { Text, Image, View, StyleSheet } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import UnorderedList from '@/components/general/UnorderedList';
import BottomName from '@/components/profile/home/BottomName';

export default function StreakCalculation() {
  return (
    <PageLayout headerTitle='About Streak' bottomPadding={false}>
      <Image source={require('@/assets/images/home/streak.png')} style={{ height: 105, width: 82, marginHorizontal: 'auto' }} />
      <Text style={{ marginHorizontal: 'auto', fontSize: 15, fontWeight: "bold", marginTop: 24, lineHeight: 15 }}>Streak Tracker</Text>
      <Text style={{ textAlign: 'center', fontSize: 13, color: "#737373", marginTop: 4 }}>
        The Streak Tracker is a smart, visual way to understand a user's daily learning momentum. It helps users stay consistent and build long-term habits that lead to real skill growth.
      </Text>
      <Text style={{ marginTop: 48, fontSize: 15, fontWeight: "bold", lineHeight: 15 }}>What Is A Streak?</Text>
      <Text style={[styles.content, { marginTop: 4 }]}>
        A streak represents how active a user was on a given day.
      </Text>
      <Text style={[styles.content, { marginTop: 20 }]}>
        Every day the user completes learning tasks, a streak percentage is earned (up to 100%)
      </Text>
      <Text style={[styles.content, { marginTop: 20 }]}>
        The Streak Chart displays the user's activity for the last 182 days (about 6 months).
      </Text>
      <View style={{ marginTop: 20 }}>
        <UnorderedList items={['1 box = 1 day', 'Color intensity = how active you were']} gap={-2} >
        </UnorderedList>
      </View>
      <View style={{ marginTop: 48 }}>
        <Text style={{ fontSize: 15, fontWeight: "bold", lineHeight: 15 }}>How We Calculate Your Daily Streak</Text>
        <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373", marginTop: 4 }}>
          A user can earn upt to 100% streak per day from courses and challenges.
        </Text>
        <Text style={{ marginTop: 20, color: '#737373', fontSize: 13, marginBottom: 8, fontWeight: "bold" }}>Course Progress:</Text>
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
        <Text style={{ marginTop: 20, color: '#737373', fontSize: 13, marginBottom: 8, fontWeight: "bold" }}>Challenge Completion:</Text>
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
        <Text style={{ marginTop: 6, fontSize: 11, color: "#a6a6a6" }}>Note: The streak percentage is capped at 100% per day. Any additional activity is appreciated but will not increase the streak beyond this limit.</Text>
      </View>
      <Text style={{ marginTop: 48, fontSize: 15, fontWeight: "bold", marginBottom: 4, lineHeight: 15 }}>Example Streak Scenarios</Text>
      <UnorderedList
        items={['50% module completion (50%) + 1 Easy challenge (20%) = 70% streak', 'Full module completion (100%) + 1 Easy challenge (20%) = still 100% streak', 'Only 1 Easy challenge = 20% streak', 'No activity = 0% streak']}
        gap={12}
        textStyle={{
          fontSize: 13,
          color: "#737373",
        }}
      />
      <Text style={{ marginTop: 48, fontSize: 15, fontWeight: "bold", marginBottom: 4, lineHeight: 15 }}>What Is Streak Rate?</Text>
      <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373" }}>
        Streak Rate represents a user's overall learning consistency score. It reflects how regularly the user has been active since joining the platform.
      </Text>
      <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373", marginTop: 20 }}>
        <Text style={{ fontWeight: "bold" }}>Streak Rate </Text>= (Total streak % across all days) / (Total days on the platform)
      </Text>
      <Text style={{ fontSize: 13, textAlign: 'justify', color: "#737373", marginTop: 20 }}>
        This gives a better picture of how regularly you’ve been learning - not just recently, but since day one.
      </Text>
      <View style={{ marginBottom: -0 }}>
        <BottomName contentContainerStyle={{ marginVertical: 64 }} />
      </View>
    </PageLayout>
  )
}

const styles = StyleSheet.create({
  tableText: {
    fontSize: 13,
    color: 'white',
    lineHeight: 13
  },
  content: {
    textAlign: 'justify',
    color: '#737373',
    fontSize: 13
  }
})
