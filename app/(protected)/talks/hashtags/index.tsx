import { Text, KeyboardAvoidingView, View } from "react-native";
import PageLayout from "@/components/general/PageLayout";
import SearchBar from "@/components/form/SearchBar";
import React from 'react';
import OptionChip from "@/components/general/OptionChip";
import protectedApi from "@/helpers/axios";

export default function Hashtags() {
    const [search, setSearch] = React.useState("");
    const [popularHashtags, setPopularHashtags] = React.useState<any[]>([]);
    console.log("Popular Hashtags:", popularHashtags);

    React.useEffect(() => {
        const fetchPopularHashtags = async () => {
            try {
                const response = await protectedApi.get("/talks/hashtags/popular/");
                setPopularHashtags(response.data.results);
            } catch (error) {
                console.error("Error fetching popular hashtags:", error);
            }
        };

        fetchPopularHashtags();
    }, []);

    return (
        <PageLayout
        headerTitle="Hashtags"
        >
            <Text style={{textAlign: 'center', fontWeight: "bold", fontSize: 21}}>Personalize Your Feed</Text>
            <KeyboardAvoidingView behavior="padding" style={{marginTop: 32}} >
            <SearchBar  onChangeText={setSearch}/>
            </KeyboardAvoidingView>
            <View style={{flexDirection: 'row', marginTop: 32, gap: 16, flexWrap: 'wrap'}}>
                {popularHashtags.map((hashtag) => {
                    console.log(hashtag);
                    return <OptionChip title={hashtag.name} key={hashtag.id} />
                })}
            </View>
        </PageLayout>
    )
}