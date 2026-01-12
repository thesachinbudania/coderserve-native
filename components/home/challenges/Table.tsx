import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface TableProps {
    contentContainerStyle?: StyleProp<ViewStyle>
    header1: string
    header2: string
    cell1: string[]
    cell2: string[]
}

export default function Table({ contentContainerStyle, header1, header2, cell1, cell2 }: TableProps) {
    return (
        <View style={[contentContainerStyle, tableStyles.container]}>
            <View style={{ flex: 1 / 2 }}>
                <Text style={tableStyles.headerCell}>{header1}</Text>
                {cell1.map((cell, index) => <Text key={index} style={tableStyles.cell}>{cell}</Text>)}
            </View>
            <View style={{ flex: 1 / 2 }}>
                <Text style={tableStyles.headerCell}>{header2}</Text>
                {cell2.map((cell, index) => <Text key={index} style={tableStyles.cell}>{cell}</Text>)}
            </View>
        </View>
    )
}

const tableStyles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#f5f5f5'
    },
    headerCell: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        color: "#737373",
        fontWeight: 'bold',
        fontSize: 13
    },
    cell: {
        fontSize: 13,
        color: "#737373",
        padding: 16,
        textAlign: 'center',
    }
})