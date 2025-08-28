// app/Chat.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ActivityIndicator, Image, Text, StyleSheet, View, FlatList,
  TextInput, Pressable, KeyboardAvoidingView, Platform, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGlobalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import protectedApi from '@/helpers/axios';
import { useUserStore } from '@/zustand/stores';
import ImageLoader from '@/components/ImageLoader';
import IconButton from '@/components/profile/IconButton';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import { useTokensStore } from '@/zustand/stores';
import { apiUrl, websocketUrl } from '@/constants/env';
import ImageViewing from 'react-native-image-viewing'

dayjs.extend(isToday);
dayjs.extend(isYesterday);

// --- TYPE DEFINITIONS ---
type Message = {
  id: string;
  text: string | null;
  imageUrl?: string | null;
  createdAt: string;
  timestamp: string;
  senderId: string;
  isFirstInGroup?: boolean;
  // For local uploads
  localUri?: string;
  uploadProgress?: number;
  fileName?: string;
  fileSize?: number;
  error?: string;
};

type DateSeparator = {
  id: string;
  date: string;
  isSeparator: true;
};

type ChatListItem = Message | DateSeparator;

// --- COMPONENTS ---

function Header({ first_name, profile_image }: { first_name: string; profile_image: string }) {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.headerContainer, { paddingTop: top + 8 }]}>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {profile_image ? <ImageLoader size={48} uri={profile_image} border={1} /> : null}
        <View style={{ gap: 6, justifyContent: 'center' }}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerName}>{first_name}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <IconButton>
          <Image source={require('@/assets/images/profile/home/menu.png')} style={styles.headerIcon} />
        </IconButton>
      </View>
    </View>
  );
}

function extractImageInfo(path: string): { filename: string; fileType: string; uuid: string } {
  const filename = path.split("/").pop() || "";
  const extension = filename.split(".").pop() || "";
  const fileType = extension.toUpperCase();
  const uuid = filename.replace(`.${extension}`, "");
  return { filename, fileType, uuid };
}

const MessageBubble: React.FC<{ message: Message; currentUserId: string }> = ({ message, currentUserId }) => {
  const isCurrentUser = message.senderId === currentUserId;
  const isFirst = message.isFirstInGroup ?? true;
  const [imageVisible, setImageVisible] = useState(false);

  const renderContent = () => {
    // UPLOADING STATE
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
    // FINAL IMAGE STATE
    if (message.imageUrl) {
      const { filename, fileType } = extractImageInfo(message.imageUrl);
      return <>
        <Pressable onPress={() => setImageVisible(true)}>
          <View style={{ backgroundColor: isCurrentUser ? '#003a88' : "#eeeeee", borderRadius: 8, padding: 8 }}>
            <Text style={{ fontSize: 13, color: isCurrentUser ? 'white' : 'black' }}>{filename}</Text>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
              <Text style={{ fontSize: 11, color: isCurrentUser ? "#73afff" : '#a6a6a6' }}>{fileType}</Text>
            </View>
          </View>
        </Pressable>
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
    // TEXT STATE
    return <Text style={isCurrentUser ? styles.currentUserMessageText : styles.otherUserMessageText}>{message.text}</Text>;
  };

  return (
    <View style={[styles.messageRow, isCurrentUser ? styles.currentUserRow : styles.otherUserRow]}>
      <View style={[
        styles.messageBubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        isFirst && (isCurrentUser ? styles.firstInGroupCurrentUser : styles.firstInGroupOtherUser),
        (message.imageUrl || message.uploadProgress != undefined) && { paddingHorizontal: 8, paddingTop: 8 }
      ]}>
        {renderContent()}
        <Text style={[styles.timestamp, isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp]}>
          {message.timestamp}
        </Text>
      </View>
      {isFirst && <View style={isCurrentUser ? styles.rightArrow : styles.leftArrow} />}
    </View>
  );
};

const DateSeparator: React.FC<{ date: string }> = ({ date }) => (
  <View style={styles.dateSeparatorContainer}>
    <Text style={styles.dateSeparatorText}>{date}</Text>
  </View>
);

function Input({ value, onChange, onSend, onPickImage, disabled }: { value: string; onChange: (t: string) => void; onSend: () => void; onPickImage: () => void; disabled?: boolean }) {
  const canSend = value.trim().length > 0 && !disabled;
  return (
    <View style={commentStyles.commentInputContainer}>
      <TextInput
        onChangeText={onChange}
        value={value}
        multiline
        style={commentStyles.commentInput}
        placeholder="Write here"
        cursorColor="black"
        textAlignVertical="top"
      />
      <Pressable
        onPress={canSend ? onSend : onPickImage}
        disabled={disabled}
        style={({ pressed }) => [
          {
            height: 45, width: 45, justifyContent: 'center', alignItems: 'center',
            backgroundColor: canSend ? '#202020' : '#f5f5f5', borderRadius: 45, marginLeft: 8
          },
          pressed && canSend && { backgroundColor: '#006dff' }
        ]}
      >
        <Image
          style={{ transform: [{ rotate: canSend ? '-90deg' : '0deg' }], height: 20, width: 20 }}
          source={
            canSend
              ? require('@/assets/images/arrows/right-arrow-white.png')
              : require('@/assets/images/messages/clip.png')
          }
        />
      </Pressable>
    </View>
  );
}

// --- MAIN CHAT SCREEN ---
const Chat: React.FC = () => {
  const currentUser = useUserStore();
  const token = useTokensStore((state) => state.access);
  const username = currentUser?.username || '';
  const { id } = useGlobalSearchParams<{ id: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatData, setChatData] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [seenTimestamp, setSeenTimestamp] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<ChatListItem>>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const fmtTime = (iso: string) => dayjs(iso).format('h:mm a');

  // --- DATA FETCHING & WEBSOCKET ---
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await protectedApi.get(`/home/conversations/${id}/`);
        if (!mounted) return;
        setChatData(res.data);

        // Find the other participant to get their initial last_seen time
        const otherParticipant = res.data.participants.find((p: any) => p.username !== username);
        if (otherParticipant) {
          setSeenTimestamp(otherParticipant.last_seen);
        }

        const list: Message[] = res.data.messages.map((m: any) => ({
          id: String(m.id),
          text: m.content,
          imageUrl: m.image_url,
          createdAt: m.created_at,
          timestamp: fmtTime(m.timestamp),
          senderId: m.sender.username,
        }));
        setMessages(list);
      } catch (e: any) {
        console.error(e?.response?.data || e?.message);
      } finally {
        if (mounted) setInitialLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, username]);

  useEffect(() => {
    if (!token) return;
    const ws = new WebSocket(`${websocketUrl}ws/chat/${id}/?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data?.type === 'chat.message') {
          const incoming: Message = {
            id: String(data.id),
            text: data.content,
            imageUrl: data.image_url,
            createdAt: data.created_at,
            timestamp: fmtTime(data.created_at),
            senderId: data.sender?.username,
          };
          setMessages(prev => [...prev, incoming]);
        } else if (data?.type === 'seen.update' && data.username !== username) {
          // If the seen update is from the other user, update the timestamp
          setSeenTimestamp(new Date().toISOString());
        }
      } catch (err) { console.error('WS parse error', err); }
    };
    ws.onerror = (err) => { console.error('WS error', err); };
    return () => { ws.close(); };
  }, [id, token, username]);

  // --- EFFECT TO MARK MESSAGES AS SEEN ---
  useEffect(() => {
    // Only run after the initial messages have loaded and the WebSocket is ready.
    if (!initialLoading && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'message.seen' }));
    }
  }, [initialLoading]); // Dependency on initialLoading ensures it runs once after the fetch.

  // --- MESSAGE & IMAGE SENDING ---
  const handleSendText = () => {
    const text = inputText.trim();
    if (!text || sending || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    try {
      setSending(true);
      wsRef.current.send(JSON.stringify({ action: 'message.create', content: text }));
      setInputText('');
    } catch (e) {
      console.error('WS send failed', e);
    } finally {
      setSending(false);
    }
  };

  const handlePickAndUploadImage = async () => {
    // ... (image picking and uploading logic remains the same)
  };

  // --- MESSAGE GROUPING ---
  const chatListItems = useMemo((): ChatListItem[] => {
    // ... (grouping logic remains the same)
    const items: ChatListItem[] = [];
    let lastDateLabel: string | null = null;
    let lastSenderId: string | null = null;
    messages.forEach(message => {
      const messageDate = dayjs(message.createdAt);
      let dateLabel = messageDate.isToday() ? 'Today' : messageDate.isYesterday() ? 'Yesterday' : messageDate.format('D MMM YYYY');
      if (dateLabel !== lastDateLabel) {
        items.push({ id: `separator-${dateLabel}`, date: dateLabel, isSeparator: true });
        lastDateLabel = dateLabel;
        lastSenderId = null;
      }
      const isFirstInGroup = message.senderId !== lastSenderId;
      items.push({ ...message, isFirstInGroup });
      lastSenderId = message.senderId;
    });
    return items;
  }, [messages]);

  // --- RENDER LOGIC ---
  const renderFooter = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.senderId === username && seenTimestamp && dayjs(seenTimestamp).isAfter(dayjs(lastMessage.createdAt))) {
      return (
        <View style={styles.seenContainer}>
          <Text style={styles.seenText}>Seen</Text>
        </View>
      );
    }
    return null;
  };

  if (initialLoading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#202020" />;
  }
  const me = username;
  const other = chatData?.participants?.find((p: any) => p.username !== me);

  return (
    <View style={styles.container}>
      <Header first_name={other?.first_name || other?.username || 'User'} profile_image={other?.profile_image} />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={chatListItems}
          renderItem={({ item }) => 'isSeparator' in item ? <DateSeparator date={item.date} /> : <MessageBubble message={item} currentUserId={me} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={renderFooter}
        />
        <Input value={inputText} onChange={setInputText} onSend={handleSendText} onPickImage={handlePickAndUploadImage} disabled={sending} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Chat;

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  headerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderColor: "#f5f5f5" },
  headerName: { fontSize: 18, fontWeight: "600" },
  headerIcon: { width: 24, height: 24 },
  messagesContainer: { paddingHorizontal: 16, paddingVertical: 10, flexGrow: 1 },
  messageRow: { marginVertical: 4, width: '80%' },
  currentUserRow: { alignSelf: 'flex-end' },
  otherUserRow: { alignSelf: 'flex-start' },
  messageBubble: { paddingVertical: 16, paddingHorizontal: 16, borderRadius: 10 },
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
  dateSeparatorContainer: { alignItems: 'center', marginVertical: 12 },
  dateSeparatorText: { fontSize: 11, color: '#a6a6a6' },
  chatImage: { width: Dimensions.get('window').width * 0.6, height: 200, borderRadius: 8 },
  uploadFileName: { fontSize: 14, color: 'white', fontWeight: 'bold' },
  uploadFileInfo: { fontSize: 12, color: '#73afff', marginTop: 4 },
  progressBarContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#73afff' },
  // Styles for the "Seen" indicator
  seenContainer: {
    alignSelf: 'flex-end',
    marginRight: 8,
    marginTop: 4,
  },
  seenText: {
    fontSize: 11,
    color: '#a6a6a6',
  },
});

const commentStyles = StyleSheet.create({
  commentInput: { fontSize: 13, flex: 1, color: 'black', maxHeight: 100, paddingVertical: 10 },
  commentInputContainer: { width: '100%', borderTopWidth: 1, borderTopColor: '#eeeeee', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'flex-start' },
});
