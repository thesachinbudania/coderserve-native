import { View } from 'react-native';
import { SectionContainer, Section, SectionOption } from '@/components/general/OptionsSection';
import PageLayout from '@/components/general/PageLayout';
import BottomFixedSingleButton from '@/components/general/BottomFixedContainer';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import BlueButton from '@/components/buttons/BlueButton';
import { useRouter } from 'expo-router';
import { useNewPostStore } from '@/zustand/talks/newPostStore';
import protectedApi from '@/helpers/axios';
import React from 'react';

export default function CreatePost() {
  const router = useRouter();
  const { title, hashtags, thumbnail, content } = useNewPostStore();
  const uploadPost = async () => {
    const form: any = new FormData();
    form.append('title', title);
    form.append('hashtags', JSON.stringify(hashtags));
    form.append('thumbnail', {
      uri: thumbnail.uri,
      type: 'image/jpeg',
      name: 'thumbnail.jpg'
    });
    form.append('content', JSON.stringify(content));
    protectedApi.post('/talks/posts/', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(() => {
      router.push('/(protected)/talks');
    }).catch(error => {
      console.error('Error uploading post:', error.response.data);
    })
  }
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
            <GreyBgButton
              title='Preview'
              onPress={() => router.push('/(protected)/talks/createPost/previewPost')}
              disabled={!title}
            />
          </View>
          <View style={{ flex: 1 / 2 }}>
            <BlueButton
              title='Post '
              disabled={!title || !hashtags.length || !thumbnail || !content}
              onPress={uploadPost}
            />
          </View>
        </View>
      </BottomFixedSingleButton>
    </>
  );
}
