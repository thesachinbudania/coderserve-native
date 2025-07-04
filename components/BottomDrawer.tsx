import { Portal } from '@gorhom/portal';
import RBSheet from 'react-native-raw-bottom-sheet';

export default function BottomDrawer({ sheetRef, children, draggableIconHeight = 3, height = 600 }: { draggableIconHeight?: number, height?: number, sheetRef: React.RefObject<any>, children: React.ReactNode }) {
  return (
    <Portal>
      <RBSheet
        ref={sheetRef}
        height={height}
        draggable={true}
        customStyles={{
          wrapper: {
            height: '75%',
          },
          draggableIcon: {
            backgroundColor: '#eee',
            height: draggableIconHeight,
          },
          container: {
            backgroundColor: 'white',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: 16,
          }
        }}
      >
        {children}
      </RBSheet>
    </Portal>
  )
}
