import protectedApi from "@/helpers/axios";
import VoteButton from "@/components/buttons/VoteButton";
import { View, Text, ScrollView, FlatList, Image } from "react-native";
import { StyleSheet } from "react-native";
import errorHandler from "@/helpers/general/errorHandler";
import BottomDrawer from "@/components/BottomDrawer";
import SmallTextButton from "@/components/buttons/SmallTextButton";
import React from 'react';
import AnimatedTopTabs from "@/components/general/TopTabs";
import { UserListing } from "@/app/(freeRoutes)/profile/followersList/[username]";
import { apiUrl } from "@/constants/env";
// --- Vote component: handles upvote/downvote logic and UI ---
export const Votes = ({ id, upvoted, downvoted, setUpvoted, setDownvoted, setUpvotes, setDownvotes, upvotes, downvotes, detailsfor, userUpvoted, userDownvoted }: { id: string, upvoted: boolean, downvoted: boolean, setUpvoted: (downvoted: boolean) => void, setDownvoted: (upvoted: boolean) => void, setUpvotes: (upvotes: number) => void, detailsfor?: string, userUpvoted?: boolean, userDownvoted?: boolean, setDownvotes: (downvotes: number) => void, upvotes: number, downvotes: number }) => {
    const upvotePost = () => {
        protectedApi.put(`/talks/posts/${id}/upvote/`)
            .then(() => {
                if (upvoted) {
                    setUpvoted(false);
                    setDownvoted(false);
                    setUpvotes(upvotes - 1);
                }
                else {
                    setUpvoted(true);
                    setDownvoted(false);
                    setUpvotes(upvotes + 1);
                }
            })
            .catch(err => {
                errorHandler(err);
                console.error('Error upvoting post:', err.response.data);
            });
    }
    const downvotePost = () => {
        protectedApi.put(`/talks/posts/${id}/downvote/`)
            .then(() => {
                if (downvoted) {
                    setDownvoted(false);
                    setUpvoted(false);
                    setDownvotes(downvotes - 1);
                }
                else {
                    setDownvoted(true);
                    setUpvoted(false);
                    setDownvotes(downvotes + 1);
                }
            })
            .catch(err => {
                errorHandler(err);
                console.error('Error downvoting post:', err.response.data);
            });
    }

    const totalVotes = upvotes - downvotes;
    const voteText = `${totalVotes} ${Math.abs(totalVotes) === 1 ? 'Vote' : 'Votes'}`;
    const votesDrawerRef = React.useRef<any>(null);
    const [upvoters, setUpvoters] = React.useState([]);
    const [downvoters, setDownvoters] = React.useState([]);

    React.useEffect(() => {
        protectedApi.get(`/talks/posts/${id}/voterslist/`).then(
            (res) => {
                console.log(res.data)
                setUpvoters(res.data.upvoters);
                setDownvoters(res.data.downvoters);
            }
        )
    }, [upvoted, downvoted])

    return (
        <View style={voteStyles.container}>
            <View style={voteStyles.buttonContainer}>
                {
                    !downvoted && (
                        <View style={{ flex: upvoted ? 1 : 1 / 2 }}>
                            <VoteButton
                                title={upvoted ? voteText : "Upvote"}
                                onPress={upvotePost}
                                selected={upvoted}
                            />
                            {upvoted && (
                                <SmallTextButton
                                    style={{ fontSize: 11, color: '#a6a6a6', marginTop: 8, textAlign: 'center', lineHeight: 11 }}
                                    title='You upvoted this post.'
                                    underlineOnPress={true}
                                    onPress={() => votesDrawerRef.current?.open()}
                                />
                            )}
                        </View>
                    )
                }
                {
                    !upvoted && (
                        <View style={{ flex: downvoted ? 1 : 1 / 2 }}>
                            <VoteButton
                                title={downvoted ? voteText : "Downvote"}
                                dangerButton={true}
                                onPress={downvotePost}
                                dangered={downvoted}
                            />
                            {downvoted && (
                                <SmallTextButton
                                    style={{ fontSize: 11, color: '#a6a6a6', marginTop: 4, textAlign: 'center' }}
                                    title='You downvoted this post.'
                                    underlineOnPress={true}
                                    onPress={() => votesDrawerRef.current?.open()}
                                />
                            )}
                        </View>
                    )
                }
            </View>
            {
                detailsfor && (
                    <Text style={{ fontSize: 11, backgroundColor: 'white', marginTop: -8, paddingBottom: 16, color: '#a6a6a6', textAlign: 'center', lineHeight: 11 }}>{detailsfor} {userUpvoted ? 'upvoted' : 'downvoted'} this post.</Text>
                )
            }
            <BottomDrawer sheetRef={votesDrawerRef} height={576}>
                <View style={{ height: 532 }}>
                    <Text style={{ fontSize: 17, marginBottom: 48, fontWeight: 'bold', textAlign: 'center', lineHeight: 17, marginTop: 8 }}>{totalVotes} Votes</Text>
                    <AnimatedTopTabs
                        tabs={[
                            {
                                name: 'Upvoters', content: <VotersList
                                    users={upvoters}
                                    noDataText="No upvoters"
                                />
                            },
                            {
                                name: 'Downvoters', content: <VotersList
                                    users={downvoters}
                                    noDataText="No downvoters"
                                />
                            }
                        ]}
                    />
                </View>
            </BottomDrawer>
        </View>
    )
}

const VotersList = ({ users, noDataText }: { users: any[], noDataText: string }) => {
    users.map((user) => {
        if (user.profile_image.startsWith('/')) {
            user.profile_image = apiUrl + user.profile_image;
        }
    })
    return (
        <View style={{ marginTop: -32, marginHorizontal: -16 }}>
            <FlatList
                data={users}
                renderItem={({ item }) => (
                    <UserListing user={item} />
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{
                    paddingTop: 24,
                    paddingHorizontal: 16,
                }}
                ListEmptyComponent={
                    <View style={{ paddingTop: 96, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('@/assets/images/stars.png')} style={{ width: 112, height: 120, objectFit: 'contain', marginBottom: 30 }} />
                        <Text style={{ textAlign: 'center', fontSize: 11, color: '#a6a6a6' }}>{noDataText}</Text>
                    </View>
                }
            />
        </View>
    )
}

const voteStyles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        marginHorizontal: -16,
        paddingVertical: 8,
        marginTop: 32,
    },
    buttonContainer: {
        padding: 16,
        backgroundColor: 'white',
        flexDirection: 'row',
        gap: 16,
    }
})

const styles = StyleSheet.create({
    tabRow: {
        flexDirection: 'row',
        position: 'relative',
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 12,
        flex: 1 / 2,
    },
    tabText: {
        fontSize: 13,
        color: '#737373',
        lineHeight: 13
    },
    activeText: {
        color: '#000',
        fontWeight: 'bold',
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        backgroundColor: '#202020',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
})