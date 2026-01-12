import ListPageLayout from "@/components/general/ListPageLayout";
import OptionChip from "@/components/general/OptionChip";
import { ActivityIndicator, Dimensions, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import React from "react";
import protectedApi from "@/helpers/axios";
import BottomName from "@/components/profile/home/BottomName";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";

type ChallengeType = "easy" | "medium" | "hard"
type QuestionType = {
    id: number,
    heading: string,
    description: string,
    tasks: string[] | { title: string, children: string[] }[],
    completed: boolean,
    points: number
}


const Question = ({ question, index }: { question: QuestionType, index: number }) => {
    const router = useRouter();
    const Chip = ({ title }: { title: string }) => {
        return <Text style={{ fontSize: 9, color: "#fff", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: "#004aad", fontWeight: 'bold' }}>{title}</Text>
    }
    return (
        <Pressable style={{ padding: 16 }} onPress={() => router.push(`/(protected)/home/challenges/challenge/${index}/${question.id}`)}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'justify' }}>Q{index + 1}. {question.heading}</Text>
            <Text style={{ fontSize: 14, color: "#a6a6a6", marginTop: 4, textAlign: 'justify' }}>{question.description}</Text>
            <Text style={{ fontSize: 14, color: "#a6a6a6", marginTop: 20, textAlign: 'justify' }}>Write a function to:</Text>
            <View style={{ marginLeft: 16 }}>
                {
                    question.tasks.map((task, index) => (
                        typeof (task) === 'string' ? <Text key={index} style={{ fontSize: 14, color: "#a6a6a6", textAlign: 'justify' }}>{index + 1}. {task}</Text>
                            : <View key={index}>
                                <Text style={{ fontSize: 14, color: "#a6a6a6", textAlign: 'justify' }}>{index + 1}. {task.title}</Text>
                                {
                                    task.children.map((child, index) => (
                                        <Text key={index} style={{ fontSize: 14, color: "#a6a6a6", textAlign: 'justify', marginLeft: 32 }}>{child}</Text>
                                    ))
                                }
                            </View>
                    ))
                }
                {
                    question.completed && <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                        <Chip title="Completed" />
                        <Chip title={`+${question.points} Points`} />
                    </View>
                }
            </View>
        </Pressable>
    )
}

const PageChip = ({ page, onPress, selected }: { page: number, onPress: () => void, selected: boolean }) => {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [{ borderRadius: 8, backgroundColor: "#f5f5f5", height: 39, width: 39, justifyContent: 'center', alignItems: 'center' }, pressed && { backgroundColor: '#d9d9d9' }, selected && { backgroundColor: '#202020' }]}
        >
            <Text style={{ fontSize: 13, color: selected ? 'white' : '#737373', fontWeight: selected ? 'bold' : 'normal' }}>{page}</Text>
        </Pressable>
    )
}

const Challenges = () => {
    const [selected, setSelected] = React.useState<ChallengeType>("easy")
    const { width } = Dimensions.get("window");
    const [isLoading, setIsLoading] = React.useState(true)
    const [data, setData] = React.useState<any>([])
    const [totalPages, setTotalPages] = React.useState(1)
    const [currentPage, setCurrentPage] = React.useState(1)

    const fetchData = (pageNumber: number, category: ChallengeType) => {
        setIsLoading(true)
        protectedApi.get(`/home/challenges/?page=${pageNumber}&category=${category}`).then(res => {
            setData(res.data.results)
            setTotalPages(Math.ceil(res.data.count / 25))
        }).catch(() => {
        }).finally(() => {
            setIsLoading(false)
        })
    }

    useFocusEffect(React.useCallback(() => {
        fetchData(currentPage, selected)
    }, [currentPage, selected]))
    return (
        <ListPageLayout headerTitle="Challenges">
            <View style={{ flexDirection: 'row', gap: 8, padding: 16 }}>
                <OptionChip title="Easy" width={(width - 48) / 3} selected={selected === "easy"} onPress={() => setSelected("easy")} />
                <OptionChip title="Medium" width={(width - 48) / 3} selected={selected === "medium"} onPress={() => setSelected("medium")} />
                <OptionChip title="Hard" width={(width - 48) / 3} selected={selected === "hard"} onPress={() => setSelected("hard")} />
            </View>
            <View style={{ width: width, height: 8, backgroundColor: '#f5f5f5' }} />
            {
                isLoading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#202020" />
                </View> : <FlatList
                    data={data}
                    renderItem={({ item, index }) => <Question question={item} index={25 * (currentPage - 1) + index} />}
                    keyExtractor={item => item.id.toString()}
                    ItemSeparatorComponent={() => <View style={{ height: 8, backgroundColor: '#f5f5f5', width }} />}
                    ListFooterComponent={() => <>
                        <View style={{ height: 8, backgroundColor: '#f5f5f5', width }} />
                        <ScrollView contentContainerStyle={{ gap: 16, padding: 16 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                    <PageChip
                                        key={page}
                                        page={page}
                                        onPress={() => setCurrentPage(page)}
                                        selected={currentPage === page}
                                    />
                                ))
                            }
                        </ScrollView>
                        <View style={{ height: 8, backgroundColor: '#f5f5f5', width }} />
                        <BottomName />
                    </>}
                />
            }
        </ListPageLayout>
    )
}


export default Challenges