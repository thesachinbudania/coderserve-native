import { styles } from "./components";
import { ActivityIndicator, Text, View } from "react-native";
import Table from "./Table";
import UnorderedList from "./UnorderedList";
import CodeEditor from "./CodeEditor";
import { useState } from "react";
import BlueButton from "@/components/buttons/BlueButton";
import BottomName from "@/components/profile/home/BottomName";
import protectedApi from "@/helpers/axios";
import { useRouter } from "expo-router";

export default function Challenge1({ id, index }: { id: string, index: string }) {
    const [editorLoading, setEditorLoading] = useState(true);
    const [code, setCode] = useState('');
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const submitChallenge = () => {
        setSubmitting(true);
        protectedApi.post(`/home/challenges/${id}/`, { answer: code }).then(res => {
            setSuccess(true)
        }).catch(err => {
            setSuccess(false)
        }).finally(() => {
            setSubmitting(false);
        })
    }

    const router = useRouter();
    return <>
        <Text style={styles.heading}>Q1. Linear Regression Warm-up</Text>
        <Text style={[styles.body, { marginTop: 4 }]}>You are given a small housing dataset with the following values:</Text>
        <Table
            contentContainerStyle={{ marginTop: 16 }}
            header1="square_feet"
            header2="price"
            cell1={["1000", "1500", "2000", "2500"]}
            cell2={["150000", "200000", "250000", "300000"]}
        />
        <Text style={[styles.heading, { marginTop: 16 }]}>Your Task</Text>
        <UnorderedList
            contentContainerStyle={{ marginTop: 4 }}
            items={[
                { label: 'Train a Linear Regression model using:', context: ['Feature: sqaure_feet', 'Target: price'] },
                { label: 'Use the trained model to predict the house price for the following new inputs:', context: ['[1200, 2200]'] },
                'Return the predicted prices as a list, in the same order as the inputs.'
            ]}
        />
        <View style={styles.dividerLine} />
        <Text style={[styles.heading]}>Expected Output Format</Text>
        <Text style={[styles.body, { padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, marginTop: 6 }]}>[value_for_1200, value_for_2200]</Text>
        <Text style={[styles.body, { marginTop: 4 }]}>(Will accept correct values within a small tolerance range.)</Text>
        <View style={styles.dividerLine} />
        <Text style={styles.heading}>Hints</Text>
        <UnorderedList
            contentContainerStyle={{ marginTop: 4 }}
            items={[
                'You can use sklearn.linear_model.LinearRegression',
                'Make sure your input to the model is a 2D array for training and prediction'
            ]}
        ></UnorderedList>
        <View style={styles.dividerLine} />
        <Text style={[styles.heading]}>Code</Text>
        {
            false ? <View style={{ height: 400, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#202020" /></View> : <CodeEditor
                code={code}
                setCode={setCode}
                setLoading={setEditorLoading}
                language="python"
            />
        }
        {
            success ? <>
                <View style={styles.dividerLine} />
                <Text style={[styles.heading]}>Output</Text>
                <Text style={[styles.body, { marginTop: 4 }]}>  <Text style={{ color: "#d9d9d9" }}>1</Text> [170000, 270000]</Text>
                <View style={styles.dividerLine} />
                <Text style={styles.heading}>Congratualtions:</Text>
                <Text style={[styles.body, { marginTop: 4 }]}>You've successfully completed Linear Regression Warm-up and earned 100 points. Keep up the great work - you're getting stronger every day!</Text>
                <BlueButton
                    title="Next"
                    style={{ marginTop: 32 }}
                    onPress={() => router.replace(`/(protected)/home/challenges/challenge/${Number(index) + 1}/${id}`)}
                />
            </> :
                <BlueButton
                    title="Run"
                    style={{ marginTop: 32 }}
                    onPress={submitChallenge}
                    loading={submitting}
                />
        }
        <View style={styles.dividerLine} />
        <BottomName />
    </>
}