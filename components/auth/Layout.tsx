import { Keyboard, View, TouchableWithoutFeedback, Text, ScrollView, StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';


export default function AuthLayout({ title, secondaryText, children }: { title: string, secondaryText: string, children: React.ReactNode }) {
  return (
    <ScrollView style={styles.bg}>
      <StatusBar
        backgroundColor='#0d0d0d'
        barStyle='light-content'
      />
      <SafeAreaView>
        <View style={styles.headingContainer}>
          <Text style={styles.wbText}>{title}</Text>
          <Text style={styles.smallHeading}>{secondaryText}</Text>
        </View>
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
        >
          <View style={{ minHeight: '100%' }}>
            <View style={styles.mainContentView}>
              {children}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#0d0d0d',
  },
  headingContainer: {
    justifyContent: 'center',
    width: '100%',
  },
  wbText: {
    marginTop: 32 + (StatusBar.currentHeight ? StatusBar.currentHeight : 0),
    fontSize: 29,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallHeading: {
    fontSize: 13,
    color: '#737373',
    textAlign: 'center',
    marginTop: 8,
  },
  mainContentView: {
    backgroundColor: 'white',
    marginTop: 48,
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 32,
    minHeight: '100%',
    gap: 48,
    paddingBottom: 80,
    height: '200%',
  }
});
