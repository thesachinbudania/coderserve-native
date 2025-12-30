import { Image, Text, View } from 'react-native';

export default function NoData({ text }: { text: string }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, marginTop: -57 }}>
            <Image source={require('@/assets/images/stars.png')} style={{ height: 128, width: 128, marginBottom: 32, marginHorizontal: 'auto', objectFit: 'contain' }} />
            <Text style={{ fontSize: 11, color: "#a6a6a6", textAlign: 'center' }}>{text}</Text>
        </View>
    )
}