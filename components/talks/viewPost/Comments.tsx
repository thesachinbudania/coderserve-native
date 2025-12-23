import React from 'react';
import { View, Text, Image, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Dimensions, StyleSheet, Keyboard, Animated } from 'react-native';
import { useUserStore } from '@/zustand/stores';
import protectedApi from '@/helpers/axios';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageLoader from '@/components/ImageLoader';
import BlueButton from '@/components/buttons/BlueButton';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import BottomDrawer from '@/components/BottomDrawer';
import SmallTextButton from '@/components/buttons/SmallTextButton';
import errorHandler from '@/helpers/general/errorHandler';

const width = Dimensions.get('window').width;

// --- Utility: formats comment time for display ---
const commentTimeCalculator = (created_at: string) => {
    const now = new Date();
    const commentDate = new Date(created_at);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `Just now`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} min ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hour ago' : 'hours ago'}`;
    } else if (diffInSeconds < 2592000) { // 30 days
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? 'day ago' : 'days ago'}`;
    }
    else if (diffInSeconds < 31536000) { // 1 year
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} ${months === 1 ? 'month ago' : 'months ago'}`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} ${years === 1 ? 'year ago' : 'years ago'}`;
    }
}

// --- Comment component: displays a single comment and its replies ---
const Comment = ({
    first_name,
    can_reply,
    username,
    id,
    replies,
    created_at,
    reply = false,
    comment,
    profile_image,
    setReplyingTo,
    setReplyingId,
    onLongPress
}: {
    can_reply?: boolean,
    first_name: string,
    username: string,
    created_at: any,
    reply?: boolean,
    replies: any[],
    id: string,
    comment: string,
    profile_image: string,
    setReplyingId: (replyingId: string | null) => void,
    setReplyingTo: (replyingTo: string | null) => void,
    onLongPress?: (commentData: any, position: any, reply: boolean) => void
}) => {
    const [showReplies, setShowReplies] = React.useState(false);
    const commentRef = React.useRef<View>(null);
    replies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const { username: currentUsername } = useUserStore();

    const handleLongPress = () => {
        if (currentUsername === username && onLongPress && commentRef.current) {
            commentRef.current.measure((x, y, width, height, pageX, pageY) => {
                onLongPress({
                    id,
                    first_name,
                    username,
                    comment,
                    profile_image,
                    created_at,
                    reply
                }, {
                    x: pageX,
                    y: pageY,
                    width,
                    height
                }, reply);
            });
        }
    };

    return (
        <View ref={commentRef}>
            <Pressable
                style={({ pressed }) => [{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginLeft: reply ? -56 : 0, paddingLeft: reply ? 56 : 16 }, pressed && currentUsername === username && { backgroundColor: '#f5f5f5' }, { marginVertical: -8, paddingVertical: 8 }]}
                onLongPress={handleLongPress}
            >
                <View>
                    <ImageLoader size={48} uri={profile_image} />
                </View>
                <View style={{ width: reply ? width - 144 : width - 88 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13 }}>{first_name}</Text>
                    <Text style={{ fontSize: 13, marginTop: 4, color: '#737373' }}>{comment}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                        {
                            !reply && can_reply && (
                                <SmallTextButton
                                    title='Reply'
                                    style={{ fontSize: 11, color: '#a6a6a6' }}
                                    onPress={() => {
                                        setReplyingId(id);
                                        setReplyingTo(username);
                                    }}
                                />
                            )
                        }
                        <Text style={{ fontSize: 11, color: '#a6a6a6' }}>{commentTimeCalculator(created_at)}</Text>
                    </View>
                    {
                        !showReplies && replies.length > 0 && (
                            <SmallTextButton
                                title={`View ${replies.length} more ` + (replies.length === 1 ? 'reply' : 'replies')}
                                style={{ fontSize: 11, color: '#a6a6a6', marginTop: 32 }}
                                onPress={() => setShowReplies(!showReplies)}
                            />
                        )
                    }

                </View>
            </Pressable>
            {replies.length > 0 && showReplies && (
                <View style={{ marginLeft: 56, marginTop: 32, gap: 16 }}>
                    {
                        replies.map((reply) => (
                            <Comment
                                key={reply.id}
                                reply
                                username={reply.author.username}
                                first_name={reply.author.first_name}
                                id={reply.id}
                                comment={reply.content}
                                profile_image={reply.author.profile_image}
                                setReplyingTo={setReplyingTo}
                                setReplyingId={setReplyingId}
                                replies={[]}
                                created_at={reply.created_at}
                                onLongPress={onLongPress}
                            />
                        ))
                    }
                </View>
            )}
        </View>
    )
}

interface CommentsProps {
    id: string;
    commentsCount: number;
    last_comment: any;
    onCommentAdded: () => void;
}

// --- Comments section: handles comment list, posting, and reply logic ---
export const Comments = ({ id, commentsCount, last_comment, onCommentAdded }: CommentsProps) => {
    const menuRef = React.useRef<any>(null);
    const [comment, setComment] = React.useState('');
    const [comments, setComments] = React.useState<any[]>([]);
    const commentInputRef = React.useRef<TextInput>(null);
    const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
    const [replyingId, setReplyingId] = React.useState<string | null>(null);
    const [canComment, setCanComment] = React.useState<boolean>(false);
    const router = useRouter();
    const [commentContainerHeight, setCommentContainerHeight] = React.useState(0);
    const [selectedComment, setSelectedComment] = React.useState<{ data: any, position: any, reply: boolean } | null>(null);
    const [isDeletingComment, setIsDeletingComment] = React.useState(false);
    const containerRef = React.useRef<View>(null);

    const fetchComments = async () => {
        protectedApi.get('/talks/posts/' + id + '/comments/').then(res => {
            setComments(res.data.comments);
            setCanComment(res.data.can_comment);
        }).catch(
            (err: any) => {
                errorHandler(err);
                // router.push('/(freeRoutes)/error') // errorHandler handles redirection
            }
        );
    }

    React.useEffect(() => {
        fetchComments();
    }, [])
    const postComment = () => {
        if (comment.trim().length === 0) {
            return;
        }
        const url = replyingId ? `/talks/posts/${id}/comments/${replyingId}/reply/` : `/talks/posts/${id}/comments/`;
        protectedApi.post(url, {
            content: comment,
        }).then((res) => {
            setComments(res.data);
            commentInputRef.current?.clear();
            setComment('');
            setReplyingId(null);
            setReplyingTo(null);
            onCommentAdded();
        }).catch((err: any) => {
            errorHandler(err);
            console.log(err.response.data)
        });
    }

    const handleCommentLongPress = (commentData: any, position: any, reply: boolean) => {
        console.log(reply, 'this is reply')
        if (containerRef.current) {
            containerRef.current.measure((cx, cy, cwidth, cheight, cpageX, cpageY) => {
                // Calculate position relative to container
                const relativeY = position.y - cpageY;

                // Estimate menu height (comment height + menu height + margins)
                // Menu is approximately 160px (text + buttons + padding)
                const estimatedMenuHeight = position.height + 160 + 32; // comment height + menu + margins
                const spaceBelow = cheight - relativeY - position.height;
                const showMenuAbove = spaceBelow < estimatedMenuHeight;

                setSelectedComment({
                    data: commentData,
                    position: {
                        ...position,
                        relativeY,
                        showMenuAbove
                    },
                    reply
                });
            });
        } else {
            setSelectedComment({ data: commentData, position, reply });
        }
    };

    const handleDeleteComment = async () => {
        if (!selectedComment) return;

        setIsDeletingComment(true);
        try {
            await protectedApi.delete(`/talks/comments/${selectedComment.data.id}/delete/`);
            // Remove comment from local state
            setComments(prevComments => prevComments.filter(c => c.id !== selectedComment.data.id));
            // Close the popup
            setSelectedComment(null);
            // Refetch comments to ensure consistency
            onCommentAdded();
        } catch (err: any) {
            errorHandler(err);
            console.log('Error deleting comment:', err);
        } finally {
            setIsDeletingComment(false);
        }
    };

    const { bottom } = useSafeAreaInsets();
    // Track keyboard visibility state
    const [keyboardOpen, setKeyboardOpen] = React.useState(false);

    // Subscribe to keyboard show/hide events
    React.useEffect(() => {
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
    const animatedMargin = React.useRef(new Animated.Value(bottom)).current;

    // Animate margin when keyboard state changes
    React.useEffect(() => {
        Animated.timing(animatedMargin, {
            toValue: keyboardOpen ? 0 : bottom, // Remove margin when keyboard is open
            duration: 180,
            useNativeDriver: false, // Layout animations require native driver to be false
        }).start();
    }, [keyboardOpen, bottom]);


    return (
        <View style={commentStyles.container}>
            <Text style={commentStyles.heading}>Comments <Text style={{ fontWeight: 'bold', color: '#737373' }}>{commentsCount}</Text></Text>
            {
                commentsCount > 0 && last_comment ? (
                    <Pressable
                        style={({ pressed }) => [{ flexDirection: 'row', gap: 4, paddingVertical: 8, backgroundColor: 'white', alignItems: 'center', marginHorizontal: -16, paddingHorizontal: 16, marginVertical: -8 }, pressed && { backgroundColor: '#f7f7f7' }]}
                        onPress={() => menuRef.current?.open()}
                    >
                        <ImageLoader size={48} uri={last_comment.author.profile_image} />
                        <Text style={{ width: width - 88, fontSize: 13, color: '#737373' }}>{last_comment.content}</Text>
                    </Pressable>
                ) : (
                    <Pressable
                        style={({ pressed }) => [commentStyles.inputContainer, pressed && { borderColor: "#006dff" }]}
                        onPress={() => menuRef.current?.open()}
                    >
                        <Text style={{ fontSize: 13, color: '#d9d9d9' }}>Add Comment</Text>
                    </Pressable>
                )
            }

            <BottomDrawer
                sheetRef={menuRef}
                height={750}
                onClose={() => fetchComments()}
            >
                {selectedComment && (
                    <>
                        {/* Backdrop */}
                        <Pressable
                            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000077', zIndex: 1000 }}
                            onPress={() => setSelectedComment(null)}
                        />

                        {/* Selected Comment Clone */}
                        <View style={{ position: "absolute", left: 0, right: 0, top: selectedComment.position.relativeY + 13, zIndex: 1001 }}>
                            <View style={{ paddingLeft: selectedComment.reply ? 56 : 0, backgroundColor: '#fff', paddingVertical: 8 }}>
                                <Comment
                                    first_name={selectedComment.data.first_name}
                                    username={selectedComment.data.username}
                                    id={selectedComment.data.id}
                                    comment={selectedComment.data.comment}
                                    profile_image={selectedComment.data.profile_image}
                                    created_at={selectedComment.data.created_at}
                                    reply={selectedComment.data.reply}
                                    replies={[]}
                                    setReplyingTo={setReplyingTo}
                                    setReplyingId={setReplyingId}
                                />
                            </View>

                            {/* Contextual Menu - positioned below or above based on space */}
                            <View style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                marginHorizontal: 16,
                                ...(selectedComment.position.showMenuAbove
                                    ? { marginBottom: 16, position: 'absolute', bottom: selectedComment.position.height + 16, left: 0, right: 0 }
                                    : { marginTop: 16 }
                                ),
                            }}>
                                <Text style={{ fontSize: 15, fontWeight: "bold", textAlign: "center" }}>Delete this comment?</Text>
                                <Text style={{ fontSize: 13, color: "#a6a6a6", textAlign: "center", marginTop: 8, marginBottom: 16 }}>This action can't be undone. Are you sure you want to remove your comment?</Text>
                                <View style={{ flexDirection: "row", gap: 16 }}>
                                    <View style={{ flex: 1 / 2 }}>
                                        <GreyBgButton
                                            title='Cancel'
                                            onPress={() => setSelectedComment(null)}
                                        />
                                    </View>
                                    <View style={{ flex: 1 / 2 }}>
                                        <BlueButton
                                            title='Delete'
                                            dangerButton
                                            loading={isDeletingComment}
                                            onPress={handleDeleteComment}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </>
                )}
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'}>
                    <View ref={containerRef} style={{ flex: 1, position: 'relative' }}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 32, paddingBottom: commentContainerHeight + 32 }} style={{ flex: 1 }}>
                            <Text style={{ fontSize: 11, color: '#a6a6a6', textAlign: 'center' }}>Comments</Text>
                            {
                                comments.length > 0 ? comments.filter((comment) => comment.reply_to === null).map((comment) => (
                                    <Comment
                                        key={comment.id}
                                        username={comment.author.username}
                                        first_name={comment.author.first_name}
                                        id={comment.id}
                                        comment={comment.content}
                                        profile_image={comment.author.profile_image}
                                        setReplyingTo={setReplyingTo}
                                        setReplyingId={setReplyingId}
                                        can_reply={canComment && comment.can_tag}
                                        replies={comments.filter((c) => c.reply_to === comment.id)}
                                        created_at={comment.created_at}
                                        onLongPress={handleCommentLongPress}
                                    />
                                )) : (
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 64 }}>
                                        <Image source={require("@/assets/images/stars.png")} style={{ height: 128, width: 128 }} />
                                        <Text style={{ fontSize: 11, color: '#a6a6a6', marginTop: 32 }}>No comments yet. Be the first to share your thoughts!</Text>
                                    </View>
                                )
                            }
                        </ScrollView>
                        <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: 'white', zIndex: 1 }}>
                            {
                                replyingTo && (
                                    <View style={{ backgroundColor: '#737373', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, color: 'white' }}>Replying to @{replyingTo}</Text>
                                        <Pressable onPress={() => setReplyingTo(null)} style={({ pressed }) => [{ padding: 4, borderRadius: 50, backgroundColor: '#eeeeee' }, pressed && { backgroundColor: '#a6a6a6' }]}>
                                            <Image source={require('@/assets/images/close.png')} style={{ width: 6, height: 6 }} />
                                        </Pressable>
                                    </View>
                                )
                            }
                            {
                                canComment &&
                                <Animated.View style={[commentStyles.commentInputContainer, { marginBottom: animatedMargin }]} onLayout={(e) => setCommentContainerHeight(e.nativeEvent.layout.height)}>
                                    {
                                        replyingTo &&
                                        <Text style={{ color: '#006dff', marginLeft: 16, marginRight: -16 }}>@{replyingTo} </Text>
                                    }
                                    <TextInput
                                        onChangeText={setComment}
                                        multiline
                                        numberOfLines={6}
                                        style={[commentStyles.commentInput]}
                                        placeholder='Write here'
                                        cursorColor='black'
                                        textAlignVertical='top'
                                        ref={commentInputRef}
                                    >

                                    </TextInput>
                                    <Pressable
                                        onPress={postComment}
                                        style={({ pressed }) => [{ height: 45, width: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#202020', borderRadius: 45, margin: 8, marginRight: 16 }, pressed && comment.length != 0 && { backgroundColor: '#006dff' }, comment.length == 0 && { backgroundColor: "#f5f5f5" }]}>
                                        <Image style={[{ transform: [{ rotate: '-90deg' }], height: 24, width: 24 }, { tintColor: comment.length === 0 ? '#d9d9d9' : 'white' }]} source={require('@/assets/images/arrows/right-arrow-white.png')} />
                                    </Pressable>
                                </Animated.View>
                            }
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </BottomDrawer>

        </View>
    );
}

const commentStyles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        gap: 8,
    },
    heading: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#737373',
        height: 45,
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderRadius: 45,
    },
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
        alignItems: 'center',
    }
})