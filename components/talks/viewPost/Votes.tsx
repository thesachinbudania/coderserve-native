import protectedApi from "@/helpers/axios";
import VoteButton from "@/components/buttons/VoteButton";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import errorHandler from "@/helpers/general/errorHandler";

// --- Vote component: handles upvote/downvote logic and UI ---
export const Votes = ({ id, upvoted, downvoted, setUpvoted, setDownvoted, setUpvotes, setDownvotes, upvotes, downvotes }: { id: string, upvoted: boolean, downvoted: boolean, setUpvoted: (downvoted: boolean) => void, setDownvoted: (upvoted: boolean) => void, setUpvotes: (upvotes: number) => void, setDownvotes: (downvotes: number) => void, upvotes: number, downvotes: number }) => {
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
                                <Text style={{ fontSize: 11, color: '#a6a6a6', marginTop: 4, textAlign: 'center' }}>You upvoted this post.</Text>
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
                                <Text style={{ fontSize: 11, color: '#a6a6a6', marginTop: 4, textAlign: 'center' }}>You downvoted this post.</Text>
                            )}
                        </View>
                    )
                }

            </View>

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

