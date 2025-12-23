import { Image, ActivityIndicator, Text, KeyboardAvoidingView, View, FlatList, ListRenderItemInfo } from "react-native";
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
import BottomDrawer from "@/components/BottomDrawer";
import { useGeneralStore } from "@/zustand/talks/generalStore";
import GreyBgButton from "@/components/buttons/GreyBgButton";
import errorHandler from "@/helpers/general/errorHandler";

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
    const [resetting, setResetting] = React.useState(false);
    const [initialHashtags, setInitialHashtags] = React.useState<string[]>([]);
    const [showNewCustomSection, setShowNewCustomSection] = React.useState(false);
    const router = useRouter();
    const { setHashtagsFollowed } = useGeneralStore();

    const sheetRef = React.useRef<any>(null);
    const resetSheetRef = React.useRef<any>(null);

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
            } catch (error: any) {
                errorHandler(error);
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
            } catch (err: any) {
                // silently ignore - user may not have prefs yet
                errorHandler(err, false);
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
            } catch (err: any) {
                errorHandler(err);
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
            // Determine whether the user had no hashtags before and now has selected some
            const wasEmptyInitially = initialHashtags.length === 0;
            setInitialHashtags(savedNames);
            setSelectedHashtags(savedNames);
            setHashtagsFollowed(savedNames);
            // Show the 'new custom section' message only if they had no hashtags before and now saved some
            setShowNewCustomSection(wasEmptyInitially && savedNames.length > 0);
            sheetRef.current?.open();
            sheetRef.current?.open();
        } catch (err: any) {
            errorHandler(err);
            console.error('Error saving hashtag preferences', err);
        } finally {
            setSaving(false);
        }
    };

    const resetHashtags = async () => {
        if (resetting) return;
        setResetting(true);
        try {
            const resp = await protectedApi.put('/talks/preferences/hashtags/', { hashtags: [] });
            setInitialHashtags([]);
            setSelectedHashtags([]);
            setHashtagsFollowed([]);
            // Reset means there's no new custom section to show
            setShowNewCustomSection(false);
            resetSheetRef.current?.close();
            router.back();
            resetSheetRef.current?.close();
            router.back();
        } catch (err: any) {
            errorHandler(err);
            console.error('Error resetting hashtags', err);
        } finally {
            setResetting(false);
        }
    }
    return (
        <PageLayout
            headerTitle="Hashtags"
        ><Image source={require('@/assets/images/talks/hashtag.png')} style={{ height: 104, width: 104, alignSelf: 'center', marginBottom: 24 }} />
            <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 15 }}>Your Vibe, Your Feed!</Text>
            <Text style={{ fontSize: 13, color: "#737373", textAlign: 'center', marginTop: 4 }}>Pick hashtags that bring the best of the community to you.</Text>
            <KeyboardAvoidingView behavior="padding" style={{ marginTop: 48 }} >
                <SearchBar onChangeText={setSearch} />
            </KeyboardAvoidingView>

            {
                loading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={'#202020'} />
                    </View> : (
                        <View style={{ marginTop: 32 }}>
                            {searching ? (
                                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}>
                                    <ActivityIndicator color={'#202020'} />
                                </View>
                            ) : (
                                <FlatList
                                    data={searchResults !== null ? searchResults : orderedHashtags}
                                    numColumns={13}
                                    columnWrapperStyle={{ justifyContent: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 12 }}
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
                                            unselectable={true}
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
                                            setNextUrl(resp.data.next || null);
                                        } catch (err: any) {
                                            errorHandler(err);
                                            console.error('Error loading more hashtags', err);
                                        } finally {
                                            setLoadingMore(false);
                                        }
                                    }}
                                    ListFooterComponent={loadingMore ? <ActivityIndicator color={'#202020'} /> : null}
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
                                    <DefaultButton title='Reset' loading={resetting} onPress={() => resetSheetRef.current?.open()} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <BlueButton
                                        title='Update'
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
            <BottomDrawer
                sheetRef={resetSheetRef}
                draggableIconHeight={0}
            >
                <View style={{ paddingHorizontal: 16 }}>
                    <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>Are you sure you want to reset?</Text>
                    <Text style={{ fontSize: 13, color: "#a6a6a6", marginTop: 16, textAlign: 'center' }}>
                        All your selected hashtags will be cleared, and the "Custom" section will be removed.
                    </Text>
                    <View style={{ marginTop: 32, gap: 16, flexDirection: "row" }}>
                        <View style={{ flex: 1 / 2 }}>
                            <GreyBgButton title="Cancel" onPress={() => resetSheetRef.current?.close()} />
                        </View>
                        <View style={{ flex: 1 / 2 }}>
                            <BlueButton title="Reset" loading={resetting} onPress={resetHashtags} />
                        </View>
                    </View>
                </View>
            </BottomDrawer>
            <BottomDrawer
                sheetRef={sheetRef}
                draggableIconHeight={0}
            >
                <View style={{ paddingHorizontal: 16 }}>
                    <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>Hashtags {!showNewCustomSection ? 'Updated!' : 'Saved!'}</Text>
                    <Text style={{ fontSize: 13, color: "#a6a6a6", marginTop: 16, textAlign: 'center' }}>
                        {(showNewCustomSection)
                            ? `You'll now see a new "Custom" section in Talks featuring posts that match your selected interests.`
                            : `Your interests have been refreshed. You'll now see posts in "Custom" that reflect your updated hashtags.`
                        }
                    </Text>
                    <View style={{ marginTop: 32 }}>
                        <BlueButton title="Okay" onPress={() => router.back()} />
                    </View>
                </View>
            </BottomDrawer>
        </PageLayout>
    )
}