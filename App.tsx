import { StatusBar, View, StyleSheet } from 'react-native';
import { PortalProvider } from '@gorhom/portal';
import { store, persistor } from './app/store';
import { Provider } from 'react-redux';
import AuthProvider from './AuthProvider';
import { PersistGate } from 'redux-persist/integration/react';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';


export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar
          barStyle='dark-content'
          backgroundColor='#0d0d0d'
        />
        <View style={styles.container}>
          <PortalProvider>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <AuthProvider />
              </PersistGate>
            </Provider>
          </PortalProvider>
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
});
