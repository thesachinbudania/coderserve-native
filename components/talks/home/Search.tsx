import { ScrollView, View, Text, Pressable, Keyboard, Image, StyleSheet } from 'react-native'
import ImageLoader from '@/components/ImageLoader';
import SearchBar from '@/components/profile/SearchBar';
import { useRouter } from 'expo-router';
import React from 'react';


export default function Search({ search, setSearch, isSearchFocused, setIsSearchFocused, searchResults }: { search: string, setSearch: React.Dispatch<React.SetStateAction<string>>, isSearchFocused: boolean, setIsSearchFocused: React.Dispatch<React.SetStateAction<boolean>>, searchResults: Array<{ first_name: string, last_name: string, username: string, profile_image: string }> }) {
  const router = useRouter();
  const onSubmit = () => {
    Keyboard.dismiss();
    if (search && search.trim().length > 0) {
      router.push('/(protected)/talks/searchResults/' + search);
      setSearch('');
      setIsSearchFocused(false);
    }
  }
  return (
    <>
      <SearchBar
        text={search}
        onChangeText={setSearch}
        isFocused={isSearchFocused}
        setIsFocused={setIsSearchFocused}
        onSubmitEditing={onSubmit}
      />
      <ScrollView keyboardShouldPersistTaps="always" style={{ height: '100%', gap: 0, paddingTop: 24, paddingHorizontal: 16, width: '100%', backgroundColor: 'white', display: isSearchFocused ? 'flex' : 'none' }} >
        {
          search.length > 0 && (
            <Pressable
              style={{ flexDirection: 'row', gap: 8, marginBottom:24}}
              onPress={() => {
                setSearch("");
                Keyboard.dismiss();
                router.push('/(protected)/talks/searchResults/' + search);
              }}
            >
              <Image source={require('@/assets/images/profile/searchIcon.png')} style={{ height: 20, width: 20 }} />
              <Text style={{ fontSize: 15 }}>{search}</Text>
            </Pressable>
          )
        }
        {searchResults.length > 0 &&
          searchResults.map((data, index) => (
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
              <View style={{ gap: 8}}>
                <Text style={styles.name}>{data.first_name} {data.last_name}</Text>
                <Text style={styles.time}>@{data.username}</Text>
              </View>
            </Pressable>
          ))
        }
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
  },
  time: {
    fontSize: 12,
    color: "#737373",
  },
})
