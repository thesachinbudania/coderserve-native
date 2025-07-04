import RBSheet from 'react-native-raw-bottom-sheet';
import { Portal } from '@gorhom/portal';


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
      {children}
    </RBSheet>
  )
}
