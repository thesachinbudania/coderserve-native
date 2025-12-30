import { Alert, Text, Pressable, View, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import React from 'react';
import GreyBgButton from '../../components/buttons/GreyBgButton';
import SearchBar from '../../components/form/SearchBar';
import LinearGradient from 'react-native-linear-gradient';
import * as Haptics from 'expo-haptics';
import BottomDrawer from '../BottomDrawer';
import BottomSheet from '../messsages/BottomSheet';

function MultiTextGreyBgButton({ title, disabled = false, onPress = () => { }, loading = false }: { title: string[], disabled?: boolean, onPress?: () => void, loading?: boolean },) {
  return (
    <Pressable onPress={() => {
      if (!disabled) {
        Haptics.selectionAsync();
        onPress();
      }
    }} key={loading.toString()} pointerEvents={'auto'}>
      {
        ({ pressed }) => (
          <LinearGradient
            colors={disabled ? ['#f5f5f5', '#f5f5f5'] : (pressed ? ['#202020', '#202020'] : ['#f5f5f5', '#f5f5f5'])}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={buttonStyles.graident}
          >
            {
              loading ? <ActivityIndicator color='white' /> : (
                <View style={buttonStyles.textContainer}>
                  <Text style={[buttonStyles.text, { fontWeight: 'normal' }, pressed && { color: 'white' }, disabled && { color: '#d9d9d9' }]}>{title[0]}</Text>
                  <Text style={[buttonStyles.text, { fontWeight: 'normal' }, pressed && { color: 'white' }, disabled && { color: '#d9d9d9' }]}>{title[1]}</Text>
                </View>
              )
            }
          </LinearGradient>

        )
      }
    </Pressable>
  )
}


const buttonStyles = StyleSheet.create({
  graident: {
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    height: 45,
  },
  text: {
    fontSize: 14,
    color: 'black',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  }
})

export default function SelectMenu({ allowSearch = true, error = false, placeholder, options, selected, onSelect, title = null }: { allowSearch?: boolean, error?: boolean | string, placeholder: string, options: string[] | string[][], selected: string | null, title?: string | null, onSelect: React.Dispatch<React.SetStateAction<string | null>> }) {
  const sheetRef = React.useRef<any>(null);
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <>
      <Pressable onPress={error ? () => {
        Alert.alert(error.toString());
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } : () => {
        Haptics.selectionAsync();
        sheetRef.current?.open();
      }
      }>
        {({ pressed }) => (
          <View style={[styles.menuBox, pressed && { borderColor: '#006dff' }]}>
            <Text style={[styles.boxText, selected && { color: 'black' }]}>{selected ? selected : placeholder}</Text>
            <Image source={pressed ? require('./assets/downArrowBlue.png') : require('./assets/downArrowBlack.png')} style={styles.downArrow} />
          </View>
        )}
      </Pressable>
      <BottomDrawer
        sheetRef={sheetRef}
        height={600}
      >
        <View style={styles.menu}>
          <Text style={styles.menuHeading}>{title ? title : placeholder}</Text>
          {allowSearch && (
            <SearchBar
              onChangeText={setSearchValue}
              forSelectMenu
            />
          )}

          {
            options.length === 0 ? (
              <ActivityIndicator color='#006dff' />
            ) : (
              <ScrollView
                nestedScrollEnabled={false}
                scrollToOverflowEnabled={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
              >
                <View style={{ gap: 16, marginBottom: 156 }}>
                  {
                    typeof options[0] === 'string' ? (
                      options.filter((option) => (
                        typeof option === 'string' && option.toLowerCase().includes(searchValue.toLowerCase()))).map((option, index) => (
                          <GreyBgButton
                            key={index}
                            title={typeof option === 'string' ? option : ''}
                            onPress={() => {
                              sheetRef.current?.close();
                              onSelect(typeof option === 'string' ? option : '');
                            }}
                            bold={false}
                          />
                        ))
                    ) : (
                      options.filter((option) => (
                        typeof option != 'string' && option[0].toLowerCase().includes(searchValue.toLowerCase()))).map((option, index) => (
                          <MultiTextGreyBgButton
                            key={index}
                            title={typeof option != 'string' ? option : ['']}
                            onPress={() => {
                              sheetRef.current?.close();
                              onSelect(typeof option === 'string' ? option : option[1])
                            }}
                          />
                        ))

                    )

                  }
                </View>
              </ScrollView>

            )
          }
        </View>
      </BottomDrawer>
    </>
  )
}


const styles = StyleSheet.create({
  menuBox: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
  },
  boxText: {
    fontSize: 14,
    color: '#cfdbe6',
    paddingLeft: 13,
  },
  downArrow: {
    height: 16,
    width: 16,
    marginRight: 12,
  },
  menuHeading: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 16,
  },
  menu: {
    gap: 24,
    paddingHorizontal: 16,
  }
})
