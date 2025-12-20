import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';


export default function Checkbox({ children, state, size = 'sm', setState }: { children?: React.ReactNode, size?: 'sm' | 'md' | 'lg', state: boolean, setState: React.Dispatch<React.SetStateAction<boolean>> }) {

  const handleCheckboxChange = () => {
    setState(!state);
  };

  return (
    <TouchableOpacity
      onPress={handleCheckboxChange}
    >
      <View style={styles.container}>
        <View style={[styles.checkbox, size === 'md' && { height: 20, width: 20, borderRadius: 6 }]}>
          {state && (
            <Image source={require('./assets/check.png')} style={size === 'sm' ? { height: 12, width: 12 } : size === 'md' && { height: 13, width: 13 }} />
          )}
        </View>
        {children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 18,
    width: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  }
})
