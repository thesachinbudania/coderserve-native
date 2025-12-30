import { useGlobalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, Image, TextInput, StyleSheet, ScrollView, Pressable, Platform, TouchableWithoutFeedback, Text, View, Keyboard } from 'react-native';
import protectedApi from '@/helpers/axios';
import { Post } from '@/app/(protected)/talks';
import BottomName from '@/components/profile/home/BottomName';
import { useRouter } from 'expo-router';
import ImageLoader from '@/components/ImageLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
import OptionChip from '@/components/general/OptionChip';
import errorHandler from '@/helpers/general/errorHandler';


function SearchBar({ text = '', onChangeText, isFocused, setIsFocused, placeholder = null, placholderText = [], onSubmitEditing }: { onSubmitEditing?: () => void, text?: string, onChangeText: React.Dispatch<React.SetStateAction<string>>, isFocused: boolean, placeholder?: string | null, placholderText?: string[], setIsFocused: React.Dispatch<React.SetStateAction<boolean>> }) {
  const inputRef = React.useRef<TextInput>(null);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  React.useEffect(() => {
    if (isFocused) {
      const timeout = setTimeout(() => handleFocus(), 100);
      return () => clearTimeout(timeout);
    }
  }, [isFocused])

  return (
    <TouchableWithoutFeedback onPress={() => setIsFocused(true)}>
      <View
        style={[styles.container,]}
      >
        {(!placeholder || isFocused) && (
          <Image source={require('@/assets/images/profile/searchIcon.png')} style={styles.searchIcon} />
        )}
        <TextInput
          ref={inputRef}
          style={[styles.input, { borderColor: '#eeeeee' }, { borderWidth: 0, borderColor: '#eeeeee', borderBottomWidth: 1, borderRadius: 0, height: 62 }]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={!isFocused && placeholder ? placeholder : (placholderText.length > 0 && !isFocused ? '' : 'Search')}
          value={text}
          onChangeText={onChangeText}
          placeholderTextColor={!isFocused && placeholder ? '#cbe1ff' : '#d9d9d9'}
          onSubmitEditing={onSubmitEditing}
        />
      </View >
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    height: 45,
    paddingLeft: 43,
    fontSize: 15,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'white'
  },
  searchIcon: {
    height: 20,
    width: 20,
    position: 'absolute',
    left: 12,
    zIndex: 1
  },
  container: {
    justifyContent: 'center',
  },
  placeholderText: {
    position: 'absolute',
    top: 13,
    left: 43,
  },
  headContainer: {
    flexDirection: "row",
    gap: 16,
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

export default function Search() {
  const { query } = useGlobalSearchParams() as { query: string };
  const [search, setSearch] = React.useState(query || '');
  const [isFocused, setIsFocused] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchResults, setSearchResults] = React.useState<any>([]);
  const [filter, setFilter] = React.useState(0)
  const [searchTerms, setSearchTerms] = React.useState<any>([]);


  const router = useRouter();
  const { height } = Dimensions.get('window');

  React.useEffect(() => {
    const fetchSearchResults = async () => {
      if (search.trim() === "" || search.length < 3) {
        setSearchTerms([]);
        return;
      }
      try {
        const response = await protectedApi.get(`talks/search_suggestions/?q=${encodeURIComponent(search)}`);
        const data = await response.data;
        setSearchTerms(data);
      } catch (error: any) {
        errorHandler(error, false);
        console.error("Error fetching search results:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults();
    }, 300); // Adjust the debounce delay as needed

    return () => clearTimeout(delayDebounceFn);
  }, [search]);



  // set is focused to false when the keyboard is dismissed
  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsFocused(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsFocused(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const fetchSearchResults = async (q: string, filter: string) => {
    try {
      setIsLoading(true);
      const response = await protectedApi.get('/talks/search/', {
        params: {
          q: q,
          filter: filter
        }
      });
      setSearchResults(response.data);
    } catch (error: any) {
      errorHandler(error);
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    fetchSearchResults(
      search,
      'posts'
    );
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Pressable style={{ flex: 1, backgroundColor: "#fff" }}
        onPress={Platform.OS === 'ios' ? () => Keyboard.dismiss() : undefined}
      >
        <SearchBar
          text={search}
          onChangeText={setSearch}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          onSubmitEditing={() => {
            Keyboard.dismiss();
            fetchSearchResults(
              search,
              filter === 0 ? 'posts' : 'accounts'
            );
          }}
        />
        <ScrollView style={{ height: '100%', paddingTop: 24, paddingHorizontal: 16, width: '100%', backgroundColor: 'white', display: isFocused ? 'flex' : 'none' }} >
          {
            search.length > 0 && (
              <Pressable
                style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}
                onPress={() => {
                  Keyboard.dismiss();
                  fetchSearchResults(search, filter === 0 ? 'posts' : 'accounts');
                }}
              >
                <Image source={require('@/assets/images/profile/searchIcon.png')} style={{ height: 20, width: 20 }} />
                <Text style={{ fontSize: 15 }}>{search}</Text>
              </Pressable>
            )
          }
          {searchTerms.length > 0 &&
            searchTerms.map((data: any, index: number) => (
              <Pressable
                key={index}
                style={[styles.headContainer, { paddingVertical: 8 }]}
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
            ))
          }
        </ScrollView>
        {
          !isFocused && (
            <View style={{ paddingBottom: 8, backgroundColor: "#f5f5f5" }}>
              <View style={{ padding: 16, flexDirection: 'row', gap: 16, backgroundColor: 'white' }}>
                <OptionChip
                  title="Posts"
                  selected={filter === 0}
                  onPress={() => {
                    setFilter(0);
                    fetchSearchResults(search, 'posts');
                  }}
                />
                <OptionChip
                  title="Accounts"
                  selected={filter === 1}
                  onPress={() => {
                    setFilter(1);
                    fetchSearchResults(search, 'accounts');
                  }}
                />
                <OptionChip
                  title="Companies"
                />
              </View>
            </View>
          )
        }
        {
          !isFocused && (
            isLoading ?
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color={'#202020'} />
              </View> :
              <View>
                {
                  searchResults.results.length > 0 ? (
                    filter === 0 ? (
                      <ScrollView style={{ height: height - 172 }}>
                        {searchResults.results.map((post: any) => {
                          return (
                            <View style={{ paddingBottom: 8, backgroundColor: '#f5f5f5' }} key={post.id}>
                              <Post key={post.id} data={post} />
                            </View>
                          )
                        })}
                        <View style={{ backgroundColor: 'white' }}>
                          <BottomName />
                        </View>
                      </ScrollView>
                    ) : (
                      <ScrollView style={{ height: height - 172, backgroundColor: 'white' }}>
                        {searchResults.results.map((user: any) => (
                          <Pressable
                            key={user.id}
                            style={[styles.headContainer, { paddingHorizontal: 16, paddingVertical: 8 }]}
                            onPress={() => {
                              setSearch("");
                              Keyboard.dismiss();
                              router.push('/(freeRoutes)/profile/userProfile/' + user.username);
                            }}
                          >
                            <View>
                              <ImageLoader
                                size={54}
                                uri={user.profile_image}
                              />
                            </View>
                            <View style={{ gap: 8 }}>
                              <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
                              <Text style={styles.time}>@{user.username}</Text>
                            </View>
                          </Pressable>
                        ))}
                        {
                          searchResults.results.length > 8 && <BottomName />
                        }
                      </ScrollView>
                    )
                  ) : (
                    <ScrollView contentContainerStyle={{ height: height - 172, alignItems: 'center', backgroundColor: 'white', paddingTop: 192 }}>
                      <Image source={require('@/assets/images/stars.png')} style={{ height: 128, width: 128, marginBottom: 16 }} />
                      <Text style={{ marginTop: 16, fontSize: 11, color: "#a6a6a6", textAlign: 'center', paddingHorizontal: 16 }}>{
                        filter === 0 ?
                          'No Posts found. Looks like there are no posts matching your search. Try different keywords or check for typos.'
                          : "No Accounts Found. We couldn't find any user accounts with that name or username. Try searching differently or check for typos."
                      }</Text>
                    </ScrollView>
                  )}
              </View>)
        }
      </Pressable>
    </SafeAreaView>
  )
}

