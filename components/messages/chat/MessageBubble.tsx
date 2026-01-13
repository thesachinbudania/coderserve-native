/**
 * MessageBubble Component
 * 
 * Displays a single message in the chat conversation.
 * Handles three types of content:
 * 1. Text messages
 * 2. Image messages (with image viewer on tap)
 * 3. Uploading images (with progress indicator)
 * 
 * Features:
 * - Different styling for current user vs other user messages
 * - Chat bubble tails for the first message in a group
 * - Long-press to open message menu (edit/delete) for current user's messages
 * - Visual feedback on long-press
 * - Shows "Edited" label for edited messages
 * - Timestamp display
 * 
 * @component
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import ImageViewing from 'react-native-image-viewing';
import { apiUrl } from '@/constants/env';
import { Message } from './types';
import { extractImageInfo } from './utils';

/**
 * Props for the MessageBubble component
 */
interface MessageBubbleProps {
    /** The message object containing all message data */
    message: Message;
    /** Username of the current user (to determine if this is their message) */
    currentUserId: string;
    /** Callback to open the message options menu (edit/delete) */
    openMessageMenu: (id: string) => void;
    /** Whether to allow editing the message */
    maxWidth?: boolean;
    /** Whether to allow editing the message */
    allowEdit?: boolean;
    /** Custom message content to display instead of default message */
    customMessage?: React.ReactNode;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUserId, openMessageMenu, maxWidth = false, allowEdit = true, customMessage }) => {
    // Determine if this message belongs to the current user
    const isCurrentUser = message.senderId === currentUserId;

    // Check if this is the first message in a group (for tail styling)
    const isFirst = message.isFirstInGroup ?? true;

    // State for full-screen image viewer
    const [imageVisible, setImageVisible] = useState(false);

    // Calculate if message is still editable (within time window)
    const now = dayjs().valueOf();
    const elapsed = now - (dayjs(message.createdAt).valueOf());
    const remaining = 30000 * 60 - elapsed; // 30 minutes for delete, 15 for edit
    const editable = remaining > 15000 && allowEdit;

    /**
     * Renders the message content based on its type:
     * - Uploading state: Shows progress indicator
     * - Image message: Shows image file info with tap-to-view
     * - Text message: Shows the text content
     */
    const renderContent = () => {
        // UPLOADING STATE - Show upload progress for images being sent
        if (message.uploadProgress !== undefined) {
            const sizeInMB = message.fileSize ? (message.fileSize / (1024 * 1024)).toFixed(2) : 0;
            const fileType = message.fileName?.split('.').pop()?.toUpperCase();
            return (
                <View style={{ backgroundColor: '#003a88', borderRadius: 8, padding: 8 }}>
                    <Text style={{ fontSize: 13, color: 'white' }}>{message.fileName}</Text>
                    <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                        <Text style={{ fontSize: 11, color: "#73afff" }}>{sizeInMB}</Text>
                        <Text style={{ fontSize: 11, color: "#73afff" }}>{fileType}</Text>
                        <Text style={{ fontSize: 11, color: "#73afff" }}>Uploading {Math.round(message.uploadProgress * 100)}%</Text>
                    </View>
                </View>
            );
        }

        // FINAL IMAGE STATE - Show uploaded image with viewer
        if (message.imageUrl) {
            const { filename, fileType } = extractImageInfo(message.imageUrl);
            return <>
                {/* Pressable file card to open image viewer */}
                <Pressable onPress={() => setImageVisible(true)}>
                    <View style={{ backgroundColor: isCurrentUser ? '#003a88' : "#eeeeee", borderRadius: 8, padding: 8 }}>
                        <Text style={{ fontSize: 13, color: isCurrentUser ? 'white' : 'black' }}>{filename}</Text>
                        <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                            <Text style={{ fontSize: 11, color: isCurrentUser ? "#73afff" : '#a6a6a6' }}>{fileType}</Text>
                        </View>
                    </View>
                </Pressable>
                {/* Full-screen image viewer modal */}
                <ImageViewing
                    images={[{ uri: apiUrl.slice(0, apiUrl.length) + message.imageUrl }]}
                    visible={imageVisible}
                    onRequestClose={() => setImageVisible(false)}
                    backgroundColor="black"
                    imageIndex={0}
                    animationType="fade"
                />
            </>
        }

        // TEXT STATE - Default text message display
        return <Text style={isCurrentUser ? styles.currentUserMessageText : styles.otherUserMessageText}>{message.text}</Text>;
    };


    return (
        /* Long-press opens menu for current user's messages, applies positioning based on sender */
        <Pressable onLongPress={() => openMessageMenu(message.id)} style={({ pressed }) => [styles.messageRow, isCurrentUser ? styles.currentUserRow : styles.otherUserRow]}>
            {
                ({ pressed }) => (
                    <>
                        {/* Message bubble container with dynamic styling */}
                        <View style={[
                            styles.messageBubble,
                            // Apply different colors for current user vs other user
                            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
                            // Add tail (corner cut) to first message in group
                            isFirst && (isCurrentUser ? styles.firstInGroupCurrentUser : styles.firstInGroupOtherUser),
                            // Adjust padding for image messages
                            (message.imageUrl || message.uploadProgress != undefined) && { paddingHorizontal: 8, paddingTop: 8 },
                            // Visual feedback when long-pressing editable messages
                            pressed && isCurrentUser && editable && { backgroundColor: "#202020" },
                            maxWidth && { minWidth: '80%' }
                        ]}>
                            {/* Render the message content (text, image, or upload progress) */}
                            {customMessage || renderContent()}

                            {/* Timestamp with optional "Edited" label */}
                            <Text style={[styles.timestamp, isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp, pressed && isCurrentUser && editable && { color: "#737373" }]}>
                                {message.edited && 'Edited'}   {message.timestamp}
                            </Text>
                        </View>

                        {/* Speech bubble tail for first message in group */}
                        {isFirst && <View style={[isCurrentUser ? styles.rightArrow : styles.leftArrow, pressed && isCurrentUser && editable && { borderTopColor: "#202020" }]} />}
                    </>
                )
            }

        </Pressable>
    );
};

export default MessageBubble;

const styles = StyleSheet.create({
    messageRow: { marginVertical: 4 },
    currentUserRow: { alignSelf: 'flex-end' },
    otherUserRow: { alignSelf: 'flex-start' },
    messageBubble: { paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, maxWidth: '85%' },
    currentUserBubble: { backgroundColor: '#004AAD' },
    otherUserBubble: { backgroundColor: '#F5F5F5' },
    firstInGroupCurrentUser: { borderTopRightRadius: 0 },
    firstInGroupOtherUser: { borderTopLeftRadius: 0 },
    rightArrow: { position: 'absolute', width: 0, height: 0, backgroundColor: "transparent", borderStyle: "solid", borderRightWidth: 16, borderTopWidth: 16, borderRightColor: "transparent", borderTopColor: "#004AAD", right: -8 },
    leftArrow: { position: 'absolute', width: 0, height: 0, backgroundColor: "transparent", borderStyle: "solid", borderLeftWidth: 16, borderTopWidth: 16, borderLeftColor: "transparent", borderTopColor: "#F5F5F5", left: -8 },
    currentUserMessageText: { fontSize: 13, color: 'white' },
    otherUserMessageText: { fontSize: 13, color: 'black' },
    timestamp: { fontSize: 11, alignSelf: 'flex-end', marginTop: 4 },
    currentUserTimestamp: { color: '#73afff' },
    otherUserTimestamp: { color: '#a6a6a6' },
    uploadFileName: { fontSize: 14, color: 'white', fontWeight: 'bold' },
    uploadFileInfo: { fontSize: 12, color: '#73afff', marginTop: 4 },
    progressBarContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginTop: 8, overflow: 'hidden' },
    progressBar: { height: '100%', backgroundColor: '#73afff' },
});
