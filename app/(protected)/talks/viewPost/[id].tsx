import React from 'react';
import { Dimensions, Image, TextInput, Pressable, View, StyleSheet, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageLoader from '@/components/ImageLoader';
import IconButton from '@/components/buttons/IconButton';
import { PostContent } from '../createPost/previewPost';
import protectedApi from '@/helpers/axios';
import { useGlobalSearchParams } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import VoteButton from '@/components/buttons/VoteButton';
import BottomDrawer from '@/components/BottomDrawer';
import SmallTextButton from '@/components/buttons/SmallTextButton';
import { apiUrl } from '@/constants/env'
import BottomName from '@/components/profile/home/BottomName';
import BottomSheet from '@/components/messsages/BottomSheet';


const { width } = Dimensions.get('window');

function Header({ post }: { post: any }) {
  const router = useRouter();
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
      <IconButton onPress={() => router.back()}>
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
  return (
    <View style={voteStyles.container}>
      <View style={voteStyles.buttonContainer}>
        {
          !downvoted && (
            <View style={{ flex: upvoted ? 1 : 1 / 2 }}>
              <VoteButton
                title={upvoted ? `${upvotes} Upvotes` : "Upvote"}
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
                title={downvoted ? `${downvotes} Downvotes` : "Downvote"}
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

const commentTimeCalculator = (created_at: string) => {
  const now = new Date();
  const commentDate = new Date(created_at);
  const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}H`;
  } else if (diffInSeconds < 2592000) { // 30 days
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}D`;
  }
  else if (diffInSeconds < 31536000) { // 1 year
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}M`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}Y`;
  }
}
const Comment = ({ first_name, username, id, replies, created_at, reply = false, comment, profile_image, setReplyingTo, setReplyingId }: { first_name: string, username: string, created_at: any, reply?: boolean, replies: any[], id: string, comment: string, profile_image: string, setReplyingId: (replyingId: string | null) => void, setReplyingTo: (replyingTo: string | null) => void }) => {
  const [showReplies, setShowReplies] = React.useState(false);
  replies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 8, width: '100%', paddingHorizontal: 16 }}>
        <View>
          <ImageLoader size={48} uri={profile_image} />
        </View>
        <View style={{ width: reply ? width - 144 : width - 88 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 13 }}>{first_name}</Text>
          <Text style={{ fontSize: 13, marginTop: 4, color: '#737373' }}>{comment}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            {
              !reply && (
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
      </View>
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
}

const Comments = ({ id, commentsCount, last_comment }: CommentsProps) => {
  const menuRef = React.useRef<any>(null);
  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState<any[]>([]);
  const commentInputRef = React.useRef<TextInput>(null);
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyingId, setReplyingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    protectedApi.get('/talks/posts/' + id + '/comments/').then(res => {
      setComments(res.data);
    }).catch(err => console.log(err.response.data));
  }, [])
  const postComment = () => {
    const url = replyingId ? `/talks/posts/${id}/comments/${replyingId}/reply/` : `/talks/posts/${id}/comments/`;
    protectedApi.post(url, {
      content: comment,
    }).then((res) => {
      setComments(res.data);
      commentInputRef.current?.clear();
    }).catch(err => console.log(err.response.data));
  }
  return (
    <View style={commentStyles.container}>
      <Text style={commentStyles.heading}>Comments <Text style={{ fontWeight: 'bold', color: '#737373' }}>{commentsCount}</Text></Text>
      {
        commentsCount > 0 && last_comment ? (
          <Pressable
            style={({ pressed }) => [{ flexDirection: 'row', gap: 4, paddingVertical: 8, backgroundColor: 'white', alignItems: 'center', marginHorizontal: -16, paddingHorizontal: 16, marginVertical: -8 }, pressed && { backgroundColor: '#f7f7f7' }]}
            onPress={() => menuRef.current?.open()}
          >
            <ImageLoader size={48} uri={apiUrl + last_comment.author.profile_image} />
            <Text style={{ width: width - 88, fontSize: 13, color: '#737373' }}>{last_comment.content}</Text>
          </Pressable>
        ) : (
          <Pressable
            style={commentStyles.inputContainer}
            onPress={() => menuRef.current?.open()}
          >
            <Text style={{ fontSize: 13, color: '#d9d9d9' }}>Add Comment</Text>
          </Pressable>
        )
      }

      <BottomDrawer
        sheetRef={menuRef}
        height={750}
      >
        <View style={{ flex: 1, position: 'relative' }}>
          <ScrollView contentContainerStyle={{ gap: 32, paddingBottom: 128 }} style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: '#a6a6a6', textAlign: 'center' }}>Comments</Text>
            {
              comments.length > 0 && comments.filter((comment) => comment.reply_to === null).map((comment) => (
                <Comment
                  key={comment.id}
                  username={comment.author.username}
                  first_name={comment.author.first_name}
                  id={comment.id}
                  comment={comment.content}
                  profile_image={comment.author.profile_image}
                  setReplyingTo={setReplyingTo}
                  setReplyingId={setReplyingId}
                  replies={comments.filter((c) => c.reply_to === comment.id)}
                  created_at={comment.created_at}
                />
              ))
            }
          </ScrollView>
          <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: 'white', zIndex: 1 }}>
            {
              replyingTo && (
                <View style={{ backgroundColor: '#f7f7f7', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: '#a6a6a6' }}>Replying to @{replyingTo}</Text>
                  <Pressable onPress={() => setReplyingTo(null)} style={({ pressed }) => [{ padding: 6, borderRadius: 50, backgroundColor: '#eeeeee' }, pressed && { backgroundColor: '#a6a6a6' }]}>
                    <Image source={require('@/assets/images/close.png')} style={{ width: 12, height: 12 }} />
                  </Pressable>
                </View>
              )
            }
            <View style={commentStyles.commentInputContainer}>
              {
                replyingTo &&
                <Text style={{ color: '#006dff' }}>@{replyingTo} </Text>
              }
              <TextInput
                onChangeText={setComment}
                multiline
                numberOfLines={6}
                style={commentStyles.commentInput}
                placeholder='Write here'
                cursorColor='black'
                textAlignVertical='top'
                ref={commentInputRef}
              >

              </TextInput>
              <Pressable
                onPress={postComment}
                style={({ pressed }) => [{ height: 45, width: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#202020', borderRadius: 45 }, pressed && { backgroundColor: '#006dff' }]}>
                <Image style={{ transform: [{ rotate: '-90deg' }], height: 20, width: 20 }} source={require('@/assets/images/arrows/right-arrow-white.png')} />
              </Pressable>
            </View>
          </View>
        </View>
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
  },
  commentInputContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    padding: 16,
    flexDirection: 'row',
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default function ViewPost() {
  const { id } = useGlobalSearchParams();
  const router = useRouter();
  const [post, setPost] = React.useState<any | null>(null);
  const [upvoted, setUpvoted] = React.useState(false);
  const [downvoted, setDownvoted] = React.useState(false);
  const [upvotes, setUpvotes] = React.useState(0);
  const [downvotes, setDownvotes] = React.useState(0);
  React.useEffect(() => {
    if (!id) return;
    protectedApi.get(`/talks/posts/${id}/`)
      .then(res => {
        setPost(res.data);
        setUpvoted(res.data.upvoted);
        setDownvoted(res.data.downvoted);
        setUpvotes(res.data.upvotes);
        setDownvotes(res.data.downvotes);
      })
      .catch(err => {
        console.error('Error fetching post:', err);
        router.back();
      });
  }, [])
  return (
    <ScrollView contentContainerStyle={{ minHeight: '100%', backgroundColor: 'white', paddingHorizontal: 16 }}>
      {post && (
        <><Header post={post} />
          <PostContent
            title={post.title}
            hashtags={post.hashtags}
            thumbnail={post.thumbnail}
          />
          <View style={{ height: 500, alignItems: 'center', justifyContent: 'center', }}>
            <Text>Post content will go here...</Text>
          </View>
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
          <Comments
            id={post.id}
            commentsCount={post.comments_count}
            last_comment={post.last_comment}
          />
          <View style={{ backgroundColor: "#f5f5f5", width: width, marginHorizontal: -16 }}>
            <BottomName />
          </View>
        </>
      )}
    </ScrollView>
  );
}

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

})
