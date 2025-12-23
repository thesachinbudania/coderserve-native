import { useState } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BottomDrawer({
  sheetRef,
  children,
  draggableIconHeight = 3,
  height,
  onClose = () => { },
  closeOnPressMask = true,
}: {
  draggableIconHeight?: number,
  closeOnPressMask?: boolean,
  sheetRef: React.RefObject<any>,
  children: React.ReactNode,
  height?: number,
  onClose?: () => void,
}) {

  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      {/* Invisible off-screen measurement */}
      <View
        style={styles.offscreen}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          const maxHeight = SCREEN_HEIGHT * 0.85; // cap
          setMeasuredHeight(bottom > 0 ? Math.min(h, maxHeight) + bottom + 16 : Math.min(h, maxHeight) + 32);
        }}
      >
        {children}
      </View>

      {/* Actual Bottom Sheet WITH perfect height */}
      <RBSheet
        ref={sheetRef}
        height={height ? height : measuredHeight ?? 200} // fallback until measured
        closeOnPressMask={closeOnPressMask}
        draggable={true}
        onClose={onClose}
        customStyles={{
          wrapper: { height: "75%" },
          draggableIcon: {
            backgroundColor: "#eee",
            height: draggableIconHeight,
            marginTop: 8,
          },
          container: {
            backgroundColor: "white",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            width: "100%",
          },
        }}
      >
        {children}
      </RBSheet>
    </>
  );
}

const styles = StyleSheet.create({
  offscreen: {
    position: "absolute",
    top: -9999,
    left: -9999,
    opacity: 0,
    width: SCREEN_WIDTH,
  },
});
