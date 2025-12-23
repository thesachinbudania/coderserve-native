import { View } from 'react-native';
import { SectionContainer, Section, SectionOption } from '@/components/general/OptionsSection';
import PageLayout from '@/components/general/PageLayout';
import BottomFixedSingleButton from '@/components/general/BottomFixedContainer';
import NoBgButton from '@/components/buttons/NoBgButton';
import BlueButton from '@/components/buttons/BlueButton';
import { useRouter } from 'expo-router';
import { useNewPostStore } from '@/zustand/talks/newPostStore';
import protectedApi from '@/helpers/axios';
import React from 'react';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import errorHandler from '@/helpers/general/errorHandler';

export default function CreatePost() {
  const router = useRouter();
  const { title, hashtags, thumbnail, content, editId, setNewPost } = useNewPostStore();
  const PostSchema = zod.object({
    title: zod.string().min(1, 'Title is required'),
    hashtags: zod.array(zod.string()).optional(),
    content: zod.string().min(1, 'Content is required'),
    thumbnail: zod
      .any()
      .optional()
  });

  type PostForm = zod.infer<typeof PostSchema>;

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<PostForm>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: title || '',
      hashtags: hashtags || [],
      content: content || '',
      thumbnail: thumbnail || undefined
    }
  });

  // keep the form in sync with zustand values updated in other screens

  React.useEffect(() => {
    reset({ title: title || '', hashtags: hashtags || [], content: content || '', thumbnail: thumbnail || undefined });
  }, [title, hashtags, content, thumbnail]);

  const uploadPost = handleSubmit(
    async (values) => {
      const form: any = new FormData();
      form.append('title', values.title);
      form.append('hashtags', JSON.stringify(values.hashtags || []));
      if (values.thumbnail && (values.thumbnail as any).uri) {
        form.append('thumbnail', {
          uri: (values.thumbnail as any).uri,
          type: 'image/jpeg',
          name: 'thumbnail.jpg'
        });
      }
      if (editId) {
        form.append('content', values.content)
      }
      else {
        form.append('content', JSON.stringify(values.content));
      }
      try {
        if (editId) {
          await protectedApi.put('/talks/posts/' + editId + '/update/', form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          await protectedApi.post('/talks/posts/', form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
        // clear the new-post store so the next post starts fresh
        try {
          setNewPost({ title: '', hashtags: [], thumbnail: null, content: null });
        } catch (e) {
          // ignore if store setter not available
        }
        // also reset the local form values
        reset({ title: '', hashtags: [], content: '', thumbnail: undefined });
        if (editId) {
          router.back();
        }
        else {
          router.push('/(protected)/talks');
        }
      } catch (error: any) {
        errorHandler(error);
        console.error('Error uploading post:', error?.response?.data || error);
      }
    },
    (zodErrors) => {
      // Log zod validation errors
      console.log('ZOD VALIDATION ERRORS:', zodErrors);
    }
  );
  return (
    <>
      <PageLayout headerTitle='Create Post'>
        <SectionContainer>
          <Section title='Share your ideas with the community'>
            <SectionOption
              title='Headline'
              subTitle='Grab attention with a strong title.'
              onPress={() => router.push('/(protected)/talks/createPost/headline')}
            />
            <SectionOption
              title='Hashtags'
              subTitle='Tag your topic to reach the right audience.'
              onPress={() => router.push('/(protected)/talks/createPost/hashtags')}
            />
            <SectionOption
              title='Thumbnail'
              subTitle='Add a visual touch.'
              onPress={() => router.push('/(protected)/talks/createPost/thumbnail')}
              optional
            />
            <SectionOption
              title='Post Content'
              subTitle='Write the main content of your post here.'
              onPress={() => router.push('/(protected)/talks/createPost/content')}
            />
          </Section>
        </SectionContainer>

      </PageLayout>
      <BottomFixedSingleButton>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 1 / 2 }}>
            <NoBgButton
              title='Preview'
              onPress={() => router.push('/(protected)/talks/createPost/previewPost')}
              disabled={!title}
              outlined
            />
          </View>
          <View style={{ flex: 1 / 2 }}>
            <BlueButton
              title={editId ? 'Update' : 'Post '}
              disabled={!title || !hashtags.length || !content}
              loading={isSubmitting}
              onPress={uploadPost}
            />
          </View>
        </View>
      </BottomFixedSingleButton>
    </>
  );
}
