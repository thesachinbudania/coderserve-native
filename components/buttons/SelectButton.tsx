import {Pressable, View, Text, StyleSheet} from 'react-native';
import * as Haptics from 'expo-haptics';

export default function SelectButton({ title, subTitle, selected, setSelected, index }: { index: number, title: string, subTitle: string, selected: boolean, setSelected: React.Dispatch<React.SetStateAction<number | null>> }) {
  return (
    <Pressable onPress={
      () => {
        Haptics.selectionAsync();
        setSelected(index);
      }
    }>
      {
        <View style={[buttonStyles.container, selected && { backgroundColor: '#202020' }]}>
          <View style={[buttonStyles.selectCircle, selected && { borderColor: 'white' }]}>
          </View>
          <View >
            <Text style={[buttonStyles.heading, selected && { color: 'white' }]}>{title}</Text>
            <Text style={buttonStyles.text}>{subTitle}</Text>
          </View>
        </View>
      }
    </Pressable>
  )
}


const buttonStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 16
  },
  selectCircle: {
    borderWidth: 3,
    borderColor: '#a6a6a6',
    borderRadius: 50,
    height: 16,
    width: 16
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 13,
    color: '#a6a6a6',
    paddingRight: 16,
    marginTop: 4
  }
})