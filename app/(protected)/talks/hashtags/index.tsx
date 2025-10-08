import { ActivityIndicator, Text, KeyboardAvoidingView, View, FlatList, ListRenderItemInfo } from "react-native";
import PageLayout from "@/components/general/PageLayout";
import SearchBar from "@/components/form/SearchBar";
import React from 'react';
import OptionChip from "@/components/general/OptionChip";
import protectedApi from "@/helpers/axios";
import BottomFixedSingleButton from "@/components/general/BottomFixedContainer";
import { Portal } from "@gorhom/portal";
import BlueButton from "@/components/buttons/BlueButton";
import { useRouter } from "expo-router";
import DefaultButton from "@/components/buttons/NoBgButton";
import BottomSheet from "@/components/messsages/BottomSheet";

export default function Hashtags() {
    const [search, setSearch] = React.useState("");
    const [popularHashtags, setPopularHashtags] = React.useState<any[]>([]);
    const [nextUrl, setNextUrl] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [searching, setSearching] = React.useState(false);
    const [searchResults, setSearchResults] = React.useState<any[] | null>(null);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [selectedHashtags, setSelectedHashtags] = React.useState<string[]>([]);
    const [saving, setSaving] = React.useState(false);
    const [initialHashtags, setInitialHashtags] = React.useState<string[]>([]);
    const router = useRouter();

    const sheetRef = React.useRef<any>(null);


    const arraysEqual = (a: string[], b: string[]) => {
        const aa = [...(a || [])].sort();
        const bb = [...(b || [])].sort();
        return aa.length === bb.length && aa.every((v, i) => v === bb[i]);
    };

    React.useEffect(() => {
        const fetchPopularHashtags = async () => {
            setLoading(true);
            try {
                const response = await protectedApi.get("/talks/hashtags/popular/");
                setPopularHashtags(response.data.results || []);
                setNextUrl(response.data.next || null);
            } catch (error) {
                console.error("Error fetching popular hashtags:", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchPopularHashtags();
        // fetch user's current hashtag preferences
        const fetchPreferences = async () => {
            try {
                const resp = await protectedApi.get('/talks/preferences/hashtags/');
                // API returns object with hashtags: [{id, name, count}, ...]
                const names = (resp.data?.hashtags || []).map((h: any) => h.name);
                setSelectedHashtags(names);
                setInitialHashtags(names);
            } catch (err) {
                // silently ignore - user may not have prefs yet
                console.error('Error fetching hashtag preferences', err);
            }
        };

        fetchPreferences();
    }, []);

    // Debounced search effect
    React.useEffect(() => {
        if (!search || search.trim().length < 1) {
            setSearchResults(null);
            setSearching(false);
            return;
        }

        const handle = setTimeout(async () => {
            setSearching(true);
            try {
                const resp = await protectedApi.get(`/talks/hashtags/search/?q=${encodeURIComponent(search)}`);
                const results = resp.data.results || [];
                setSearchResults(results);
            } catch (err) {
                console.error('Error searching hashtags', err);
                setSearchResults([]);
            } finally {
                setSearching(false);
            }
        }, 300);

        return () => clearTimeout(handle);
    }, [search]);

    const orderedHashtags = React.useMemo(() => {
        // Make a map of popular by name for quick lookup (preserve original objects)
        const popularByName = new Map<string, any>();
        popularHashtags.forEach(h => popularByName.set(h.name, h));

        const result: any[] = [];

        // First, push selected hashtags (prefer the object from popular if available, else create minimal object)
        selectedHashtags.forEach(name => {
            if (popularByName.has(name)) {
                result.push(popularByName.get(name));
                popularByName.delete(name); // avoid duplicates
            } else {
                result.push({ id: `sel-${name}`, name });
            }
        });

        // Then push remaining popular hashtags that weren't selected
        for (const h of popularByName.values()) {
            result.push(h);
        }

        return result;
    }, [popularHashtags, selectedHashtags]);

    const onSave = async () => {
        // don't save if already saving or no change
        if (saving) return;
        // if no change, do nothing
        if (arraysEqual(selectedHashtags, initialHashtags)) return;

        setSaving(true);
        try {
            const payload = { hashtags: selectedHashtags };
            const resp = await protectedApi.put('/talks/preferences/hashtags/', payload);
            // update initial to match saved
            const savedNames = (resp.data?.hashtags || []).map((h: any) => h.name);
            setInitialHashtags(savedNames);
            setSelectedHashtags(savedNames);
            sheetRef.current?.open();
        } catch (err) {
            console.error('Error saving hashtag preferences', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <PageLayout
        headerTitle="Hashtags"
        >
            <Text style={{textAlign: 'center', fontWeight: "bold", fontSize: 21}}>Personalize Your Feed</Text>
            <KeyboardAvoidingView behavior="padding" style={{marginTop: 32}} >
            <SearchBar  onChangeText={setSearch}/>
            </KeyboardAvoidingView>
            {
                loading ? 
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
<ActivityIndicator size="large" color="#202020" />
                </View> : (
            <View style={{marginTop: 32}}>
                {searching ? (
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}>
                        <ActivityIndicator />
                    </View>
                ) : (
                <FlatList
                    data={searchResults !== null ? searchResults : orderedHashtags}
                    keyExtractor={(item) => item.id?.toString() ?? item.name}
                    numColumns={3}
                    columnWrapperStyle={{ justifyContent: 'flex-start', gap: 16, marginBottom: 12 }}
                    renderItem={({ item }: ListRenderItemInfo<any>) => (
                        <OptionChip
                            title={item.name}
                            key={item.id ?? item.name}
                            onPress={() => {
                                if (selectedHashtags.includes(item.name)) {
                                    setSelectedHashtags(selectedHashtags.filter(h => h !== item.name));
                                } else {
                                    setSelectedHashtags([...selectedHashtags, item.name]);
                                }
                                // If this selection came from search results, clear the search so the full ordered list is shown
                                if (searchResults !== null) {
                                    setSearch('');
                                    setSearchResults(null);
                                }
                            }}
                            selected={selectedHashtags.includes(item.name)}
                        />
                    )}
                    onEndReachedThreshold={0.5}
                    onEndReached={async () => {
                        // When showing search results, don't paginate the popular list
                        if (searchResults !== null) return;
                        if (!nextUrl || loadingMore) return;
                        setLoadingMore(true);
                        try {
                            // nextUrl may be absolute; protectedApi.get accepts full URLs
                            const resp = await protectedApi.get(nextUrl);
                            const more = resp.data.results || [];
                            setPopularHashtags(prev => [...prev, ...more]);
                            setNextUrl(resp.data.next || null);
                        } catch (err) {
                            console.error('Error loading more hashtags', err);
                        } finally {
                            setLoadingMore(false);
                        }
                    }}
                    ListFooterComponent={loadingMore ? <ActivityIndicator /> : null}
                />
                )}
            </View>
                )
            }
            <Portal>
<BottomFixedSingleButton >
    {
        initialHashtags.length > 0 ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                    <DefaultButton title='Reset' dangerButton loading={saving} onPress={async () => {
                        if (saving) return;
                        setSaving(true);
                        try {
                            const resp = await protectedApi.put('/talks/preferences/hashtags/', { hashtags: [] });
                            setInitialHashtags([]);
                            setSelectedHashtags([]);
                            sheetRef.current?.open();
                        } catch (err) {
                            console.error('Error resetting hashtags', err);
                        } finally {
                            setSaving(false);
                        }
                    }} />
                </View>
                <View style={{ flex: 1 }}>
                    <BlueButton
                        title='Save'
                        loading={saving}
                disabled={(selectedHashtags.length === 0 && initialHashtags.length === 0) || arraysEqual(selectedHashtags, initialHashtags)}
                        onPress={onSave}
                    />
                </View>
            </View>
        ) : (
            <BlueButton
                title='Save'
                loading={saving}
                disabled={(selectedHashtags.length === 0 && initialHashtags.length === 0) || arraysEqual(selectedHashtags, initialHashtags)}
                onPress={onSave}
            />
        )
    }
    </BottomFixedSingleButton>
            </Portal>
            <BottomSheet height={176} menuRef={sheetRef} >
                <Text style={{textAlign: 'center', fontSize:15, fontWeight: 'bold'}}>Hashtags {initialHashtags.length > 0 ? 'Updated!' : 'Saved!'}</Text>
                <Text style={{fontSize: 13, color: "#a6a6a6", marginTop: 16, textAlign: 'center'}}>
                    {
                        initialHashtags.length > 0 ? `Your interests have been refreshed. You'll now see posts in "Custom" that reflect your updated hashtags.` : `You'll now see a new "Custom" section in Talks featuring posts that match your selected interests.`
                    }
                </Text>
                <View style={{marginTop: 32}}>
                    <BlueButton title="Okay" onPress={() => router.back()}/>
                </View>

            </BottomSheet>
        </PageLayout>
    )
}