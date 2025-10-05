import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform
} from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Sample FAQ data
const faqData = [
  {
    id: '1',
    question: 'What is the Streak feature?',
    answer: 'The Streak tracks your daily learning and activity progress visually over the last 182 days (about 6 months).',
  },
  {
    id: '2',
    question: 'How is my daily streak percentage calculated?',
    answer: `Each day, you earn streak percentage based on your activity:
  - Completed 1 module = 100%
  - Completed 50% of a module = 50%
  - Posted something useful = 25%
`,
  },
  {
    id: '3',
    question: 'What does each box in the streak grid represnet?',
    answer: `Each box = 1 day
Layout: 26 weeks (columns) x 7 days (rows) = 182 days
Colors or intensity of the boxes reflect your daily streak percentage. More completion = darker/more intense color.`,
  },
  {
    id: "4",
    question: 'Will I lose my streak if I skip a day?',
    answer: "Not exactly. Your streak isn't broken line in some apps. Even partial activity (like posting or completing 50% of a module) will count. You only get 0% if you do nothing on that day.",
  },
  {
    id: "5",
    question: "What is Streak Rate?",
    answer: `Streak Rate measures how consistently active you've been since joining the platform. It's a percentage score.
Streak Rate = (Total streak % across all days) / (Total days since joining)`,
  },
  {
    id: "6",
    question: "What is 'Activities section'?",
    answer: `The Activities section shows all the action you've comleted on a specific day that contributed to your streak - not just today.

By default, it shows today's activity. You can chane the date to view your activities on any of the past 182 days.

Example entries:
  - Completed "Module 1: Introduction to AI"
  - Posted: "Best practices for clean code in Python`,
  },
  {
    id: "7",
    question: "Why don't I see anything in Activities?",
    answer: "If you haven't done anything that contributes to your streak (course progress or a useful post), this section will be empty.",
  },
  {
    id: "8",
    question: "What is the Leaderboard?",
    answer: `The leaderboard ranks users based on their total points earned by:
  - Completing course modules
  - Completing project modules

It highlights top learners and creators in the community.`
  },
  {
    id: "9",
    question: "How are points calculated for the leaderboard?",
    answer: `Each completed module (course or project) gives you points.
More modules = More points = Higher rank.
(Note: Streak activity itself doesn't add leaderboard points unless it involves completing modules.)`,
  },
  {
    id: "10",
    question: "Does posting increase leaderboard rank?",
    answer: "No. Useful posts only help increase your daily streak, not your leaderboard rank."
  }
];

const FaqItem = ({ item }: { item: any }) => {
  // State to manage the expanded/collapsed status
  const [isExpanded, setIsExpanded] = useState(false);
  // Animated value for the rotation of the arrow
  const rotationAnim = useRef(new Animated.Value(0)).current;

  // Function to toggle the FAQ item
  const toggleFaq = () => {
    // Configure a spring-like animation for the layout change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setIsExpanded(!isExpanded);

    // Animate the arrow rotation
    Animated.timing(rotationAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Interpolate the animated value to a rotation degree
  const arrowRotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.faqItemContainer}>
      <TouchableOpacity onPress={toggleFaq} activeOpacity={0.8}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{item.question}</Text>
          <Animated.Image
            source={require("@/assets/images/arrows/down.png")}
            style={[styles.arrowIcon, { transform: [{ rotate: arrowRotation }] }]}
          />
        </View>
      </TouchableOpacity>

      {/* The answer section, which will be shown/hidden with a layout animation */}
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
      <View style={styles.divider} />
    </View>
  );
};

const FaqComponent = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={faqData}
        renderItem={({ item }) => <FaqItem item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 16,
  },
  faqItemContainer: {
    marginBottom: 24,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  arrowIcon: {
    width: 16,
    height: 16,
    marginLeft: 10,
  },
  answerContainer: {
  },
  answerText: {
    fontSize: 12,
    color: '#737373',
    lineHeight: 20,
    marginBottom: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 16,
  },
});

export default FaqComponent;
