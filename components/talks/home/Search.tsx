import { View, Text, Pressable, Keyboard, Image, StyleSheet } from 'react-native'
import ImageLoader from '@/components/ImageLoader';
import SearchBar from '@/components/profile/SearchBar';
import { useRouter } from 'expo-router';
import React from 'react';


export default function Search({ search, setSearch, isSearchFocused, setIsSearchFocused, searchResults }: { search: string, setSearch: React.Dispatch<React.SetStateAction<string>>, isSearchFocused: boolean, setIsSearchFocused: React.Dispatch<React.SetStateAction<boolean>>, searchResults: Array<{ first_name: string, last_name: string, username: string, profile_image: string }> }) {
  const router = useRouter();
  return (
    <>
      <SearchBar
        text={search}
        onChangeText={setSearch}
        isFocused={isSearchFocused}
        setIsFocused={setIsSearchFocused}
      />
      <View style={{ height: '100%', gap: 16, paddingTop: 24, paddingHorizontal: 16, width: '100%', backgroundColor: 'white', display: isSearchFocused ? 'flex' : 'none' }} >
        {
          search.length > 0 && (
            <Pressable
              style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}
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
              <ImageLoader
                size={48}
                uri={data.profile_image}
              />
              <View style={{ gap: 6 }}>
                <Text style={styles.name}>{data.first_name} {data.last_name}</Text>
                <Text style={styles.time}>@{data.username}</Text>
              </View>
            </Pressable>
          ))
        }
      </View>
    </>
  )
}


const styles = StyleSheet.create({
  headContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
  },
  time: {
    fontSize: 11,
    color: "#737373",
  },
})
