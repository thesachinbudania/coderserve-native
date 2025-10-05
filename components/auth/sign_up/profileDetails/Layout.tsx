import { TouchableWithoutFeedback, Keyboard, Text, SafeAreaView, StyleSheet, View, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';


export default function Layout({ step, title, subtitle, children }: { step: string, title: string, subtitle: string, children: React.ReactNode }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
        <View style={styles.bodyView}>
          <LinearGradient
            style={styles.chipView}
            colors={['#3a3939', '#000000']}
          >
            <Text style={styles.chipText}>{step}</Text>
          </LinearGradient>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {children}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  chipView: {
    alignSelf: 'flex-start',
    borderRadius: 12,
  },
  chipText: {
    color: 'white',
    fontSize: 11,
    marginVertical: 4,
    marginHorizontal: 12,
  },
  bodyView: {
    marginHorizontal: 16,
    marginTop: 16 + (StatusBar.currentHeight ? StatusBar.currentHeight : 16),
    backgroundColor: 'white',
  },
  title: {
    fontSize: 29,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#a6a6a6',
    marginTop: 8,
    textAlign: 'left',
  }
})
