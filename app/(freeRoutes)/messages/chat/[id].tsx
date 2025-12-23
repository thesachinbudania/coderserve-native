// app/Chat.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ActivityIndicator, Text, StyleSheet, View, FlatList,
  KeyboardAvoidingView, Platform, InteractionManager
} from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import protectedApi from '@/helpers/axios';
import { useUserStore, useTokensStore } from '@/zustand/stores';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import { apiUrl, websocketUrl } from '@/constants/env';
import BottomDrawer from '@/components/BottomDrawer';
import BlueButton from '@/components/buttons/BlueButton';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import BottomSheet from '@/components/messsages/BottomSheet';
import { MenuButton } from '@/app/(protected)/jobs/index';
import UnorderedList from '@/components/general/UnorderedList';

// New Component Imports
import ChatHeader from '@/components/messages/chat/ChatHeader';
import MessageBubble from '@/components/messages/chat/MessageBubble';
import ChatInput from '@/components/messages/chat/ChatInput';
import DateSeparator from '@/components/messages/chat/DateSeparator';
import MenuOption from '@/components/messages/chat/MenuOption';
import { Message, ChatListItem } from '@/components/messages/chat/types';
import errorHandler from '@/helpers/general/errorHandler';

dayjs.extend(isToday);
dayjs.extend(isYesterday);

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

  // Reliable scroll-to-bottom helper: defer until after interactions/layout settle
  const scrollToBottom = (animated = true) => {
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        try {
          flatListRef.current?.scrollToEnd({ animated });
        } catch (e) {
          // ignore
        }
      });
    });
  };


  const messageMenuRef = useRef<any>(null);
  const [currentMessageMenuId, setCurrentMessageMenuId] = useState<string | null>(null);
  const [currentMessageMenuTime, setCurrentMessageMenuTime] = useState<number | null>(null);
  // Track which options and height are available for the current message
  const [currentMenuOptions, setCurrentMenuOptions] = useState<{ edit: boolean, delete: boolean }>({ edit: false, delete: false });
  const [currentMenuHeight, setCurrentMenuHeight] = useState(120);

  const [editMode, setEditMode] = useState(false);
  const [sendMessageEnabled, setSendMessageEnabled] = useState(true);
  const deleteMessageDrawerRef = useRef<any>(null);
  const menuRef = useRef<any>(null);
  const blockDrawerRef = useRef<any>(null);
  const unblockDrawerRef = useRef<any>(null);
  const deleteChatRef = useRef<any>(null);
  const router = useRouter();

  async function fetchData(mounted: boolean) {
    if (id === undefined) return;
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
        createdAt: m.timestamp,
        timestamp: fmtTime(m.timestamp),
        senderId: m.sender.username,
        edited: m.edited || false,
      }));
      setMessages(list);
    } catch (e: any) {
      errorHandler(e);
      router.push('/(freeRoutes)/error');
    } finally {
      if (mounted) setInitialLoading(false);
    }
  }

  React.useEffect(() => {
    if (editMode) {
      setInputText(messages.find(m => m.id === currentMessageMenuId)?.text || '');
    }
  }, [editMode]);

  React.useEffect(() => {
    if (editMode) {
      inputText.length < 0 ? setSendMessageEnabled(false) : inputText === messages.find(m => m.id === currentMessageMenuId)?.text ? setSendMessageEnabled(false) : setSendMessageEnabled(true);
    }
  }, [inputText]);

  const fmtTime = (iso: string) => dayjs(iso).format('h:mm a');

  // --- DATA FETCHING & WEBSOCKET ---
  useEffect(() => {
    let mounted = true;
    fetchData(mounted);
    return () => { mounted = false; };
  }, [id, username]);

  useEffect(() => {
    if (!token || id === undefined) return;
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
            edited: data.edited || false,
          };
          setMessages(prev => [...prev, incoming]);
          // ensure visible after new incoming message
          scrollToBottom(true);
          setChatData((prev: any) => {
            if (!prev) return prev;
            const updatedMessages = [...prev.messages, data];
            return { ...prev, messages: updatedMessages };
          }
          );
        }
        else if (data?.type === 'chat.message.edit') {
          // --- handle message edit ---
          setMessages(prev => prev.map(m =>
            m.id === String(data.id) ? { ...m, text: data.content, edited: data.edited } : m
          ));

        }
        else if (data?.type === 'seen.update' && data.username !== username) {
          // If the seen update is from the other user, update the timestamp
          setSeenTimestamp(new Date().toISOString());
        }
        else if (data?.type === 'chat.message.delete') {
          // --- handle message delete ---
          setMessages(prev => prev.filter(m => m.id !== String(data.id)));
        }
        else if (data?.type === 'error') {
          if (data.detail === 'This conversation is locked.') {
            setChatData((prev: any) => prev ? { ...prev, messaging_disabled: true } : prev);
            setInputText('');
            setMessages((prev) => prev.filter(m => !m.uploadProgress)); // remove any uploading messages
            setSendMessageEnabled(false);
          }
        }
      } catch (err) { console.error('WS parse error', err); }
    };
    ws.onerror = (err: any) => {
      errorHandler(err);
    };
    return () => { ws.close(); };
  }, [id, token, username]);

  // Scroll to bottom once initial load completes or whenever messages length changes
  useEffect(() => {
    if (!initialLoading && messages.length > 0) {
      // on initial load we don't animate, afterwards we animate
      scrollToBottom(false);
    }
  }, [initialLoading, messages.length]);

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
      if (editMode && currentMessageMenuId) {
        // Ensure edit window (15 minutes) hasn't expired
        const msgToEdit = messages.find(m => m.id === currentMessageMenuId) || chatData?.messages?.find((m: any) => String(m.id) === String(currentMessageMenuId));
        const msgCreatedAt = msgToEdit ? (msgToEdit.createdAt || msgToEdit.created_at) : null;
        if (msgCreatedAt) {
          const elapsed = dayjs().valueOf() - dayjs(msgCreatedAt).valueOf();
          if (elapsed > 15 * 60 * 1000) {
            alert('Edit window has expired for this message.');
            setEditMode(false);
            setCurrentMessageMenuId(null);
            return;
          }
        }
        // --- send edit request ---
        wsRef.current.send(JSON.stringify({
          action: 'message.edit',
          id: currentMessageMenuId,
          content: text
        }));

        // update local state optimistically
        setMessages(prev => prev.map(m =>
          m.id === currentMessageMenuId ? { ...m, text, edited: true } : m
        ));

        setEditMode(false);
        setCurrentMessageMenuId(null);
      } else {
        // --- send new message ---
        wsRef.current.send(JSON.stringify({
          action: 'message.create',
          content: text
        }));
      }
      setInputText('');
      // ensure the sent message will be visible (WS will append the real message)
      scrollToBottom(true);
    } catch (e: any) {
      errorHandler(e, false);
      alert('Failed to send message.');
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
    };
    setMessages(prev => [...prev, optimisticMessage]);
    // make sure optimistic message is visible
    scrollToBottom(true);

    const formData = new FormData();
    formData.append('image', {
      uri: asset.uri,
      name: asset.fileName || 'image.jpg',
      type: asset.mimeType || 'image/jpeg',
    } as any);

    try {
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

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          action: 'message.create',
          image_url: imageUrl
        }));
      }
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      // after removing temp id we still want the real message (arriving via WS) to show; ensure scroll
      scrollToBottom(true);

    } catch (error: any) {
      errorHandler(error, false);
      alert('Failed to upload image.');
      console.error('Image upload failed:', error);
      setMessages(prev => prev.map(msg =>
        msg.id === tempId ? { ...msg, error: 'Upload failed' } : msg
      ));
    }
  };


  const deleteMessage = (ws: WebSocket, messageId: string) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected");
      return;
    }
    ws.send(JSON.stringify({
      action: "message.delete",
      id: messageId,
    }));
  };

  // --- MESSAGE GROUPING ---
  const chatListItems = useMemo((): ChatListItem[] => {
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
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={'#202020'} />;
  }
  const me = username;
  const other = chatData?.participants?.find((p: any) => p.username !== me);

  function manageBlock() {
    protectedApi.put(`/accounts/block_user/${other.username}/`).then(() => {
      fetchData(true);
    }).catch((e: any) => {
      errorHandler(e);
      console.error(e);
    });
  }


  const openMessageMenu = (id: string) => {
    setCurrentMessageMenuId(id);
    const message = chatData.messages.find((m: any) => {
      return m.id == id;
    });
    // Prefer the canonical created_at ISO timestamp for calculations
    const createdAt = message?.created_at || message?.createdAt || message?.timestamp || null;
    const now = dayjs().valueOf();
    const messageTimeMs = createdAt ? dayjs(createdAt).valueOf() : null;
    const elapsed = messageTimeMs ? now - messageTimeMs : 0;
    // Option logic: delete allowed within 30min, edit within 15min
    const canDelete = elapsed <= 30 * 60 * 1000;
    const canEdit = elapsed <= 15 * 60 * 1000;
    if (!canDelete) {
      // If more than 30 minutes have passed, do not open the menu
      return;
    }
    const opts = { edit: canEdit, delete: canDelete };
    setCurrentMenuOptions(opts);
    setCurrentMenuHeight(opts.edit && opts.delete ? 216 : 120);
    setCurrentMessageMenuTime(messageTimeMs);
    // Wait for state to update, then open the drawer (ensures correct height)
    setTimeout(() => {
      messageMenuRef.current?.open();
    }, 0);
  };

  return (
    <View style={styles.container}>
      <ChatHeader
        first_name={other?.first_name || other?.username || 'User'}
        profile_image={other?.profile_image}
        menuRef={menuRef}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={chatListItems}
            renderItem={({ item }) => 'isSeparator' in item ? <DateSeparator date={item.date} /> : <MessageBubble openMessageMenu={openMessageMenu} message={item} currentUserId={me} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() => scrollToBottom(false)}
            onLayout={() => scrollToBottom(false)}
            ListFooterComponent={renderFooter}
          />
          <ChatInput
            value={inputText}
            onChange={setInputText}
            onSend={handleSendText}
            // chatDisabled should only reflect server-side conversation lock
            chatDisabled={chatData.messaging_disabled}
            onPickImage={handlePickAndUploadImage}
            // disable send when sending or when send is not enabled (e.g. editing with unchanged text)
            disabled={sending || !sendMessageEnabled}
            otherUserName={other.first_name + ' ' + other.last_name}
            chat_blocked={chatData?.chat_blocked}
            blocked={other?.is_blocked}
          />
        </View>
      </KeyboardAvoidingView>
      <BottomDrawer
        sheetRef={messageMenuRef}
        height={currentMenuHeight}
        draggableIconHeight={0}
      >
        <View style={{ paddingHorizontal: 16, gap: 16 }}>
          {currentMenuOptions.edit && (
            <MenuOption
              title="Edit Message"
              subTitle="Make changes to your message content."
              messageTime={currentMessageMenuTime}
              onPress={() => {
                setEditMode(true);
                messageMenuRef.current?.close();
              }}
            />
          )}
          {currentMenuOptions.delete && (
            <MenuOption
              title="Delete Message"
              subTitle="Permanently remove this message."
              pressTimer={30}
              messageTime={currentMessageMenuTime}
              onPress={() => {
                messageMenuRef.current?.close();
                setTimeout(() => {
                  deleteMessageDrawerRef.current?.open();
                }, 300)
              }}
            />
          )}
        </View>
      </BottomDrawer>
      <BottomDrawer sheetRef={deleteMessageDrawerRef} draggableIconHeight={0}>
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Delete Message</Text>
          <Text style={{ fontSize: 13, color: "#737373", textAlign: 'center', marginTop: 8 }}>This action cannot be undone. Once deleted, your message will be permanently removed.</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 32 }}>
            <View style={{ flex: 1 / 2 }}>
              <GreyBgButton
                title="Cancel"
                onPress={() => {
                  setCurrentMessageMenuId(null);
                  setEditMode(false);
                  deleteMessageDrawerRef.current?.close();
                }}
              />
            </View>
            <View style={{ flex: 1 / 2 }}>
              <BlueButton
                title="Delete"
                onPress={() => {
                  if (wsRef.current && currentMessageMenuId) {
                    // Verify delete window (30 minutes) hasn't expired
                    const msgToDelete = messages.find(m => m.id === currentMessageMenuId) || chatData?.messages?.find((m: any) => String(m.id) === String(currentMessageMenuId));
                    const msgCreatedAt = msgToDelete ? (msgToDelete.createdAt || msgToDelete.created_at) : null;
                    if (msgCreatedAt) {
                      const elapsed = dayjs().valueOf() - dayjs(msgCreatedAt).valueOf();
                      if (elapsed > 30 * 60 * 1000) {
                        alert('Delete window has expired for this message.');
                        deleteMessageDrawerRef.current?.close();
                        setCurrentMessageMenuId(null);
                        return;
                      }
                    }
                    deleteMessage(wsRef.current, currentMessageMenuId);
                    setMessages(prev => prev.filter(m => m.id !== currentMessageMenuId));
                    setCurrentMessageMenuId(null);
                    setEditMode(false);
                    deleteMessageDrawerRef.current?.close();
                  }
                }}
              />
            </View>
          </View>
        </View>
      </BottomDrawer>
      <BottomSheet
        menuRef={menuRef}
        height={392}>
        <View style={styles.menuContainer}>
          <MenuButton
            onPress={() => {
              menuRef?.current.close();
              router.push(`/(freeRoutes)/profile/userProfile/${other?.username}`);
            }}
          >
            <Text style={styles.menuButtonHeading}>View Profile</Text>
            <Text style={styles.menuButtonText}>
              Visit the public profile of the chat recipient.
            </Text>
          </MenuButton>
          <MenuButton
            onPress={() => {
              menuRef?.current.close();
              setTimeout(() => {
                if (other?.is_blocked) {
                  unblockDrawerRef.current?.open();
                  return;
                }
                blockDrawerRef.current?.open();
              }, 300)
            }}
          >
            <Text style={styles.menuButtonHeading}>{other?.is_blocked ? 'Unblock' : 'Block'}</Text>
            <Text style={styles.menuButtonText}>
              {
                other?.is_blocked ? 'Allow this user to interact with you again.' : 'Restrict this user from interacting with you.'
              }
            </Text>
          </MenuButton>
          <MenuButton
            onPress={() => {
              menuRef?.current.close();
              setTimeout(() => {
                deleteChatRef?.current.open();
              }, 300)
            }}
          >
            <Text style={styles.menuButtonHeading}>Delete Chat</Text>
            <Text style={styles.menuButtonText}>
              Permanently remove this chat.
            </Text>
          </MenuButton>
          <MenuButton >
            <Text
              style={[styles.menuButtonHeading]}
            >
              Report Chat
            </Text>
            <Text style={[styles.menuButtonText]}>
              Flag this chat to our support team for review.
            </Text>
          </MenuButton>
        </View>
      </BottomSheet>
      <BottomDrawer
        draggableIconHeight={0}
        sheetRef={deleteChatRef}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 16 }}>Delete Chat</Text>
          <Text style={{ textAlign: 'center', fontSize: 13, color: "#737373", marginBottom: 24 }}>This action cannot be undone. Once deleted, all your messages in this chat will be permanently removed.</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 / 2 }}>
              <GreyBgButton
                title='Cancel'
                onPress={() => deleteChatRef?.current.close()}
              />
            </View>
            <View style={{ flex: 1 / 2 }}>
              <BlueButton
                title={'Delete'}
                dangerButton
                onPress={
                  () => {
                    protectedApi.delete(`/home/delete_conversation/${id}/`).then(() => {
                      deleteChatRef?.current.close();
                      router.back();
                    }).catch((e: any) => {
                      errorHandler(e);
                      console.error(e);
                    })
                  }
                }
              />
            </View>
          </View>
        </View>
      </BottomDrawer>
      <BottomSheet
        menuRef={unblockDrawerRef}
        height={168}>
        <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 16 }}>Do you want to unblock this user?</Text>
        <Text style={{ textAlign: 'center', fontSize: 13, color: "#737373", marginBottom: 24 }}>Once unblocked, this user will be able to view your profile and interact with yours posts again.</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 1 / 2 }}>
            <GreyBgButton
              title='Cancel'
              onPress={() => unblockDrawerRef?.current.close()}
            />
          </View>
          <View style={{ flex: 1 / 2 }}>
            <BlueButton
              title={'Unblock'}
              onPress={() => {
                unblockDrawerRef?.current.close();
                manageBlock();
              }}
            />
          </View>
        </View>
      </BottomSheet>
      <BottomDrawer sheetRef={blockDrawerRef} height={652}>
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 8 }}>What Happens When You Block Someone?</Text>
          <Text style={{ fontSize: 13, color: "#737373", textAlign: 'left', marginTop: 8, marginBottom: 16 }}>Blocking gives you full control over your experience. When you block a user:</Text>
          <UnorderedList
            items={["You won't see their profile, posts, followers, or following list - and they can't see yours.", "If you were following each other, both follow connections are removed."]}
            gap={16}
          />
          <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 24, marginBottom: 8 }}>No Interactions Allowed</Text>
          <UnorderedList items={[
            "Their posts will no longer appear in your feed or search, and yours will be hidden from them.",
            'Messaging is disabled, and any existing chat will be closed on your side with the message: "You blocked this user."',
            "The blocked user won't be notified. However, they can still send up to 5 final replies to your last message - but you won't see them unless you unblock.",
            'After those 5 replies, the conversation will be permanently locked for them with the message: "Chat Closed". Your profile picture will be hidden, and your name will appear as "Unknown User" in the chat.'
          ]}
            gap={16}
          />
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
            <View style={{ flex: 1 / 2 }}>
              <GreyBgButton
                title="Cancel"
                onPress={() => {
                  blockDrawerRef.current?.close();
                }}
              />
            </View>
            <View style={{ flex: 1 / 2 }}>
              <BlueButton
                title="Block"
                onPress={() => {
                  blockDrawerRef.current?.close();
                  manageBlock()
                }}
              />
            </View>
          </View>
        </View>
      </BottomDrawer>
    </View>
  );
};

export default Chat;

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  messagesContainer: { paddingHorizontal: 16, paddingVertical: 10, flexGrow: 1 },
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
  menuContainer: {
    gap: 16,
  },
  menuButtonHeading: {
    fontSize: 15,
    fontWeight: "bold",
  },
  menuButtonText: {
    fontSize: 12,
    color: "#737373",
    marginTop: 8,
  },
});