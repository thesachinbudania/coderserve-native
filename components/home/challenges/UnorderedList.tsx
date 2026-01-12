import { StyleProp, Text, View, ViewStyle, StyleSheet } from 'react-native';

interface UnorderedListProps {
    contentContainerStyle?: StyleProp<ViewStyle>
    items: (string | { label: string, context: string[] })[]
    gap?: number
}

export default function UnorderedList({ contentContainerStyle, items, gap }: UnorderedListProps) {
    return <View style={[contentContainerStyle]}>
        {
            items.map((item, index) => {
                if (typeof item === 'string') {
                    return <View
                        style={[styles.listItem, index !== items.length - 1 && { marginBottom: gap || 0 }]}
                        key={index}
                    >
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.detailText}>{item}</Text>
                    </View>
                } else {
                    return <View key={index}>
                        <View
                            style={[styles.listItem, index !== items.length - 1 && { marginBottom: gap || 0 }]}
                        >
                            <Text style={styles.bullet}>{'\u2022'}</Text>
                            <Text style={styles.detailText}>{item.label}</Text>

                        </View>
                        <View>
                            {
                                item.context.map((context, index) => {
                                    return <Text key={index} style={[styles.detailText, { marginLeft: 30 }]}>{context}</Text>
                                })
                            }
                        </View>
                    </View>
                }
            })
        }
    </View>
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
    },
    bullet: {
        marginRight: 6,
        fontSize: 16,
        lineHeight: 20, // matches detailText lineHeight
        color: '#737373',
    },
    detailText: {
        flexShrink: 1, // allows wrapping nicely
        fontSize: 14,
        lineHeight: 20, // ensures even spacing between wrapped and single-line items
        color: '#737373',
        textAlign: 'justify',
    },
});