import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import BottomDrawer from '@/components/BottomDrawer';
import React from 'react';
import TextAreaInput from '@/components/form/TextAreaInput';
import BlueButton from '@/components/buttons/BlueButton';
import BottomFixedSingleButton from '@/components/general/BottomFixedContainer';
import { Image, Pressable } from 'react-native';
import { useNewPostStore } from '@/zustand/talks/newPostStore';
import { useRouter } from 'expo-router';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import SmallTextButton from '@/components/buttons/SmallTextButton';

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
    borderRadius: 24,
  },
  text: {
    fontSize: 11,
    color: '#737373',
    lineHeight: 11
  },
  container: {
    borderWidth: 0.5,
    borderColor: '#737373',
    borderRadius: 6,
    padding: 4,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
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
      <BottomDrawer
        sheetRef={deleteConfirmSheet}
        draggableIconHeight={0}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>Delete this hashtag?</Text>
          <Text style={{ fontSize: 13, color: "#737373", textAlign: 'center', marginBottom: 30 }}>Are you sure you want to remove this hashtag from your post? This will be permanent, you won't be able to undo this.</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 / 2 }}>
              <GreyBgButton
                title='Cancel'
                onPress={() => { deleteConfirmSheet.current?.close() }}
              />
            </View>
            <View style={{ flex: 1 / 2 }}>
              <BlueButton
                title='Delete'
                onPress={onDeleteHashtag}
                dangerButton
              />
            </View>
          </View>
        </View>
      </BottomDrawer>
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
              {
                hashtags.length < 8 && (
                  <Pressable
                    style={({ pressed }) => [{ backgroundColor: '#202020', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 6 }, pressed && { backgroundColor: '#006dff' }]}
                    onPress={() => { menuRef.current?.open() }}>
                    <Text style={{ fontSize: 11, color: 'white' }}>Add More</Text>
                  </Pressable>
                )
              }
            </View>
          ) : (
            <View style={styles.noHashTagContainer}>
              <Text style={{ color: '#a6a6a6', fontSize: 13, textAlign: 'center' }}>
                You haven't added any hashtags yet
              </Text>
              <SmallTextButton
                title='Add now'
                onPress={() => { menuRef.current?.open() }}
                style={{ textAlign: 'center', textDecorationLine: 'underline', marginTop: 4, fontWeight: 'bold' }}
              />
            </View>
          )
        }
        <View style={styles.buttonsContainer}>
          <BlueButton
            title='Save'
            onPress={setHashtag}
            disabled={hashtags.length < 1 || (currentHashtags && hashtags == currentHashtags)}
          />

        </View>
      </PageLayout>
      <BottomDrawer
        sheetRef={menuRef}
        draggableIconHeight={0}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 102}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginBottom: 32, lineHeight: 15 }}>Add Hashtag</Text>
              <TextAreaInput
                placeholder='Write here'
                maxLength={40}
                text={newHashtag}
                setText={(hashtag: any) => {
                  // hashtag should be lowercase and no spaces
                  const formattedHashtag = hashtag.replace(/\s+/g, '').toLowerCase();
                  setNewHashtag(formattedHashtag);
                }}
                styles={{ height: 100 }}
                contentContainerStyle={{ marginBottom: 32 }}
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomDrawer>
    </>
  );
}

const styles = StyleSheet.create({
  noHashTagContainer: {
    minHeight: 280,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f5f5f5',
    borderRadius: 12,
  },
  hashTagContainer: {
    minHeight: 144,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f5f5f5',
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
