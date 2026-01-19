/**
 * DateSeparator Component
 * 
 * Displays a date label between chat messages to separate different days.
 * This helps users visually identify when messages were sent.
 * 
 * The component shows formatted dates like:
 * - "Today" for messages from the current day
 * - "Yesterday" for messages from the previous day
 * - "5 Dec 2024" for older messages
 * 
 * @component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * DateSeparator renders a centered date label in the chat.
 * 
 * @param {Object} props - Component props
 * @param {string} props.date - Formatted date string to display
 */
const DateSeparator: React.FC<{ date: string }> = ({ date }) => (
    <View style={styles.dateSeparatorContainer}>
        <Text style={styles.dateSeparatorText}>{date}</Text>
    </View>
);

export default DateSeparator;

const styles = StyleSheet.create({
    /** Container centers the date label horizontally and adds vertical spacing */
    dateSeparatorContainer: { alignItems: 'center', marginTop: 12 },
    /** Text styling for the date label - small and muted */
    dateSeparatorText: { fontSize: 11, color: '#a6a6a6', lineHeight: 11 },
});
