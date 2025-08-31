import TextEditor from '@/components/talks/createPost/Editor';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import Header from '@/components/general/Header';
import { useRouter } from 'expo-router';
import BottomFixedSingleButton from '@/components/general/BottomFixedContainer';
import BlueButton from '@/components/buttons/BlueButton';
import { Portal } from '@gorhom/portal'
import { Dimensions, UIManager, findNodeHandle } from 'react-native';

interface FormatButtonProps {
  onPress?: () => void;
  active: boolean;
  title: string;
  toggleable?: boolean;
}

interface ImageFormatButtonProps extends FormatButtonProps {
  icon: any
}

function ImageFormatButton({ onPress, active, icon }: ImageFormatButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [{ borderWidth: 1, borderRadius: 8, borderColor: '#f5f5f5', height: 45, width: 45, alignItems: 'center', justifyContent: 'center', },
      active && { backgroundColor: '#006dff', borderColor: '#006dff' }, pressed && { backgroundColor: '#f5f5f5', borderColor: '#f5f5f5' }]}
      onPress={onPress}
    >
      {
        ({ pressed }) =>
          <Image
            source={icon}
            style={[{ width: 20, height: 20 }, active ? { tintColor: 'white' } : { tintColor: '#202020' }]}
          />
      }
    </Pressable>
  )
}

function FormatButton({ onPress, active, title, toggleable = false }: FormatButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [{ borderWidth: 1, borderRadius: 8, height: 45, borderColor: '#f5f5f5', paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', },
      active && { backgroundColor: '#006dff', borderColor: '#006dff' }, !toggleable && pressed && { backgroundColor: '#006dff', borderColor: '#006dff' }]}
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
  const [popupPos, setPopupPos] = React.useState<{ left: number; bottom: number }>({ left: 16, bottom: 16 });
  const [leftButtonPos, setLeftButtonPos] = React.useState(16);
  const buttonRef = React.useRef<View>(null);

  const screenWidth = Dimensions.get('window').width;
  const popupWidth = 112; // adjust to your design (sum of text width + padding)

  const measureButton = () => {
    if (!buttonRef.current) return;

    UIManager.measure(findNodeHandle(buttonRef.current)!, (x, y, width, height, pageX, pageY) => {
      // x,y = relative to parent
      // pageX,pageY = absolute screen coords
      let left = pageX;
      const bottom = Dimensions.get('window').height - pageY + 45; // adjust: toolbar height

      // Clamp within screen (keeping 16px margin)
      if (left + popupWidth > screenWidth - 16) {
        left = screenWidth - popupWidth - 16;
      }
      if (left < 16) {
        left = 16;
      }
      setLeftButtonPos(pageX);
      setPopupPos({ left, bottom });
    });
  };

  const togglePopup = () => {
    if (!isOpen) {
      measureButton();
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && (
        <Portal>
          <Pressable
            style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, backgroundColor: 'black', opacity: 0.4 }}
            onPress={() => setIsOpen(false)}
          >
          </Pressable>
          <View
            style={{
              position: 'absolute',
              left: popupPos.left,
              bottom: 157,
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
              setChangeHeading2 && setChangeHeading2(false)

            }} >
              {
                ({ pressed }) => <Text style={{ fontSize: 17, fontWeight: 'bold', color: pressed ? '#006dff' : '#000' }}>Heading 1</Text>
              }
            </Pressable>
            <Pressable onPress={() => {
              setIsOpen(false)
              setIsHeading && setIsHeading(false)
              setIsHeading2 && setIsHeading2(true)
              setChangeHeading && setChangeHeading(false)
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
              setChangeHeading && setChangeHeading(false)
              setChangeHeading2 && setChangeHeading2(false)
            }} >
              {
                ({ pressed }) => <Text style={{ fontSize: 13, color: pressed ? '#006dff' : '#737373' }}>Paragraph</Text>
              }
            </Pressable>

          </View>
          <Pressable style={{
            position: 'absolute',
            left: leftButtonPos,
            bottom: 96,
            width: popupWidth,
            borderWidth: 1,
            borderColor: '#f5f5f5',
            borderRadius: 6,
            height: 45,
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
            backgroundColor: 'white',
          }} >
            <Text style={{ fontSize: 13 }}>{isHeading ? 'Heading 1' : isHeading2 ? 'Heading 2' : 'Paragraph'}</Text>
            <Image source={require('@/assets/images/home/greyDownArrow.png')} style={{ width: 10, height: 8 }} />
          </Pressable>
        </Portal>
      )}

      <Pressable
        ref={buttonRef}
        style={({ pressed }) => [
          {
            borderWidth: 1,
            borderColor: '#f5f5f5',
            borderRadius: 6,
            height: 45,
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
  const [changeAddImage, setChangeAddImage] = React.useState(false);
  const [undo, setUndo] = React.useState(false);
  const [redo, setRedo] = React.useState(false);
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const [isOrderedList, setIsOrderedList] = React.useState(false);
  const [changeOrderedList, setChangeOrderedList] = React.useState(false); // Fixed: renamed from orderedList
  const [isUnorderedList, setIsUnorderedList] = React.useState(false);
  const [changeUnorderedList, setChangeUnorderedList] = React.useState(false); // Fixed: renamed from unorderedList
  console.log(canUndo, 'this is can undo', canRedo, 'this is can redo');
  const router = useRouter();
  const [editorState, setEditorState] = React.useState<string | null>(null);
  const [plainText, setPlainText] = React.useState("");

  return (
    <>
      <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 57, paddingBottom: 172 }}>
        <Header
          title='Post Content'
          onBackPress={() => router.back()}
        />
        <TextEditor
          setPlainText={setPlainText}
          setEditorState={setEditorState}
          changeBold={changeBold}
          setIsBold={setIsBold}
          changeItalic={changeItalic}
          setIsItalic={setIsItalic}
          changeUnderline={changeUnderline}
          setIsUnderline={setIsUnderline}
          changeCodeBlock={changeCodeBlock}
          changeAddImage={changeAddImage}
          changeHighlight={changeHighlight}
          setIsHighlight={setIsHighlight}
          changeHeading={changeHeading}
          setIsHeading={setIsHeading}
          changeHeading2={changeHeading2}
          setIsHeading2={setIsHeading2}
          undo={undo}
          redo={redo}
          setCanUndo={setCanUndo}
          setCanRedo={setCanRedo}
          changeOrderedList={changeOrderedList} // Fixed: now using correct state variable
          changeUnorderedList={changeUnorderedList} // Fixed: now using correct state variable
          setIsOrderedList={setIsOrderedList}
          setIsUnorderedList={setIsUnorderedList}
        />
      </View>

      <View style={{ position: 'absolute', bottom: 80, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#eeeeee' }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 16, padding: 16, }}>
          {
            canUndo && (
              <ImageFormatButton
                onPress={() => setUndo(!undo)}
                active={false}
                icon={require('@/assets/images/talks/createPost/undo.png')}
                title=''
              />
            )
          }
          {
            canRedo && (
              <ImageFormatButton
                onPress={() => setRedo(!redo)}
                active={false}
                icon={require('@/assets/images/talks/createPost/redo.png')}
                title=''
              />
            )
          }
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
            onPress={() => setChangeBold(!changeBold)}
            active={isBold}
            toggleable
            title=''
            icon={require('@/assets/images/talks/createPost/bold.png')}
          />
          <ImageFormatButton
            onPress={() => setChangeItalic(!changeItalic)}
            active={isItalic}
            toggleable
            title=''
            icon={require('@/assets/images/talks/createPost/italic.png')}
          />
          <ImageFormatButton
            onPress={() => setChangeUnderline(!changeUnderline)}
            active={isUnderline}
            toggleable
            title=''
            icon={require('@/assets/images/talks/createPost/underline.png')}
          />
          <ImageFormatButton
            onPress={() => setChangeAddImage(!changeAddImage)}
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
            onPress={() => setChangeHighlight(!changeHighlight)}
            active={isHighlight}
            title="Highlight"
            toggleable
          />
          <FormatButton
            onPress={() => setChangeCodeBlock(!changeCodeBlock)}
            active={false}
            title="Code"
          />
          <FormatButton
            onPress={() => setChangeHeading(!changeHeading)}
            active={isHeading}
            title="H1"
            toggleable
          />
        </ScrollView>
      </View>

      <BottomFixedSingleButton>
        <BlueButton
          title='Save'
        />
      </BottomFixedSingleButton>
    </>
  );
}
