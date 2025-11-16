import RBSheet from 'react-native-raw-bottom-sheet';
import {View, TouchableWithoutFeedback, Keyboard} from 'react-native';


export default function BottomSheet({ height, children, menuRef }: { height: number, children: React.ReactNode, menuRef: React.RefObject<any> }) {
  return (
    <RBSheet
      ref={menuRef}
      height={height}
      closeOnPressMask
      customStyles={{
        container: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 16,
        },
        draggableIcon: {
          backgroundColor: "#000",
        },
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
      {children}
      </View>
      </TouchableWithoutFeedback>
    </RBSheet>
  )
}
