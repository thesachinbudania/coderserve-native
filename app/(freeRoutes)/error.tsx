import { View, Image, Text } from 'react-native';
import BlueButton from "@/components/buttons/BlueButton";
import { useRouter } from 'expo-router';


export default function Error() {
    const router = useRouter();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, backgroundColor: 'white' }}>
            <Image
                source={require('@/assets/images/glitchedRobo.png')}
                style={{ width: 153, height: 183, marginBottom: 16 }}
            />
            <Text style={{ lineHeight: 15, fontSize: 15, marginBottom: 10, fontWeight: 'bold' }}>Something Went Wrong</Text>
            <Text style={{ textAlign: 'center', color: '#737373', fontSize: 13, marginBottom: 32 }}>
                Well, that didn’t work. Don’t worry - it’s not you, it’s us. We're working to fix it! Please try again or check back later.
            </Text>
            <View style={{ width: '100%' }}>
                <BlueButton
                    title='Try again'
                    onPress={() => {
                        try {
                            router.back()
                        } catch (error) {
                            router.replace('/(protected)/talks')
                        }
                    }}
                />
            </View>
        </View>
    )
}