/**
 * MenuOption Component
 * 
 * Displays a single option in the message action menu (Edit/Delete).
 * Shows a countdown timer indicating how much time is left to perform the action.
 * Only renders when there is time remaining on the timer.
 * 
 * Features:
 * - Real-time countdown timer (updates every second)
 * - Automatically hides when time expires
 * - Formatted time display (MM:SS)
 * - Visual timer badge with green accent
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import dayjs from 'dayjs';

/**
 * Props for the MenuOption component
 */
interface MenuOptionProps {
    /** Title of the option (e.g., "Edit Message", "Delete Message") */
    title: string;
    /** Description of what this option does */
    subTitle: string;
    /** Time limit in minutes for this action (default: 15) */
    pressTimer?: number;
    /** Callback when option is pressed */
    onPress?: () => void;
    /** Timestamp (in milliseconds) when the message was created */
    messageTime: number | null;
}

/**
 * MenuOption renders an actionable menu item with a countdown timer.
 * The component only appears if there is time remaining to perform the action.
 * 
 * @param {MenuOptionProps} props - Component props
 */
export default function MenuOption({ title, subTitle, pressTimer = 15, onPress = () => { }, messageTime }: MenuOptionProps) {
    // Convert timer from minutes to milliseconds
    const pressTimerMinutes = pressTimer * 60 * 1000;

    // Remaining time in seconds
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    // Set up interval to update countdown timer every second
    useEffect(() => {
        if (messageTime) {
            const interval = setInterval(() => {
                const now = dayjs().valueOf();
                const elapsed = now - messageTime;
                const remaining = pressTimerMinutes - elapsed;

                // Update time left (in seconds), or set to 0 if expired
                setTimeLeft(remaining > 0 ? Math.ceil(remaining / 1000) : 0);

                // Clear interval when time expires
                if (remaining <= 0) {
                    clearInterval(interval);
                }
            }, 1000); // Update every second

            // Cleanup interval on unmount
            return () => clearInterval(interval);
        }
        return;
    }, [messageTime]);

    // Only render if there is time remaining
    return (
        timeLeft && timeLeft > 0 && (
            <Pressable
                style={({ pressed }) => [{ padding: 16, borderWidth: 1, borderColor: '#f5f5f5', borderRadius: 12 }, pressed && { borderColor: "#006dff" }]}
                onPress={onPress}
            >
                {/* Header row with title and timer */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 15, lineHeight: 15, fontWeight: 'bold' }}>{title}</Text>

                    {/* Countdown timer badge - only shown when time is available */}
                    {timeLeft && timeLeft > 0 && (
                        <Text style={{ fontSize: 11, lineHeight: 11, color: '#00bf63', paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#d3ffea', borderRadius: 12 }}>{
                            /* Format as MM:SS */
                            `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`
                        }</Text>
                    )}
                </View>

                {/* Subtitle/description */}
                <Text style={{ fontSize: 12, lineHeight: 12, color: "#a6a6a6", marginTop: 8 }}>{subTitle}</Text>
            </Pressable>
        )
    )
}
