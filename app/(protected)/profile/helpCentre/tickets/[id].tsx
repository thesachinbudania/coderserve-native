import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, KeyboardAvoidingView, Platform, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import protectedApi from '@/helpers/axios';
import { useUserStore } from '@/zustand/stores';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import * as ImagePicker from 'expo-image-picker';
import { SupportHeader } from '@/components/messages/chat/ChatHeader';

// Components
import ChatHeader from '@/components/messages/chat/ChatHeader';
import MessageBubble from '@/components/messages/chat/MessageBubble';
import ChatInput from '@/components/messages/chat/ChatInput';
import DateSeparator from '@/components/messages/chat/DateSeparator';
import { Message, ChatListItem } from '@/components/messages/chat/types';

dayjs.extend(isToday);
dayjs.extend(isYesterday);

const SupportChat = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const currentUser = useUserStore();
    const username = currentUser?.username || 'current-user'; // fallback

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [inputText, setInputText] = useState('');
    const [ticket, setTicket] = useState<any>(null);
    const flatListRef = useRef<FlatList>(null);

    // Format time helper
    const fmtTime = (iso: string) => dayjs(iso).format('h:mm A');

    const fetchMessages = async () => {
        try {
            const response = await protectedApi.get(`/talks/support/tickets/${id}/messages/`);
            // Adapt API response to Message type
            const adaptedMessages: Message[] = response.data.map((msg: any) => ({
                id: String(msg.id),
                text: msg.content,
                imageUrl: msg.image_url,
                // Ensure field compatibility
                createdAt: msg.timestamp || msg.created_at,
                timestamp: fmtTime(msg.timestamp || msg.created_at),
                senderId: msg.sender?.username || 'admin', // Fallback if sender is simplified
                edited: msg.edited || false,
                isFirstInGroup: false, // will update in useMemo
            }));
            setMessages(adaptedMessages);
        } catch (error) {
            console.log('Error fetching messages:', error);
            // alert('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const fetchTicketDetails = async () => {
        try {
            const response = await protectedApi.get(`/talks/support/tickets/${id}/`);
            setTicket(response.data);
        } catch (error) {
            console.log('Error fetching ticket details:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchMessages();
            fetchTicketDetails();
            // Optional: Poll for new messages every 10 seconds?
            // User said "allow chatting with admin", generic HTTP usually implies refresh or polling.
            // I'll leave polling out for now unless requested, or maybe simple interval.
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [id]);

    const handleSend = async () => {
        const text = inputText.trim();
        if (!text) return;

        try {
            setSending(true);
            // Optimistic update
            const tempId = `temp-${Date.now()}`;
            const tempMsg: Message = {
                id: tempId,
                text: text,
                senderId: username,
                createdAt: new Date().toISOString(),
                timestamp: fmtTime(new Date().toISOString()),
                edited: false,
                isFirstInGroup: false
            };
            setMessages(prev => [...prev, tempMsg]);
            setInputText('');

            // API Call
            // Endpoint: POST /talks/support/tickets/<ticket_id>/messages/
            await protectedApi.post(`/talks/support/tickets/${id}/messages/`, {
                content: text
            });

            // Refresh to get real ID and any auto-replies
            fetchMessages();
        } catch (error) {
            console.log('Error sending message:', error);
            alert('Failed to send message');
            // Remove optimistic message? or show error state.
        } finally {
            setSending(false);
        }
    };

    const handlePickAndUploadImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your photos!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (pickerResult.canceled) return;
        const asset = pickerResult.assets[0];

        const tempId = `upload-${Date.now()}`;
        const optimisticMessage: Message = {
            id: tempId,
            text: null,
            senderId: username,
            createdAt: new Date().toISOString(),
            timestamp: fmtTime(new Date().toISOString()),
            localUri: asset.uri,
            uploadProgress: 0,
            fileName: asset.fileName || 'image.jpg',
            fileSize: asset.fileSize,
            edited: false,
            isFirstInGroup: false,
        };
        setMessages(prev => [...prev, optimisticMessage]);

        const formData = new FormData();
        formData.append('image', {
            uri: asset.uri,
            name: asset.fileName || 'image.jpg',
            type: asset.mimeType || 'image/jpeg',
        } as any);

        try {
            // 1. Upload Image
            const response = await protectedApi.post('/home/upload_chat_image/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: progressEvent => {
                    const progress = progressEvent.total ? progressEvent.loaded / progressEvent.total : 0;
                    setMessages(prev => prev.map(msg =>
                        msg.id === tempId ? { ...msg, uploadProgress: progress } : msg
                    ));
                },
            });

            const imageUrl = response.data.image;
            console.log(imageUrl, 'this is the image url')

            // 2. Send Message with Image URL
            await protectedApi.post(`/talks/support/tickets/${id}/messages/`, {
                image_url: imageUrl
            });

            // Refresh messages to get the real message from server
            fetchMessages();

        } catch (error) {
            console.error('Image upload failed:', error);
            alert('Failed to upload image');
            setMessages(prev => prev.map(msg =>
                msg.id === tempId ? { ...msg, error: 'Upload failed' } : msg
            ));
        } finally {
            // Remove optimistic message if needed, or let fetchMessages replace it
            // Typically we might remove the temp one once the real one arrives
            setMessages(prev => prev.filter(msg => msg.id !== tempId));
        }
    };

    // --- MESSAGE GROUPING ---
    const chatListItems = useMemo((): (ChatListItem | { id: string, isTicketHeader: true, topic: string, description: string })[] => {
        if (!ticket) return []; // Wait for ticket details

        // 1. Combine messages and ticket header into a single list
        const rawItems: any[] = [...messages];

        // Add ticket header as a pseudo-message
        rawItems.push({
            id: 'ticket-header',
            isTicketHeader: true,
            topic: ticket.subject,
            description: ticket.description,
            createdAt: ticket.created_at, // Use ticket creation time for sorting
            timestamp: fmtTime(ticket.created_at),
            senderId: 'system', // specific sender id for grouping (won't group with user messages)
        });

        // 2. Sort by Date
        rawItems.sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf());

        // 3. Generate Display List with Separators
        const items: (ChatListItem | { id: string, isTicketHeader: true, topic: string, description: string })[] = [];
        let lastDateLabel: string | null = null;
        let lastSenderId: string | null = null;

        rawItems.forEach(item => {
            const itemDate = dayjs(item.createdAt);
            let dateLabel = itemDate.isToday() ? 'Today' : itemDate.isYesterday() ? 'Yesterday' : itemDate.format('D MMM YYYY');

            if (dateLabel !== lastDateLabel) {
                items.push({ id: `separator-${dateLabel}`, date: dateLabel, isSeparator: true });
                lastDateLabel = dateLabel;
                lastSenderId = null;
            }

            if (item.isTicketHeader) {
                // Ticket header is always distinct, doesn't group visually with bubbles
                items.push(item);
                lastSenderId = 'system-header';
            } else {
                // Regular message
                const isFirstInGroup = item.senderId !== lastSenderId;
                items.push({ ...item, isFirstInGroup });
                lastSenderId = item.senderId;
            }
        });

        return items;
    }, [messages, ticket]);

    return (
        <View style={styles.container}>
            <SupportHeader
                title={`T${ticket?.ticket_id || ''}`}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#202020" />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={chatListItems}
                        keyExtractor={item => item.id}
                        renderItem={({ item }: { item: any }) => {
                            if ('isTicketHeader' in item) {
                                return (
                                    <MessageBubble
                                        message={item}
                                        currentUserId=''
                                        openMessageMenu={() => { }}
                                        allowEdit={false}
                                        customMessage={<>
                                            <Text style={styles.ticketText}>{`Dear ${ticket.user.first_name},\n\nAgent Bot created this ticket on your behalf based on your recent chat conversation.\n`}</Text>
                                            <View style={{ backgroundColor: "#eeeeee", padding: 8, borderRadius: 8 }}>
                                                <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item.topic}</Text>
                                                <Text style={{ fontSize: 13, marginTop: 4 }}>{item.description}</Text>
                                            </View>
                                            <Text style={styles.ticketText}>{`\nOur team will now take over and will get back to you as soon as possible with further instructions or updates.\n\nThank you for your patience.\n\nBest regards,\nSupport Team`}</Text>
                                        </>}
                                    />
                                );
                            }
                            if ('isSeparator' in item) {
                                return <DateSeparator date={item.date} />;
                            }
                            return (
                                <MessageBubble
                                    message={item}
                                    currentUserId={username}
                                    openMessageMenu={() => { }} // No delete/edit in support for now
                                    allowEdit={false}
                                />
                            );
                        }}
                        contentContainerStyle={[styles.messagesContainer, { paddingBottom: ticket && ticket.status === 'open' ? 16 : 48 }]}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                    />
                )}

                {
                    ticket && ticket.status === 'open' && <ChatInput
                        value={inputText}
                        onChange={setInputText}
                        onSend={handleSend}
                        onPickImage={handlePickAndUploadImage}
                        disabled={sending}
                        chatDisabled={false}
                        chat_blocked={false}
                    />
                }
            </KeyboardAvoidingView >
        </View >
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    messagesContainer: { paddingHorizontal: 16, paddingVertical: 10, flexGrow: 1, paddingBottom: 16 },
    ticketHeader: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        alignSelf: 'stretch',
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    ticketText: {
        fontSize: 13
    },
    ticketTopic: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#202020',
    },
    ticketDescription: {
        fontSize: 14,
        color: '#505050',
        lineHeight: 20,
    },
});

export default SupportChat;
