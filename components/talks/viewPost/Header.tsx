import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDistanceToNow } from 'date-fns';
import { Dimensions, View, Text, Image, StyleSheet } from 'react-native';
import ImageLoader from '@/components/ImageLoader';
import IconButton from '@/components/buttons/IconButton';

const width = Dimensions.get('window').width;

// --- Header component: displays post author and menu button ---
export function Header({ post, menuRef }: { post: any, menuRef?: any }) {
    const { top } = useSafeAreaInsets();
    let result = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
    result = result.replace(/^about\s/, '');
    result = result.replace(/^almost\s/, '');
    result = result.replace(/^in\s/, '');
    result = result.replace(/^less than\s/, '');
    return (
        <View style={[styles.headerContainer, { paddingTop: top + 8 }]}>
            <View style={{ flexDirection: "row", gap: 4 }}>
                {post.author.profile_image && (
                    <ImageLoader size={45} uri={post.author.profile_image} border={1} />
                )}
                <View style={{ gap: 4, justifyContent: "center" }}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.headerName}
                    >{post.author.first_name}</Text>
                    <Text style={styles.secondaryHeaderText}>
                        {result}
                    </Text>
                </View>
            </View>
            <IconButton onPress={() => menuRef?.current?.open()}>
                <View style={{ padding: 2 }}>
                    <Image
                        source={require("@/assets/images/jobs/Menu.png")}
                        style={styles.headerIcon}
                    />
                </View>
            </IconButton>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingBottom: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32,
        paddingTop: 16,
    },
    headerName: {
        fontSize: 15,
        fontWeight: "bold",
        width: width - 140,
    },
    secondaryHeaderText: {
        fontSize: 11,
        color: "#737373",
    },
    headerIcon: {
        width: 24,
        height: 24,
    },
})