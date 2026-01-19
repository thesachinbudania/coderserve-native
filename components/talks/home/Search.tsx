import { ScrollView, View, Text, Pressable, Keyboard, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import ImageLoader from '@/components/ImageLoader';
import SearchBar from '@/components/profile/SearchBar';
import { useRouter } from 'expo-router';
import React from 'react';

type SearchProps = {
  search: string,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  isSearchFocused: boolean,
  setIsSearchFocused: React.Dispatch<React.SetStateAction<boolean>>,
  searchResults: Array<{ first_name: string, last_name: string, username: string, profile_image: string }>
  searchQueries?: string[],
  ResultComponent?: (data: any) => JSX.Element,
  onSubmit?: () => void
}


export default function Search({ search, setSearch, isSearchFocused, onSubmit, setIsSearchFocused, searchResults, searchQueries = [], ResultComponent }: SearchProps) {
  const router = useRouter();
  return (
    <>
      <SearchBar
        text={search}
        onChangeText={setSearch}
        isFocused={isSearchFocused}
        setIsFocused={setIsSearchFocused}
        onSubmitEditing={onSubmit}
        unfocusOnBlur={false}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ height: '100%', gap: 0, paddingTop: 24, paddingHorizontal: 16, width: '100%', backgroundColor: 'white', display: isSearchFocused ? 'flex' : 'none' }}
      >
        <TouchableWithoutFeedback onPress={() => setIsSearchFocused(false)}>
          <View style={{ flex: 1, minHeight: '100%' }}>
            {
              search.length > 0 && !ResultComponent && (
                <Pressable
                  style={{ flexDirection: 'row', gap: 8, marginBottom: 16, alignItems: 'center' }}
                  onPress={() => {
                    setSearch("");
                    Keyboard.dismiss();
                    router.push('/(protected)/talks/searchResults/' + search);
                  }}
                >
                  {
                    ({ pressed }) => (
                      <>
                        <Image source={require('@/assets/images/searchIcon.png')} style={{ height: 15, width: 15 }} />
                        <Text style={{ fontSize: 15, lineHeight: 15, color: pressed ? '#006dff' : '#000000' }}>{search}</Text>
                      </>
                    )
                  }

                </Pressable>
              )
            }
            {
              searchQueries.length > 0 && searchQueries.map((data: string, index: number) => (
                <Pressable
                  style={{ flexDirection: 'row', gap: 8, marginTop: 8, marginBottom: 16, alignItems: 'center' }}
                  onPress={() => {
                    setSearch(data);
                    Keyboard.dismiss();
                    router.push('/(protected)/talks/searchResults/' + data);
                  }}
                  key={index}
                >
                  {
                    ({ pressed }) => (
                      <>
                        <Image source={require('@/assets/images/searchIcon.png')} style={{ height: 15, width: 15 }} />
                        <Text style={{ fontSize: 15, lineHeight: 15, color: pressed ? '#006dff' : '#000000' }}>{data}</Text>
                      </>
                    )
                  }

                </Pressable>
              ))
            }
            {searchResults.length > 0 &&
              <View style={{ gap: 0 }}>
                {searchResults.map((data, index) => (
                  ResultComponent ? <View key={index}><ResultComponent data={data} /></View> : (
                    <Pressable
                      key={index}
                      style={styles.headContainer}
                      onPress={() => {
                        setSearch("");
                        Keyboard.dismiss();
                        router.push('/(freeRoutes)/profile/userProfile/' + data.username);
                      }}
                    >
                      <View>
                        <ImageLoader
                          size={54}
                          uri={data.profile_image}
                        />
                      </View>
                      <View style={{ gap: 8 }}>
                        <Text style={styles.name}>{data.first_name} {data.last_name}</Text>
                        <Text style={styles.time}>@{data.username}</Text>
                      </View>
                    </Pressable>
                  )
                ))}
              </View>
            }
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  headContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 15,
  },
  time: {
    fontSize: 12,
    color: "#737373",
    lineHeight: 12,
  },
})
