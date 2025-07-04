import PopUp from '@/components/messsages/PopUp';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import BlueButton from '@/components/buttons/BlueButton';
import GreyBgButton from '@/components/buttons/GreyBgButton';

const { width } = Dimensions.get('window');

export default function PopUpMessage({ heading, buttonText = null, text, visible, setVisible, singleButton = false, onPress, isLoading = false }: { buttonText?: string | null, heading: string, text: string, visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>>, onPress: () => void, isLoading?: boolean, singleButton?: boolean }) {
  return (
    <PopUp
      visible={visible}
      setVisible={setVisible}
    >
      <Text style={styles.popUpHeading}>{heading}</Text>
      <Text style={styles.popUpText}>{text}</Text>
      {
        singleButton ?
          <BlueButton
            title={buttonText ? buttonText : 'Okay'}
            loading={isLoading}
            onPress={onPress}
          /> : <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ width: ((width - 80) / 2) }}>
              <GreyBgButton
                title='Cancel'
                onPress={() => setVisible(false)}
              />
            </View>
            <View style={{ width: ((width - 80) / 2) }}>
              <BlueButton
                title={buttonText ? buttonText : 'Yes, Update'}
                onPress={onPress}
                loading={isLoading}
              />
            </View>
          </View>

      }
    </PopUp>

  )
}


const styles = StyleSheet.create({
  popUpHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  popUpText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 32,
    color: '#737373',
  },
})
