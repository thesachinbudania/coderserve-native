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
    question: 'What does each box in the streak grid represent?',
    answer: 'You can earn points by completing modules, participating in quizzes, and engaging with additional resources.',
  },
  {
    id: '3',
    question: 'Will I lose my streak if I skip a day?',
    answer: 'Currently, there is no option to reset your progress. All completed work is saved to your account permanently.',
  },
  {
    id: "4",
    question: 'What is streak rate?',
    answer: 'Streak rate is the percentage of days you have been active in the last 182 days. It is calculated based on your daily activity.',
  },
  {
    id: "5",
    question: "What is the 'Activities' section?",
    answer: "The 'Activities' section shows your daily progress, including completed modules, quizzes, and additional resources. It helps you track your learning journey.",
  },
  {
    id: "6",
    question: "Why don't I see anything in Activites?",
    answer: "If you don't see any activities, it means you haven't completed any modules, quizzes, or additional resources yet. Start engaging with the content to see your progress here.",
  },
  {
    id: "7",
    question: "What is the Leaderboard?",
    answer: "The Leaderboard displays the top users based on their streak rates. It allows you to compare your progress with others and encourages healthy competition.",
  },
  {
    id: "8",
    question: "How are points calculated for the leaderboard?",
    answer: "Points for the leaderboard are calculated based on your daily activity, including completed modules, quizzes, and additional resources. The more active you are, the higher your points.",
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
    height: 2,
    backgroundColor: '#f0f0f0',
    marginTop: 16,
  },
});

export default FaqComponent;
