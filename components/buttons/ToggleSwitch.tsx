import React, {useEffect, useRef, useState} from 'react';
import {
    Animated,
    Easing,
    Pressable,
    StyleSheet,
    View,
    ViewStyle,
    Platform,
} from 'react-native';

type Size = 'small' | 'medium' | 'large';

interface Props {
    value: boolean;
    onValueChange?: (v: boolean) => void;
    disabled?: boolean;
    size?: Size;
    activeColor?: string;
    inactiveColor?: string;
    thumbColor?: string;
    style?: ViewStyle;
    testID?: string;
}

const SIZES: Record<Size, {width: number; height: number; padding: number}> = {
    small: {width: 36, height: 20, padding: 2},
    medium: {width: 50, height: 30, padding: 3},
    large: {width: 64, height: 38, padding: 4},
};

export default function ToggleSwitch({
    value,
    onValueChange,
    disabled = false,
    size = 'medium',
    activeColor = '#006dff',
    inactiveColor = '#b4b4b4',
    thumbColor = '#FFFFFF',
    style,
    testID,
}: Props) {
    const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
    const [pressed, setPressed] = useState(false);

    useEffect(() => {
        Animated.timing(anim, {
            toValue: value ? 1 : 0,
            duration: 200,
            easing: Easing.out(Easing.circle),
            useNativeDriver: false,
        }).start();
    }, [value, anim]);

    const {width, height, padding} = SIZES[size];
    const thumbSize = height - padding * 2;
    const travel = width - padding * 2 - thumbSize;

    const trackBackground = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [inactiveColor, activeColor],
    });

    const translateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, travel],
    });

    const handlePress = () => {
        if (disabled) return;
        onValueChange && onValueChange(!value);
    };

    const handlePressIn = () => {
        if (disabled) return;
        setPressed(true);
    };

    const handlePressOut = () => {
        if (disabled) return;
        setPressed(false);
    };

    return (
        <Pressable
            accessibilityRole="switch"
            accessibilityState={{checked: value, disabled}}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            testID={testID}
            style={[{opacity: disabled ? 0.6 : 1}, style]}
        >
            <Animated.View
                style={[
                    styles.track,
                    {
                        width,
                        height,
                        borderRadius: height / 2,
                        padding,
                        backgroundColor: Platform.OS === 'android' ? undefined : undefined,
                    },
                ]}>
                <Animated.View
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        borderRadius: height / 2,
                        backgroundColor: pressed ? '#202020' : (trackBackground as any),
                    }}
                />

                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.thumbContainer,
                        {
                            width: thumbSize,
                            height: thumbSize,
                            transform: [{translateX}],
                        },
                    ]}>
                    <View
                        style={[
                            styles.thumb,
                            {
                                width: thumbSize,
                                height: thumbSize,
                                borderRadius: thumbSize / 2,
                                backgroundColor: thumbColor,
                                shadowColor: '#000',
                                shadowOpacity: 0.2,
                                shadowOffset: {width: 0, height: 1},
                                shadowRadius: 1.5,
                                elevation: 2,
                            },
                        ]}
                    />
                </Animated.View>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    track: {
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#E5E5EA',
    },
    thumbContainer: {
        justifyContent: 'center',
    },
    thumb: {},
});