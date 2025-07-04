import TextEditor from '@/components/talks/createPost/Editor';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
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

function FormatButton({ onPress, active, title, toggleable = false }: FormatButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [{ borderWidth: 1, borderRadius: 6, height: 45, width: 45, alignItems: 'center', justifyContent: 'center', },
      active && { backgroundColor: '#006dff', borderColor: '#006dff' }, !toggleable && pressed && { backgroundColor: '#006dff', borderColor: '#006dff' }]}
      onPress={onPress}
    >
      {
        ({ pressed }) => (
          <Text style={[(active) && { color: 'white' }, !toggleable && pressed && { color: 'white' }]}>{title}</Text>
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
          <FormatButton
            onPress={() => setChangeBold(!changeBold)}
            active={isBold}
            title='B'
            toggleable
          />
          <FormatButton
            onPress={() => setChangeItalic(!changeItalic)}
            active={isItalic}
            title="I"
            toggleable
          />
          <FormatButton
            onPress={() => setChangeUnderline(!changeUnderline)}
            active={isUnderline}
            title="U"
            toggleable
          />
          <FormatButton
            onPress={() => setUndo(!undo)}
            active={false}
            title="Undo"
          />
          <FormatButton
            onPress={() => setRedo(!redo)}
            active={false}
            title="Redo"
          />
          <FormatButton
            onPress={() => setChangeCodeBlock(!changeCodeBlock)}
            active={false}
            title="Code"
          />
          <FormatButton
            onPress={() => setChangeAddImage(!changeAddImage)}
            active={false}
            title="Img"
          />
          <FormatButton
            onPress={() => setChangeHighlight(!changeHighlight)}
            active={isHighlight}
            title="H"
            toggleable
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
