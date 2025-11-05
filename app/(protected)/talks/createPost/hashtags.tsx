import { StyleSheet, Text, View } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import NoBgButton from '@/components/buttons/NoBgButton';
import BottomSheet from '@/components/messsages/BottomSheet';
import React from 'react';
import TextAreaInput from '@/components/form/TextAreaInput';
import BlueButton from '@/components/buttons/BlueButton';
import { Image, Pressable } from 'react-native';
import { useNewPostStore } from '@/zustand/talks/newPostStore';
import { useRouter } from 'expo-router';
import GreyBgButton from '@/components/buttons/GreyBgButton';

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
  const { hashtags: currentHashtags, setNewPost } = useNewPostStore();
  const [hashtags, setHashtags] = React.useState<string[]>(currentHashtags || []);
  const deleteConfirmSheet = React.useRef<any>(null);
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  const router = useRouter();
  const onDeleteHashtag = () => {
    setHashtags(hashtags.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
    deleteConfirmSheet.current?.close();
  }
  const handleDelete = (index: number) => {
    deleteConfirmSheet.current?.open();
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
     <BottomSheet
        menuRef={deleteConfirmSheet}
        height={172}
      >
        <>
        <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>Delete this hashtag?</Text>
        <Text style={{fontSize: 13, color: "#a6a6a6", textAlign: 'center',marginBottom: 16}}>Are you sure you want to remove this hashtag from your post? This will be permanent, you won't be able to undo this.</Text>
        <View style={{flexDirection: 'row', gap: 16}}>
          <View style={{flex: 1/2}}>
            <GreyBgButton
              title='Cancel'
              onPress={() => { deleteConfirmSheet.current?.close() }}
              color='blue'
            />
          </View>
          <View style={{flex: 1/2}}>
            <BlueButton
              title='Delete'
              onPress={onDeleteHashtag}
            />
          </View>
        </View>
        </>
     </BottomSheet> 
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
            disabled={hashtags.length >= 8}
          />
          <BlueButton
            title='Save'
            disabled={hashtags.length < 1 || (currentHashtags && hashtags == currentHashtags)}
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
