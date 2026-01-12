import { Text, View } from "react-native";
import { styles } from './components';
import Table from "./Table";
import UnorderedList from "./UnorderedList";
import BottomName from "@/components/profile/home/BottomName";

export default function Challenge2({ id, index }: { id: string, index: string }) {
    return <View>
        <Text style={styles.heading}>Q2. Train/Test Split & Accuracy</Text>
        <Text style={[styles.body, { marginTop: 4 }]}>You are given a small binary classification dataset with the following values:</Text>
        <Table
            contentContainerStyle={{ marginTop: 16 }}
            header1="Features"
            header2="Labels"
            cell1={[
                '[1, 2]',
                '[2, 1]',
                '[3, 4]',
                '[4, 3]',
                '[5, 6]',
                '[6, 5]',
                '[7, 8]',
                '[8, 7]',
            ]}
            cell2={[
                '0',
                '0',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
            ]}
        ></Table>
        <Text style={[styles.heading, { marginTop: 16 }]}>Your Task</Text>
        <UnorderedList
            contentContainerStyle={{ marginTop: 4 }}
            items={[
                { 'label': 'Split the dataset into:', 'context': ['Train set: 80%', 'Test set: 20%', '(Use the same ordering; no shuffling needed.)'] },
                'Train a Logistic Regression model on the training data.',
                'Predict on the test set and calculate the accuracy score.',
                'Return the test accuracy as a decimal value (e.g., 1.0 for 100%).'
            ]}
        />
        <View style={styles.dividerLine} />
        <Text style={styles.heading}>Expected Output Format</Text>
        <Text style={[styles.body, { padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8, marginTop: 6 }]}>
            accuracy_value
        </Text>
        <Text style={[styles.body, { marginTop: 4 }]}>(Will accept correct values like 1.0 or 1.00.</Text>
        <View style={styles.dividerLine} />
        <BottomName />
    </View>
}