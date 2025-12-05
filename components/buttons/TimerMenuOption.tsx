import React, { useEffect, useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import dayjs from 'dayjs';

interface TimerMenuOptionProps {
    title: string;
    subTitle: string;
    pressTimer?: number; // minutes
    creationTime: string | number | null;
    onPress?: () => void;
}

export default function TimerMenuOption({
    title,
    subTitle,
    pressTimer = 15,
    creationTime,
    onPress = () => { },
}: TimerMenuOptionProps) {
    const pressTimerMinutes = pressTimer * 60 * 1000; // minutes in milliseconds
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (creationTime) {
            const creationTimeMs = typeof creationTime === 'number' ? creationTime : dayjs(creationTime).valueOf();

            // Initial check
            const now = dayjs().valueOf();
            const elapsed = now - creationTimeMs;
            const remaining = pressTimerMinutes - elapsed;

            if (remaining <= 0) {
                setTimeLeft(0);
                return;
            }

            setTimeLeft(Math.ceil(remaining / 1000));

            const interval = setInterval(() => {
                const now = dayjs().valueOf();
                const elapsed = now - creationTimeMs;
                const remaining = pressTimerMinutes - elapsed;
                setTimeLeft(remaining > 0 ? Math.ceil(remaining / 1000) : 0);
                if (remaining <= 0) {
                    clearInterval(interval);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
        return;
    }, [creationTime, pressTimerMinutes]);

    if (!timeLeft || timeLeft <= 0) return null;

    return (
        <Pressable
            style={{ padding: 16, borderWidth: 1, borderColor: '#f5f5f5', borderRadius: 12 }}
            onPress={onPress}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{title}</Text>
                <Text style={{ fontSize: 11, color: '#00bf63', paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#d3ffea', borderRadius: 12 }}>{
                    `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`
                }</Text>
            </View>
            <Text style={{ fontSize: 12, color: "#a6a6a6", marginTop: 8 }}>{subTitle}</Text>
        </Pressable>
    );
}
