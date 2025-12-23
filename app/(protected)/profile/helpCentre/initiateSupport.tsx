
import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import Header from '@/components/general/Header';
import DateSeparator from '@/components/messages/chat/DateSeparator';
import protectedApi from '@/helpers/axios';

import MessageBubble from '@/components/messages/chat/MessageBubble';
import ChatInput from '@/components/messages/chat/ChatInput';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import { Message, ChatListItem } from '@/components/messages/chat/types';
import { useRouter } from 'expo-router';
import errorHandler from '@/helpers/general/errorHandler';

export default function InitiateSupport() {
    // State for chat messages and flow control
    const [messages, setMessages] = useState<Message[]>([]);
    const [step, setStep] = useState(0); // 0: Options selection, 1: Detail input
    const [inputText, setInputText] = useState('');
    const [subject, setSubject] = useState('');
    const [ticketCreated, setTicketCreated] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const { top } = useSafeAreaInsets();
    const router = useRouter();

    // Load initial system greeting
    useEffect(() => {
        const greeting: Message = {
            id: 'system-greeting',
            text: 'Hi there! How can I help you today?',
            createdAt: dayjs().toISOString(),
            timestamp: dayjs().format('h:mm A'),
            senderId: 'support-bot',
            edited: false,
            isFirstInGroup: true,
        };
        setMessages([greeting]);
    }, []);

    // Handle user selecting a support topic
    const handleOptionSelect = (option: string) => {
        const now = dayjs();

        // 1. User message (selected option)
        const userMsg: Message = {
            id: `user-select-${Date.now()}`,
            text: option,
            createdAt: now.toISOString(),
            timestamp: now.format('h:mm A'),
            senderId: 'current-user',
            edited: false,
            isFirstInGroup: true,
        };

        // 2. System follow-up message
        const systemResponse: Message = {
            id: `system-response-${Date.now()}`,
            text: 'Got it! Please tell us a little more about the issue you\'re facing.',
            createdAt: now.add(500, 'ms').toISOString(), // Slight delay for realism
            timestamp: now.format('h:mm A'),
            senderId: 'support-bot',
            edited: false,
            isFirstInGroup: true,
        };

        setMessages(prev => [...prev, userMsg, systemResponse]);
        setStep(1); // Advance to input step
        setSubject(option)
    };

    // Handle sending the detailed description
    const handleSend = () => {
        const data = {
            "subject": subject,
            "description": inputText
        }

        // add a new message to the chat from the user
        const userMsg: Message = {
            id: `user-select-${Date.now()}`,
            text: inputText,
            createdAt: dayjs().toISOString(),
            timestamp: dayjs().format('h:mm A'),
            senderId: 'current-user',
            edited: false,
            isFirstInGroup: true,
        };

        setMessages(prev => [...prev, userMsg]);
        // Clear input after sending (simulating send)
        setInputText('');
        protectedApi.post('/talks/support/tickets/', data).then((res) => {
            const systemResponse: Message = {
                id: `system-response-${Date.now()}`,
                text: 'Thank you for the details. \n\n Your support request has been submitted and a ticket has been created. It is now under review by our team. \n\n You can check the status of this ticket anytime, under Support History.',
                createdAt: dayjs().toISOString(),
                timestamp: dayjs().format('h:mm A'),
                senderId: 'support-bot',
                edited: false,
                isFirstInGroup: true,
            };
            setMessages(prev => [...prev, systemResponse]);
            setTicketCreated(true)
        }).catch((err) => {
            errorHandler(err, false);
            alert('Error creating a ticket.')
            console.log('error creating a ticket', err.response.data)
        })
    };

    // Render the options buttons as the footer when in step 0
    const renderFooter = () => {
        if (step !== 0) return <View style={{ height: 16 }} />; // Spacer

        const options = ["Sign-In & Sign-Up", "Change Password", "Change Email", "Profile Details", "AI Courses", "Global Rank", "Streaks", "Applied Jobs", "Collab Projects", "Other"];

        return (
            <View style={styles.optionsContainer}>
                <Text style={{ fontSize: 11, color: "#a6a6a6", textAlign: 'center', marginBottom: 24 }}>Suggested Quick Topics</Text>
                {options.map((opt, index) => (
                    <View key={index} style={{ marginBottom: 8 }}>
                        <GreyBgButton
                            title={opt}
                            onPress={() => handleOptionSelect(opt)}
                            bold={false}
                            color='dark'
                        />
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: top + 57 }}>
            <Header fixedHeader title='Initiate Support' onBackPress={() => { router.back() }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 4 }}
                    ListHeaderComponent={<DateSeparator date='Today' />}
                    renderItem={({ index, item }) => (
                        <MessageBubble
                            message={item}
                            currentUserId="current-user"
                            openMessageMenu={() => { }} // No menu needed for support chat
                            maxWidth={index === 0}
                        />
                    )}
                    ListFooterComponent={renderFooter}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
                {
                    !ticketCreated &&
                    <ChatInput
                        value={inputText}
                        onChange={setInputText}
                        onSend={handleSend}
                        onPickImage={() => { }} // No image picker for now
                        disabled={step === 0} // Disabled until topic selected
                        chatDisabled={false}
                        chat_blocked={false}
                        allowImages={false}
                    />
                }
            </KeyboardAvoidingView>
        </View>
    )

}

const styles = StyleSheet.create({
    optionsContainer: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 12,
        alignSelf: 'flex-start', // Align to left like system message? Or full width?
        // User request: "container with background #f5f5f5 padding 16"
        // Usually system messages align left.
        width: '80%', // Match message bubble max-width
        borderTopLeftRadius: 0, // Speech bubble style
    }
});