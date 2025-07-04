import { StyleSheet, Text, View } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import NoBgButton from '@/components/buttons/NoBgButton';
import BottomSheet from '@/components/messsages/BottomSheet';
import React from 'react';
import TextAreaInput from '@/components/form/TextAreaInput';
import BlueButton from '@/components/buttons/BlueButton';
import { Image, Pressable } from 'react-native';
import PopUpMessage from '@/components/jobs/resume/PopUpMessage';
import { useNewPostStore } from '@/zustand/talks/newPostStore';
import { useRouter } from 'expo-router';

interface HashChipProps {
  hashtag: string;
  index: number;
  onDelete: (index: number) => void;
}

const HashChip = ({ hashtag, index, onDelete }: HashChipProps) => {
  return (
    <View style={hashChipStyles.container}>
      <Text style={hashChipStyles.text}>
        #{hashtag}
      </Text>
      <Pressable
        style={({ pressed }) => [hashChipStyles.crossContainer, pressed && { backgroundColor: '#d9d9d9' }]}
        onPress={() => onDelete(index)}
      >
        <Image
          source={require('@/assets/images/close.png')}
          style={{ width: 8, height: 8 }}
          resizeMode='contain'
        />
      </Pressable>

    </View>
  )
}

const hashChipStyles = StyleSheet.create({
  crossContainer: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 24
  },
  text: {
    fontSize: 11,
    color: '#737373',
  },
  container: {
    borderWidth: 0.5,
    borderColor: '#737373',
    borderRadius: 6,
    padding: 4,
    flexDirection: 'row',
    gap: 8,
  }
});

export default function Hashtags() {
  const menuRef = React.useRef<any>(null);
  const [newHashtag, setNewHashtag] = React.useState<string>('');
  const [hashtags, setHashtags] = React.useState<string[]>([]);
  const [showPopUp, setShowPopUp] = React.useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  const { setNewPost } = useNewPostStore();
  const router = useRouter();
  const onDeleteHashtag = () => {
    setHashtags(hashtags.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
    setShowPopUp(false);
  }
  const handleDelete = (index: number) => {
    setShowPopUp(true);
    setDeleteIndex(index);

  }

  const setHashtag = () => {
    if (hashtags.length > 0) {
      setNewPost({ hashtags });
      router.back();
    }
  }
  return (
    <>
      <PopUpMessage
        heading='Delete this education?'
        text='This action will permanently remove this education from your resume. You won’t be able to undo this.'
        visible={showPopUp}
        setVisible={setShowPopUp}
        onPress={onDeleteHashtag}
        isLoading={false}
      />

      <PageLayout
        headerTitle='Hashtags'
      >
        <Text style={{ fontSize: 11, color: '#a6a6a6', marginBottom: 8 }}>
          Tag your topic to reach the right audience
        </Text>
        {
          hashtags.length > 0 ? (
            <View style={styles.hashTagContainer}>
              {hashtags.map((hashtag, index) => (
                <HashChip
                  key={index}
                  hashtag={hashtag}
                  onDelete={handleDelete}
                  index={index}
                />
              ))}
            </View>
          ) : (
            <View style={styles.noHashTagContainer}>
              <Text style={{ color: '#d9d9d9', fontSize: 13, textAlign: 'center' }}>
                No hashtags added
              </Text>
            </View>
          )
        }
        <View style={styles.buttonsContainer}>
          <NoBgButton
            title='Add Hashtag'
            onPress={() => { menuRef.current?.open() }}
            disabled={hashtags.length >= 7}
          />
          <BlueButton
            title='Save'
            disabled={hashtags.length < 1}
            onPress={setHashtag}
          />
        </View>
      </PageLayout>
      <BottomSheet
        menuRef={menuRef}
        height={284}
      >
        <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>Hashtag</Text>
        <TextAreaInput
          placeholder='Write here'
          maxLength={40}
          text={newHashtag}
          setText={setNewHashtag}
          styles={{ height: 128 }}
          contentContainerStyle={{ marginBottom: 48 }}
        />
        <BlueButton
          title='Add'
          disabled={newHashtag.length < 1}
          onPress={() => {
            setHashtags([...hashtags, newHashtag]);
            setNewHashtag('');
            menuRef.current?.close();
          }}
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  noHashTagContainer: {
    height: 144,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 12,
  },
  hashTagContainer: {
    minHeight: 144,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  buttonsContainer: {
    gap: 16,
    marginTop: 48,
  }
})
