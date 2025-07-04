import { View } from 'react-native';
import { SectionContainer, Section, SectionOption } from '@/components/general/OptionsSection';
import PageLayout from '@/components/general/PageLayout';
import BottomFixedSingleButton from '@/components/general/BottomFixedContainer';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import BlueButton from '@/components/buttons/BlueButton';
import { useRouter } from 'expo-router';
import { useNewPostStore } from '@/zustand/talks/newPostStore';

export default function CreatePost() {
  const router = useRouter();
  const { title } = useNewPostStore();
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
              disabled
            />
          </View>
        </View>
      </BottomFixedSingleButton>
    </>
  );
}
