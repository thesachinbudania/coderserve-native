import React from 'react';
import { Dimensions, Image, View, StyleSheet, Text, ScrollView, ActivityIndicator, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { PostContent } from '../createPost/previewPost';
import protectedApi from '@/helpers/axios';
import { useGlobalSearchParams } from 'expo-router';
import VoteButton from '@/components/buttons/VoteButton';
import BottomDrawer from '@/components/BottomDrawer';
import BottomName from '@/components/profile/home/BottomName';
import BottomSheet from '@/components/messsages/BottomSheet';
import { MenuButton } from '../../jobs';
import BlueButton from '@/components/buttons/BlueButton';
import { useUserStore } from '@/zustand/stores';
import { useNewPostStore } from '@/zustand/talks/newPostStore';
import { useFocusEffect } from 'expo-router';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import TimerMenuOption from '@/components/buttons/TimerMenuOption';
import { Comments } from '@/components/talks/viewPost/Comments';
import { Header } from '@/components/talks/viewPost/Header';
import { Votes } from '@/components/talks/viewPost/Votes';

const { width } = Dimensions.get('window');





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
          <Votes
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
