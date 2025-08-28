import TextEditor from '@/components/talks/createPost/Editor';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import Header from '@/components/general/Header';
import { useRouter } from 'expo-router';
import BottomFixedSingleButton from '@/components/general/BottomFixedContainer';
import BlueButton from '@/components/buttons/BlueButton';

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
      style={({ pressed }) => [{ borderWidth: 1, borderRadius: 6, height: 45, width: 45, alignItems: 'center', justifyContent: 'center', },
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
      style={({ pressed }) => [{ borderWidth: 1, borderRadius: 6, height: 45, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', },
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
  const [changeCodeBlock, setChangeCodeBlock] = React.useState(false);
  const [changeAddImage, setChangeAddImage] = React.useState(false);
  const [undo, setUndo] = React.useState(false);
  const [redo, setRedo] = React.useState(false);
  const [isOrderedList, setIsOrderedList] = React.useState(false);
  const [orderedList, setOrderedList] = React.useState(false);
  const [isUnorderedList, setIsUnorderedList] = React.useState(false);
  const [unorderedList, setUnorderedList] = React.useState(false);
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
          undo={undo}
          redo={redo}
        />

      </View>
      <View style={{ position: 'absolute', bottom: 80, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#eeeeee' }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 16, padding: 16, }}>
          <ImageFormatButton
            onPress={() => setUndo(!undo)}
            active={false}
            icon={require('@/assets/images/talks/createPost/undo.png')}
            title=''
          />
          <ImageFormatButton
            onPress={() => setRedo(!redo)}
            active={false}
            icon={require('@/assets/images/talks/createPost/redo.png')}
            title=''
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
          {/* --- ADDED LIST BUTTONS --- */}
          <ImageFormatButton
            onPress={() => setUnorderedList(!unorderedList)}
            active={isUnorderedList}
            toggleable
            title=''
            icon={require('@/assets/images/talks/createPost/unorderedList.png')} // Replace with your icon
          />
          <ImageFormatButton
            onPress={() => setOrderedList(!orderedList)}
            active={isOrderedList}
            toggleable
            title=''
            icon={require('@/assets/images/talks/createPost/orderedList.png')} // Replace with your icon
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
