import PageLayout from "@/components/general/PageLayout";
import { Text } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import Challenge1 from "@/components/home/challenges/Challenge1";
import Challenge2 from "@/components/home/challenges/Challenge2";

type ChallengeType = ({ index, id }: { index: string, id: string }) => JSX.Element

const Challenges: ChallengeType[] = [
    ({ index, id }) => <Challenge1 id={id} index={index} />,
    ({ index, id }) => <Challenge2 id={id} index={index} />
]


const Challenge = () => {
    const { params } = useLocalSearchParams();
    const challengeIndex = typeof params[0] === 'string' ? parseInt(params[0]) : 0;
    const ChallengeComponent = Challenges[challengeIndex];

    return (
        <PageLayout headerTitle="Challenge" bottomPadding={false}>
            {ChallengeComponent ? <ChallengeComponent id={params[1]} index={params[0]} /> : <Text>Challenge not found</Text>}
        </PageLayout>
    )
}

export default Challenge