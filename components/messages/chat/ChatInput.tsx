/**
 * ChatInput Component
 * 
 * The input area at the bottom of the chat screen where users compose messages.
 * Handles both text input and image attachment functionality.
 * 
 * Features:
 * - Multiline text input with auto-expanding height
 * - Keyboard-aware layout with smooth animations
 * - Safe area inset handling for devices with notches
 * - Dual-purpose send button:
 *   - Shows send icon when text is entered
 *   - Shows attachment icon when input is empty
 * - Disabled state when chat is locked/blocked
 * - Different messages for different disabled states
 * 
 * @component
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, Image, Keyboard, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import SmallTextButton from '@/components/buttons/SmallTextButton';

/**
 * Props for the ChatInput component
 */
interface ChatInputProps {
    /** Current value of the text input */
    value: string;
    /** Callback when text changes */
    onChange: (t: string) => void;
    /** Callback when send button is pressed */
    onSend: () => void;
    /** Callback when image picker is triggered */
    onPickImage: () => void;
    /** Whether the send button is disabled (e.g., during upload) */
    disabled?: boolean;
    /** Whether messaging is disabled by the server */
    chatDisabled: boolean;
    /** Whether chat is blocked (user-initiated or system) */
    chat_blocked: boolean;
    /** Name of the other user (for "Know More" link) */
    otherUserName?: string;
    /** Whether the current user blocked the other user */
    blocked?: boolean;
    /** Whether images are allowed to be sent */
    allowImages?: boolean;
}

export default function ChatInput({ value, onChange, onSend, onPickImage, disabled, chatDisabled, otherUserName, chat_blocked, blocked, allowImages = true }: ChatInputProps) {
    // Determine if send button should be enabled
    const canSend = value.trim().length > 0 && !disabled;
    const router = useRouter();

    // Get safe area inset for proper bottom padding on notched devices
    const { bottom } = useSafeAreaInsets();

    // Track keyboard visibility state
    const [keyboardOpen, setKeyboardOpen] = useState(false);

    // Subscribe to keyboard show/hide events
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardOpen(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardOpen(false);
        });
        // Cleanup listeners on unmount
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // Animated value for smooth bottom margin transition
    // Animates between safe area bottom and 0 when keyboard opens/closes
    const animatedMargin = useRef(new Animated.Value(bottom)).current;

    // Animate margin when keyboard state changes
    useEffect(() => {
        Animated.timing(animatedMargin, {
            toValue: keyboardOpen ? 0 : bottom, // Remove margin when keyboard is open
            duration: 180,
            useNativeDriver: false, // Layout animations require native driver to be false
        }).start();
    }, [keyboardOpen, bottom]);


    return (
        <View style={styles.commentInputContainer}>
            {
                /* Show disabled state when chat is locked or blocked */
                chatDisabled || blocked ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24, flexDirection: 'row', marginBottom: bottom }}>
                        {
                            blocked ? (
                                <Text style={{ fontSize: 11, color: "#737373" }}>You blocked this user.</Text>
                            ) :
                                /* Different messages for different disabled reasons */
                                !chat_blocked ? (
                                    /* Server-side messaging disabled - show "Know More" link */
                                    <>
                                        <Text style={{ fontSize: 11, color: "#737373" }}>Messaging Disabled - </Text><SmallTextButton style={{ fontSize: 11 }} title="Know More" onPress={() => { router.push('/(freeRoutes)/messages/messagingDisabled/' + otherUserName) }} />
                                    </>
                                ) : (
                                    /* User-blocked or chat closed */
                                    <Text style={{ fontSize: 11, color: "#737373" }}>Chat Closed</Text>
                                )
                        }
                    </View>
                )
                    : (
                        /* Active chat input - keyboard-animated container */
                        <Animated.View style={{ flexDirection: 'row', marginBottom: animatedMargin, alignItems: 'center' }}>
                            {/* Multiline text input */}
                            <TextInput
                                onChangeText={onChange}
                                value={value}
                                multiline
                                style={[styles.commentInput]}
                                placeholder="Write here"
                                textAlignVertical="top"
                                placeholderTextColor={'#cfdbe6'}
                            />

                            {/* Send/Attach button - dual purpose based on input content */}
                            <Pressable
                                onPress={canSend ? onSend : (allowImages ? onPickImage : undefined)} // Send text or pick image
                                disabled={disabled || (!canSend && !allowImages)}
                                style={({ pressed }) => [
                                    {
                                        height: 45, width: 45, justifyContent: 'center', alignItems: 'center',
                                        backgroundColor: canSend ? '#202020' : '#f5f5f5', borderRadius: 45, margin: 8, marginRight: 16
                                    },
                                    pressed && canSend && { backgroundColor: '#006dff' },
                                    pressed && !canSend && { backgroundColor: "#d9d9d9" }
                                ]}
                            >
                                {
                                    ({ pressed }) => (
                                        /* Icon changes based on state: send arrow or attachment clip */
                                        <Image
                                            style={[{ transform: [{ rotate: canSend || disabled || !allowImages ? '-90deg' : '0deg' }], height: 24, width: 24 }]}
                                            source={
                                                canSend
                                                    ? require('@/assets/images/arrows/right-arrow-white.png') :
                                                    (!allowImages)
                                                        ? require('@/assets/images/arrows/right-muted.png') :
                                                        (pressed && canSend) ? require('@/assets/images/messages/clip-white.png')
                                                            : disabled ? require('@/assets/images/arrows/right-muted.png') : require('@/assets/images/messages/clip.png')
                                            }
                                        />
                                    )
                                }
                            </Pressable>
                        </Animated.View>
                    )
            }

        </View>
    );
}

const styles = StyleSheet.create({
    commentInput: {
        fontSize: 13,
        flex: 1,
        color: 'black',
        maxHeight: 100,
        minHeight: 40,
        paddingVertical: 16,
        paddingLeft: 16,
        textAlignVertical: 'center',
    },
    commentInputContainer: {
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
        paddingHorizontal: 0, // remove horizontal padding so input's left padding is used
        paddingVertical: 0, // remove vertical padding so input's top/bottom padding is used
        flexDirection: 'row',
        alignItems: 'center', // center input and button vertically
    },
});
