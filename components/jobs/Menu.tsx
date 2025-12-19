import { Pressable, View, StyleSheet, Text } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import * as Haptics from 'expo-haptics';


export function MenuButton({ dark = false, onPress = () => { }, heading, text }: { dark?: boolean, heading: string, text: string, onPress?: () => void }) {
  return (
    <Pressable onPress={() => {
      Haptics.selectionAsync();
      onPress();
    }}>
      {
        ({ pressed }) => !dark ? (
          <View style={[countrySelectStyles.container, pressed && { borderColor: '#006dff' }]}>
            <Text style={styles.menuButtonHeading}>{heading}</Text>
            <Text style={styles.menuButtonText}>{text}</Text>
          </View>

        ) : (
          <LinearGradient
            colors={pressed ? ['#0b53ff', '#da85ff'] : ['#000000', '#3e3e3e']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={[countrySelectStyles.container, { padding: 16 }]}
          >
            <Text style={[styles.menuButtonHeading, dark && { color: 'white' }]}>{heading}</Text>
            <Text style={[styles.menuButtonText, dark && { color: 'white' }]}>{text}</Text>
          </LinearGradient>
        )
      }
    </Pressable>
  )
}

const countrySelectStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pin: {
    height: 15,
    width: 15,
  },
  countryName: {
    fontSize: 12,
    color: "#737373",
  }
})

export default function Menu({ menuRef, children }: { children?: React.ReactNode, menuRef: React.RefObject<any> }) {
  return (
    <RBSheet
      ref={menuRef}
      height={392}
      closeOnPressMask
      customStyles={{
        container: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 16,
        },
        draggableIcon: {
          backgroundColor: '#000',
        }
      }}
    >
      <View style={styles.menuContainer}>
        {children}
      </View>
    </RBSheet>
  )
}


const styles = StyleSheet.create({
  menuContainer: {
    gap: 16,
  },
  menuButtonHeading: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  menuButtonText: {
    fontSize: 12,
    color: '#737373',
    marginTop: 8,
  },
})
