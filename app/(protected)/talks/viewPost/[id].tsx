import React from 'react';
import { Dimensions, Image, TextInput, KeyboardAvoidingView, Pressable, View, StyleSheet, Text, ScrollView, ActivityIndicator, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageLoader from '@/components/ImageLoader';
import IconButton from '@/components/buttons/IconButton';
import PreviewPost, { PostContent } from '../createPost/previewPost';
import protectedApi from '@/helpers/axios';
import { useGlobalSearchParams } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import VoteButton from '@/components/buttons/VoteButton';
import BottomDrawer from '@/components/BottomDrawer';
import SmallTextButton from '@/components/buttons/SmallTextButton';
import BottomName from '@/components/profile/home/BottomName';
import BottomSheet from '@/components/messsages/BottomSheet';
import { MenuButton } from '../../jobs';
import BlueButton from '@/components/buttons/BlueButton';
import { useUserStore } from '@/zustand/stores';
import { useNewPostStore } from '@/zustand/talks/newPostStore';
import { useFocusEffect } from 'expo-router';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import PopUp from '@/components/messsages/PopUp';
import TimerMenuOption from '@/components/buttons/TimerMenuOption';
import { Portal } from 'react-native-paper';


const { width } = Dimensions.get('window');

// --- Header component: displays post author and menu button ---
function Header({ post, menuRef }: { post: any, menuRef?: any }) {
  const { top } = useSafeAreaInsets();
  let result = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  result = result.replace(/^about\s/, '');
  result = result.replace(/^almost\s/, '');
  result = result.replace(/^in\s/, '');
  result = result.replace(/^less than\s/, '');
  return (
    <View style={[styles.headerContainer, { paddingTop: top + 8 }]}>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {post.author.profile_image && (
          <ImageLoader size={48} uri={post.author.profile_image} border={1} />
        )}
        <View style={{ gap: 6, justifyContent: "center" }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.headerName}
          >{post.author.first_name}</Text>
          <Text style={styles.secondaryHeaderText}>
            {result}
          </Text>
        </View>
      </View>
      <IconButton onPress={() => menuRef?.current?.open()}>
        <View style={{ padding: 2 }}>
          <Image
            source={require("@/assets/images/jobs/Menu.png")}
            style={styles.headerIcon}
          />
        </View>
      </IconButton>
    </View>
  );
}

// --- Vote component: handles upvote/downvote logic and UI ---
const Vote = ({ id, upvoted, downvoted, setUpvoted, setDownvoted, setUpvotes, setDownvotes, upvotes, downvotes }: { id: string, upvoted: boolean, downvoted: boolean, setUpvoted: (downvoted: boolean) => void, setDownvoted: (upvoted: boolean) => void, setUpvotes: (upvotes: number) => void, setDownvotes: (downvotes: number) => void, upvotes: number, downvotes: number }) => {
  const upvotePost = () => {
    protectedApi.put(`/talks/posts/${id}/upvote/`)
      .then(() => {
        if (upvoted) {
          setUpvoted(false);
          setDownvoted(false);
          setUpvotes(upvotes - 1);
        }
        else {
          setUpvoted(true);
          setDownvoted(false);
          setUpvotes(upvotes + 1);
        }
      })
      .catch(err => {
        console.error('Error upvoting post:', err.response.data);
      });
  }
  const downvotePost = () => {
    protectedApi.put(`/talks/posts/${id}/downvote/`)
      .then(() => {
        if (downvoted) {
          setDownvoted(false);
          setUpvoted(false);
          setDownvotes(downvotes - 1);
        }
        else {
          setDownvoted(true);
          setUpvoted(false);
          setDownvotes(downvotes + 1);
        }
      })
      .catch(err => {
        console.error('Error downvoting post:', err.response.data);
      });
  }

  const totalVotes = upvotes - downvotes;
  const voteText = `${totalVotes} ${Math.abs(totalVotes) === 1 ? 'Vote' : 'Votes'}`;

  return (
    <View style={voteStyles.container}>
      <View style={voteStyles.buttonContainer}>
        {
          !downvoted && (
            <View style={{ flex: upvoted ? 1 : 1 / 2 }}>
              <VoteButton
                title={upvoted ? voteText : "Upvote"}
                onPress={upvotePost}
                selected={upvoted}
              />
              {upvoted && (
                <Text style={{ fontSize: 11, color: '#a6a6a6', marginTop: 4, textAlign: 'center' }}>You upvoted this post.</Text>
              )}
            </View>
          )
        }
        {
          !upvoted && (
            <View style={{ flex: downvoted ? 1 : 1 / 2 }}>
              <VoteButton
                title={downvoted ? voteText : "Downvote"}
                dangerButton={true}
                onPress={downvotePost}
                dangered={downvoted}
              />
              {downvoted && (
                <Text style={{ fontSize: 11, color: '#a6a6a6', marginTop: 4, textAlign: 'center' }}>You downvoted this post.</Text>
              )}
            </View>
          )
        }

      </View>

    </View>
  )
}

const voteStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    marginHorizontal: -16,
    paddingVertical: 8,
    marginTop: 32,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    gap: 16,
  }
})

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
const Comment = ({ first_name, can_reply, username, id, replies, created_at, reply = false, comment, profile_image, setReplyingTo, setReplyingId }: { can_reply?: boolean, first_name: string, username: string, created_at: any, reply?: boolean, replies: any[], id: string, comment: string, profile_image: string, setReplyingId: (replyingId: string | null) => void, setReplyingTo: (replyingTo: string | null) => void }) => {
  const [showReplies, setShowReplies] = React.useState(false);
  replies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const { username: currentUsername } = useUserStore();
  const [visible, setVisible] = React.useState(false);
  function openPopUp() {
    setVisible(true);
  }
  return (
    <View>
      <Pressable
        style={({ pressed }) => [{ flexDirection: 'row', gap: 8, width: '100%', paddingHorizontal: 16 }, pressed && currentUsername === username && { backgroundColor: '#f5f5f5' }]}
        onPress={() => {
          if (currentUsername === username) {
            openPopUp();
          }
        }}>
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
      <Portal>
        <PopUp visible={visible} setVisible={setVisible}>
          <View>
            <Text>Are you sure you want to delete this comment?</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <GreyBgButton title='Cancel' onPress={() => setVisible(false)} />
              <BlueButton title='Delete' onPress={() => setVisible(false)} />
            </View>
          </View>
        </PopUp>
      </Portal>
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
const Comments = ({ id, commentsCount, last_comment, onCommentAdded }: CommentsProps) => {
  const menuRef = React.useRef<any>(null);
  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState<any[]>([]);
  const commentInputRef = React.useRef<TextInput>(null);
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyingId, setReplyingId] = React.useState<string | null>(null);
  const [canComment, setCanComment] = React.useState<boolean>(false);
  const router = useRouter();
  const [commentContainerHeight, setCommentContainerHeight] = React.useState(0);

  const fetchComments = async () => {
    protectedApi.get('/talks/posts/' + id + '/comments/').then(res => {
      setComments(res.data.comments);
      setCanComment(res.data.can_comment);
    }).catch(
      () => router.push('/(freeRoutes)/error')
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
    }).catch(err => console.log(err.response.data));
  }

  const { bottom } = useSafeAreaInsets();
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
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'}>
          <View style={{ flex: 1, position: 'relative' }}>
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
                <View style={[commentStyles.commentInputContainer, { paddingBottom: bottom }]} onLayout={(e) => setCommentContainerHeight(e.nativeEvent.layout.height)}>
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
                </View>
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

// --- Main post view: fetches post, handles save, renders all sections ---
export default function ViewPost() {
  // --- State and refs ---
  const { id } = useGlobalSearchParams();
  const router = useRouter();
  const [post, setPost] = React.useState<any | null>(null);
  const [upvoted, setUpvoted] = React.useState(false);
  const [downvoted, setDownvoted] = React.useState(false);
  const [upvotes, setUpvotes] = React.useState(0);
  const [downvotes, setDownvotes] = React.useState(0);
  const [postSaved, setPostSaved] = React.useState(false);
  const [creationTime, setCreationTime] = React.useState<string | null>(null);
  const menuRef = React.useRef<any>(null);
  const deleteSheetRef = React.useRef<any>(null);
  const selfMenuRef = React.useRef<any>(null);
  const postSaveRef = React.useRef<any>(null);
  const { username } = useUserStore();
  const { setNewPost, editId } = useNewPostStore();

  async function shareProfileAsync() {
    try {
      await Share.share({
        message: 'https://coderserve.com/posts/' + id,
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  }

  // set the newPost store to empty if there is editId on focusing this screen
  useFocusEffect(React.useCallback(() => {
    if (editId) {
      setNewPost({ title: '', hashtags: [], thumbnail: undefined, content: null })
    }
  }, []))

  // --- Save/unsave post logic ---
  const toggleSave = async () => {
    if (!post?.id) return;
    try {
      // Close the menu first
      menuRef?.current?.close();
      const resp = await protectedApi.put('/talks/saved_posts/', { post_id: post.id });
      // If saved (created)
      if (resp.status === 201 || (resp.data && resp.data.detail && resp.data.detail.toLowerCase().includes('saved'))) {
        // open the saved confirmation sheet
        if (resp.status === 201) {
          setPostSaved(true);
        }
        else if (resp.status === 200) {
          setPostSaved(false);
        }
        setTimeout(() => postSaveRef?.current?.open(), 200);
      }
      // If unsaved (toggled off), do nothing special for now
    } catch (err: any) {
      // handle errors minimally
      console.error('Error toggling save post:', err?.response?.data || err?.message || err);
    }
  }
  const [fetchingPost, setFetchingPost] = React.useState(true);

  const fetchPost = async () => {
    if (!id) return;
    setFetchingPost(true);
    try {
      const res = await protectedApi.get(`/talks/posts/${id}/`);
      setPost(res.data);
      setPostSaved(res.data.saved)
      setUpvoted(res.data.upvoted);
      setDownvoted(res.data.downvoted);
      setUpvotes(res.data.upvotes);
      setDownvotes(res.data.downvotes);
      setCreationTime(res.data.created_at);
    }
    catch {
      router.push('/(freeRoutes)/error')
    }
    finally {
      setFetchingPost(false)
    }
  }

  // logic to delete a post
  const [deletingPost, setDeletingPost] = React.useState(false);
  const deletePost = async () => {
    if (!post?.id) return;
    setDeletingPost(true);
    try {
      await protectedApi.delete(`/talks/posts/${post.id}/delete/`);
      deleteSheetRef?.current?.close();
      router.back();
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      setDeletingPost(false);
    }
  }


  useFocusEffect(
    React.useCallback(() => {
      fetchPost();
    }, [id])
  );
  // --- Fetch post data on mount ---
  React.useEffect(() => {
    fetchPost();
  }, [])

  // --- Render ---
  return (
    <ScrollView contentContainerStyle={[{ minHeight: '100%', backgroundColor: 'white', paddingHorizontal: 16 }, fetchingPost && { flex: 1 }]}>
      {
        fetchingPost && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={'large'} />
        </View>
      }
      {post && (
        <>
          {/* Header: author info and menu */}
          <Header post={post} menuRef={post.author.username === username ? selfMenuRef : menuRef} />
          {/* Post content preview */}
          <PostContent
            title={post.title}
            hashtags={post.hashtags}
            thumbnail={post.thumbnail}
            content={post.content}
          />
          {/* Voting section */}
          <Vote
            id={post.id}
            upvoted={upvoted}
            downvoted={downvoted}
            setUpvoted={setUpvoted}
            setDownvoted={setDownvoted}
            upvotes={upvotes}
            downvotes={downvotes}
            setUpvotes={setUpvotes}
            setDownvotes={setDownvotes}
          />
          {/* Comments section */}
          <Comments
            id={post.id}
            commentsCount={post.comments_count}
            last_comment={post.last_comment}
            onCommentAdded={fetchPost}
          />
          {/* Bottom name bar */}
          <View style={{ backgroundColor: "#f5f5f5", width: width, marginHorizontal: -16, paddingTop: 8 }}>
            <View style={{ backgroundColor: 'white' }}>
              <BottomName />
            </View>
          </View>
        </>
      )}
      {/* Saved post confirmation sheet */}
      <BottomSheet
        menuRef={postSaveRef}
        height={192}
      >
        <Image source={require('@/assets/images/blueTick.png')} style={{ width: 48, height: 48, marginHorizontal: 'auto', tintColor: '#202020' }} />
        <Text style={{ textAlign: 'center', fontSize: 13, color: "#737373", marginTop: 16, marginBottom: 32 }}>
          {postSaved ? 'This post has been saved successfully.' : 'This post has been removed from your saved list.'}
        </Text>
        <BlueButton title="Okay" onPress={() => postSaveRef.current.close()} />
      </BottomSheet>
      {/* Menu for other user's post */}
      <BottomSheet
        menuRef={menuRef}
        height={392}>
        <View style={styles.menuContainer}>
          <MenuButton
            onPress={() => {
              menuRef?.current.close();
              router.push("/(freeRoutes)/profile/userProfile/" + post.author.username);
            }}
          >
            <Text style={styles.menuButtonHeading}>View Profile</Text>
            <Text style={styles.menuButtonText}>
              Visit the public profile of the post's author.
            </Text>
          </MenuButton>
          <MenuButton
            onPress={toggleSave}
          >
            <Text style={styles.menuButtonHeading}>{postSaved ? 'Unsave Post' : 'Save Post'}</Text>
            <Text style={styles.menuButtonText}>
              {
                postSaved ? 'Remove this post from your saved list.' : 'Bookmark this post to view it later.'
              }
            </Text>
          </MenuButton>
          <MenuButton>
            <Text style={styles.menuButtonHeading}>Mute</Text>
            <Text style={styles.menuButtonText}>
              Hide posts from the user in your feed.
            </Text>
          </MenuButton>
          <MenuButton>
            <Text
              style={[styles.menuButtonHeading]}
            >
              Report Post
            </Text>
            <Text style={[styles.menuButtonText]}>
              Flag this post to our support team for review.
            </Text>
          </MenuButton>
        </View>
      </BottomSheet>
      {/* Menu for own post */}
      <BottomDrawer
        sheetRef={deleteSheetRef}
        draggableIconHeight={0}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>Delete this post?</Text>
          <Text style={{ fontSize: 13, color: "#a6a6a6", marginTop: 16, textAlign: 'center' }}>
            This action cannot be undone. Once deleted, your post will be permanently removed.
          </Text>
          <View style={{ marginTop: 32, gap: 16, flexDirection: "row" }}>
            <View style={{ flex: 1 / 2 }}>
              <GreyBgButton title="Cancel" onPress={() => deleteSheetRef.current?.close()} />
            </View>
            <View style={{ flex: 1 / 2 }}>
              <BlueButton title="Delete" dangerButton loading={deletingPost} onPress={deletePost} />
            </View>
          </View>
        </View>
      </BottomDrawer>
      <BottomDrawer
        sheetRef={selfMenuRef}
        draggableIconHeight={0}
      >
        <View style={[styles.menuContainer, { paddingHorizontal: 16 }]}>
          <TimerMenuOption
            title="Edit Post"
            subTitle="Make changes to your content."
            pressTimer={60}
            creationTime={creationTime}
            onPress={() => {
              selfMenuRef?.current.close();
              setNewPost({
                editId: post.id,
                title: post.title,
                hashtags: post.hashtags,
                thumbnail: post.thumbnail,
                content: post.content,
              });
              router.push("/(protected)/talks/createPost");
            }}
          />
          <MenuButton
            onPress={() => {
              selfMenuRef?.current.close();
              router.push('/(freeRoutes)/profile/commentPermissions')
            }}
          >
            <Text style={styles.menuButtonHeading}>Comment Permissions</Text>
            <Text style={styles.menuButtonText}>
              Set who can comment on your post.
            </Text>
          </MenuButton>
          <MenuButton
            onPress={shareProfileAsync}
          >
            <Text style={styles.menuButtonHeading}>Share Post</Text>
            <Text style={styles.menuButtonText}>
              Share your post with more people.
            </Text>
          </MenuButton>
          <MenuButton
            onPress={() => {
              selfMenuRef?.current.close();
              setTimeout(() => deleteSheetRef?.current?.open(), 300);
            }}
          >
            <Text style={styles.menuButtonHeading}>Delete Post</Text>
            <Text style={styles.menuButtonText}>
              Permanently remove this post.
            </Text>
          </MenuButton>
          <MenuButton
            dark>
            <Text
              style={[styles.menuButtonHeading, { color: '#fff' }]}
            >
              Boost Post
            </Text>
            <Text style={[styles.menuButtonText, { color: "#a6a6a6" }]}>
              Promote your post to reach a larger audience.
            </Text>
          </MenuButton>
        </View>
      </BottomDrawer>

    </ScrollView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 16,
  },
  headerName: {
    fontSize: 15,
    fontWeight: "bold",
    width: width - 140,
  },
  secondaryHeaderText: {
    fontSize: 11,
    color: "#737373",
  },
  headerIcon: {
    width: 24,
    height: 24,
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

})
