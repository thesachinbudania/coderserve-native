import TextEditor from '@/components/talks/createPost/Editor';
import React from 'react';
import { Image, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/general/Header';
import { useRouter } from 'expo-router';
import BottomFixedSingleButton from '@/components/general/BottomFixedContainer';
import BlueButton from '@/components/buttons/BlueButton';
import { Portal } from '@gorhom/portal'
import { KeyboardAvoidingView, Dimensions, UIManager, findNodeHandle, Keyboard } from 'react-native';
import { useNewPostStore } from '@/zustand/talks/newPostStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker'

interface FormatButtonProps {
  onPress?: () => void;
  active: boolean;
  title: string;
  toggleable?: boolean;
  disabled?: boolean;
}

interface ImageFormatButtonProps extends FormatButtonProps {
  icon: any
}

function ImageFormatButton({ onPress, active, icon, disabled }: ImageFormatButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [{ borderWidth: 1, borderRadius: 8, borderColor: '#f5f5f5', height: 40, width: 40, alignItems: 'center', justifyContent: 'center', },
      active && { backgroundColor: '#006dff', borderColor: '#006dff' }, pressed && !disabled && { backgroundColor: active ? '#202020' : '#f5f5f5', borderColor: active ? '#202020' : '#f5f5f5' }]}
      onPress={disabled ? () => { } : onPress}
    >
      {
        ({ pressed }) =>
          <Image
            source={icon}
            style={[{ width: 20, height: 20 }, active ? { tintColor: 'white' } : { tintColor: disabled ? '#d9d9d9' : '#202020' }]}
          />
      }
    </Pressable>
  )
}

function FormatButton({ onPress, active, title, toggleable = false }: FormatButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [{ borderWidth: 1, borderRadius: 8, height: 40, borderColor: '#f5f5f5', paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', },

      active && { backgroundColor: '#006dff', borderColor: '#006dff' }, !toggleable && pressed && { backgroundColor: '#006dff', borderColor: '#006dff' }, pressed && { backgroundColor: active ? '#202020' : "#f5f5f5", borderColor: active ? '#202020' : "#f5f5f5" }]}
      onPress={onPress}
    >
      {
        ({ pressed }) => (
          <Text style={[(active) && { color: 'white' }, !toggleable && pressed && { color: 'white' }, { fontSize: 13 }]}>{title}</Text>
        )
      }
    </Pressable>
  )
}

interface TextTypeButtonProps {
  isHeading?: boolean;
  isHeading2?: boolean;
  setIsHeading?: (isHeading: boolean) => void;
  setIsHeading2?: (isHeading2: boolean) => void;
  changeHeading?: boolean;
  changeHeading2?: boolean;
  setChangeHeading?: (changeHeading: boolean) => void;
  setChangeHeading2?: (changeHeading2: boolean) => void;
}

const TextTypeButton = ({ isHeading, isHeading2, setIsHeading, setIsHeading2, changeHeading, changeHeading2, setChangeHeading, setChangeHeading2 }: TextTypeButtonProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [popupPos, setPopupPos] = React.useState<{ left: number; top: number }>({ left: 16, top: 100 });
  const [leftButtonPos, setLeftButtonPos] = React.useState(16);
  const buttonRef = React.useRef<View>(null);

  const screenWidth = Dimensions.get('window').width;
  const popupWidth = 112; // adjust to your design (sum of text width + padding)

  const measureButton = () => {
    if (!buttonRef.current) return;

    UIManager.measure(findNodeHandle(buttonRef.current)!, (x, y, width, height, pageX, pageY) => {
      // x,y = relative to parent
      // pageX,pageY = absolute screen coords
      let left = pageX + 1;
      // compute top so popup appears above the button (use pageY which is button's top)
      const popupHeight = 140; // approximate popup height including padding
      let top = pageY - popupHeight - 8; // 8px margin above button

      // If not enough space above, push below the button instead
      if (top < 16) {
        top = pageY + height + 8;
      }

      // Clamp within screen horizontally (keeping 16px margin)
      if (left + popupWidth > screenWidth - 16) {
        left = screenWidth - popupWidth - 16;
      }
      if (left < 16) {
        left = 16;
      }

      setLeftButtonPos(left);
      setPopupPos({ left, top });
    });
  };

  const togglePopup = () => {
    if (!isOpen) {
      measureButton();
    }
    setIsOpen(!isOpen);
  };

  // Re-measure when keyboard opens/closes or on orientation change so popup stays near the button
  React.useEffect(() => {
    const onKeyboard = () => {
      if (isOpen) measureButton();
    };
    const kbShow = Keyboard.addListener('keyboardDidShow', onKeyboard);
    const kbHide = Keyboard.addListener('keyboardDidHide', onKeyboard);
    const dimSub = Dimensions.addEventListener('change', onKeyboard);
    return () => {
      kbShow.remove();
      kbHide.remove();
      // Dimensions event subscription uses remove on newer RN, guard for both
      try { dimSub?.remove(); } catch (e) { /* ignore */ }
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <Portal>
          <KeyboardAvoidingView behavior="padding" style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, zIndex: 20 }}>
            <Pressable
              style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, backgroundColor: 'black', opacity: 0.4 }}
              onPress={() => setIsOpen(false)}
            >
            </Pressable>
            <View
              style={{
                position: 'absolute',
                left: popupPos.left,
                top: popupPos.top,
                width: popupWidth,
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#eeeeee',
                borderRadius: 8,
                zIndex: 30,
                padding: 16,
                gap: 16
              }}
            >
              <Pressable onPress={() => {
                setIsOpen(false)
                setIsHeading && setIsHeading(true)
                setIsHeading2 && setIsHeading2(false)
                setChangeHeading && setChangeHeading(!changeHeading)
                if (isHeading2 && setChangeHeading2) setChangeHeading2(!changeHeading2)

              }} >
                {
                  ({ pressed }) => <Text style={{ fontSize: 17, fontWeight: 'bold', color: pressed ? '#006dff' : '#000' }}>Heading 1</Text>
                }
              </Pressable>
              <Pressable onPress={() => {
                setIsOpen(false)
                setIsHeading && setIsHeading(false)
                setIsHeading2 && setIsHeading2(true)
                if (isHeading && setChangeHeading) setChangeHeading(!changeHeading)
                setChangeHeading2 && setChangeHeading2(!changeHeading2)
              }} >
                {
                  ({ pressed }) => <Text style={{ fontSize: 15, fontWeight: 'bold', color: pressed ? '#006dff' : '#000' }}>Heading 2</Text>
                }
              </Pressable>
              <Pressable onPress={() => {
                setIsOpen(false)
                setIsHeading && setIsHeading(false)
                setIsHeading2 && setIsHeading2(false)
                if (isHeading && setChangeHeading) setChangeHeading(!changeHeading)
                if (isHeading2 && setChangeHeading2) setChangeHeading2(!changeHeading2)
              }} >
                {
                  ({ pressed }) => <Text style={{ fontSize: 13, color: pressed ? '#006dff' : '#737373' }}>Paragraph</Text>
                }
              </Pressable>

            </View>
            <Pressable style={{
              position: 'absolute',
              left: leftButtonPos,
              top: popupPos.top + 148,
              width: popupWidth,
              borderWidth: 1,
              borderColor: '#f5f5f5',
              borderRadius: 6,
              height: 40,
              paddingHorizontal: 16,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
              backgroundColor: 'white',
            }}
              onPress={togglePopup}
            >
              <Text style={{ fontSize: 13 }}>{isHeading ? 'Heading 1' : isHeading2 ? 'Heading 2' : 'Paragraph'}</Text>
              <Image source={require('@/assets/images/home/greyDownArrow.png')} style={{ width: 10, height: 8 }} />
            </Pressable>
          </KeyboardAvoidingView>
        </Portal>
      )}

      <Pressable
        ref={buttonRef}
        style={({ pressed }) => [
          {
            borderWidth: 1,
            borderColor: '#f5f5f5',
            borderRadius: 6,
            height: 40,
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
          },
          pressed && { backgroundColor: '#f5f5f5' },
        ]}
        onPress={togglePopup}
      >
        <Text style={{ fontSize: 13 }}>{isHeading ? 'Heading 1' : isHeading2 ? 'Heading 2' : 'Paragraph'}</Text>
        <Image source={require('@/assets/images/home/greyDownArrow.png')} style={{ width: 10, height: 8 }} />
      </Pressable>
    </>
  );
};

export default function Content() {
  const [changeBold, setChangeBold] = React.useState(false);
  const [isBold, setIsBold] = React.useState(false);
  const [changeItalic, setChangeItalic] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [changeUnderline, setChangeUnderline] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [changeHighlight, setChangeHighlight] = React.useState(false);
  const [isHighlight, setIsHighlight] = React.useState(false);
  const [changeHeading, setChangeHeading] = React.useState(false);
  const [isHeading, setIsHeading] = React.useState(false);
  const [changeHeading2, setChangeHeading2] = React.useState(false);
  const [isHeading2, setIsHeading2] = React.useState(false);
  const [changeCodeBlock, setChangeCodeBlock] = React.useState(false);
  const [isCodeBlock, setIsCodeBlock] = React.useState(false);
  const [changeAddImage, setChangeAddImage] = React.useState(false);
  const [undo, setUndo] = React.useState(false);
  const [redo, setRedo] = React.useState(false);
  const [redoEnabled, setRedoEnabled] = React.useState(false);
  const [isOrderedList, setIsOrderedList] = React.useState(false);
  const [changeOrderedList, setChangeOrderedList] = React.useState(false); // Fixed: renamed from orderedList
  const [isUnorderedList, setIsUnorderedList] = React.useState(false);
  const [changeUnorderedList, setChangeUnorderedList] = React.useState(false); // Fixed: renamed from unorderedList
  const router = useRouter();
  const { setNewPost, content } = useNewPostStore();
  const [editorState, setEditorState] = React.useState<string | null>(content);
  const [plainText, setPlainText] = React.useState("");
  const [undoEnabled, setUndoEnabled] = React.useState(false);
  const { bottom } = useSafeAreaInsets();
  const [image, setImage] = React.useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      base64: true,
      quality: 1,
      aspect: [3, 1]
    })
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setImage(asset);
    }
  }

  React.useEffect(() => {
    if (editorState) {
      setNewPost({ content: editorState });
    }
  }, [editorState]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 57, paddingBottom: bottom > 16 ? 134 : 149 }}>
        <Header
          title='Post Content'
          onBackPress={() => router.back()}
        />
        <TextEditor
          setPlainText={setPlainText}
          image={image}
          setEditorState={setEditorState}
          changeBold={changeBold}
          setIsBold={setIsBold}
          changeItalic={changeItalic}
          setIsItalic={setIsItalic}
          changeUnderline={changeUnderline}
          setIsUnderline={setIsUnderline}
          changeCodeBlock={changeCodeBlock}
          setIsCodeBlock={setIsCodeBlock}
          changeAddImage={changeAddImage}
          changeHighlight={changeHighlight}
          setIsHighlight={setIsHighlight}
          changeHeading={changeHeading}
          isHeading={isHeading}
          setIsHeading={setIsHeading}
          changeHeading2={changeHeading2}
          isHeading2={isHeading2}
          setIsHeading2={setIsHeading2}
          undo={undo}
          redo={redo}
          undoEnabled={undoEnabled}
          setChangeCodeBlock={setChangeCodeBlock}
          redoEnabled={redoEnabled}
          setIsUndoEnabled={setUndoEnabled}
          setRedoEnabled={setRedoEnabled}
          changeOrderedList={changeOrderedList} // Fixed: now using correct state variable
          changeUnorderedList={changeUnorderedList} // Fixed: now using correct state variable
          setIsOrderedList={setIsOrderedList}
          setIsUnorderedList={setIsUnorderedList}
          initialEditorState={editorState}
        />
      </View>

      <KeyboardAvoidingView
        style={{ position: 'absolute', bottom: bottom > 16 ? bottom + 61 : 77, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#f5f5f5' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', gap: 16, padding: 16, }}
        >
          <ImageFormatButton
            onPress={() => setUndo(!undo)}
            active={false}
            icon={require('@/assets/images/talks/createPost/undo.png')}
            title=''
            disabled={!undoEnabled}
          />
          <ImageFormatButton
            onPress={() => setRedo(!redo)}
            active={false}
            icon={require('@/assets/images/talks/createPost/redo.png')}
            title=''
            disabled={!redoEnabled}
          />
          <TextTypeButton
            isHeading={isHeading}
            isHeading2={isHeading2}
            setIsHeading={setIsHeading}
            setIsHeading2={setIsHeading2}
            changeHeading={changeHeading}
            changeHeading2={changeHeading2}
            setChangeHeading={setChangeHeading}
            setChangeHeading2={setChangeHeading2}
          />
          <ImageFormatButton
            onPress={() => {
              setChangeBold(!changeBold)
              setIsBold(!isBold) // Immediate visual feedback 
            }}
            active={isBold}
            toggleable
            title=''
            icon={require('@/assets/images/talks/createPost/bold.png')}
          />
          <ImageFormatButton
            onPress={() => {
              setChangeItalic(!changeItalic)
              setIsItalic(!isItalic) // Immediate visual feedback
            }}
            active={isItalic}
            toggleable
            title=''
            icon={require('@/assets/images/talks/createPost/italic.png')}
          />
          <ImageFormatButton
            onPress={() => {
              setChangeUnderline(!changeUnderline)
              setIsUnderline(!isUnderline) // Immediate visual feedback
            }}
            active={isUnderline}
            toggleable
            title=''
            icon={require('@/assets/images/talks/createPost/underline.png')}
          />
          <ImageFormatButton
            onPress={pickImage}
            active={false}
            title="Img"
            icon={require('@/assets/images/talks/createPost/image.png')}
          />
          {/* Fixed list buttons */}
          <ImageFormatButton
            onPress={() => setChangeUnorderedList(!changeUnorderedList)} // Fixed: using correct state
            active={isUnorderedList}
            toggleable
            title=''
            icon={require('@/assets/images/talks/createPost/unorderedList.png')}
          />
          <ImageFormatButton
            onPress={() => setChangeOrderedList(!changeOrderedList)} // Fixed: using correct state
            active={isOrderedList}
            toggleable
            title=''
            icon={require('@/assets/images/talks/createPost/orderedList.png')}
          />
          <FormatButton
            onPress={() => {
              setChangeHighlight(!changeHighlight)
              setIsHighlight(!isHighlight) // Immediate visual feedback
            }}
            active={isHighlight}
            title="Highlight"
            toggleable
          />
          <FormatButton
            onPress={() => {
              setChangeCodeBlock(!changeCodeBlock)
            }}
            active={isCodeBlock}
            title="Code"
            toggleable
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomFixedSingleButton>
        <BlueButton
          title='Save'
          onPress={() => router.back()}
          disabled={editorState === null || plainText.trim().length === 0 || editorState === ''}
        />
      </BottomFixedSingleButton>
    </SafeAreaView>
  );
}
