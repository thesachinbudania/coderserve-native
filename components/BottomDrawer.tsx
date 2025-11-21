import { useState } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function BottomDrawer({
  sheetRef,
  children,
  draggableIconHeight = 3,
}: {
  draggableIconHeight?: number,
  sheetRef: React.RefObject<any>,
  children: React.ReactNode
}) {
  
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  return (
    <>
      {/* Invisible off-screen measurement */}
      <View
        style={styles.offscreen}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          const maxHeight = SCREEN_HEIGHT * 0.85; // cap
          setMeasuredHeight(Math.min(h, maxHeight) + 32);
        }}
      >
        {children}
      </View>

      {/* Actual Bottom Sheet WITH perfect height */}
      <RBSheet
        ref={sheetRef}
        height={measuredHeight ?? 200} // fallback until measured
        draggable={true}
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
            paddingBottom: 16,
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
  },
});
