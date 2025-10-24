import { Dimensions, Image, Pressable, Text, View } from "react-native";

export default function SearchSuggestion({
	title,
	onPress = () => { },
}: {
	title: string;
	onPress?: () => void;
}) {
	const { width } = Dimensions.get("window");
	return (
		<Pressable 
			onPress={onPress}
		>
			{({ pressed }) => (
				<View
					style={[{ padding: 16, flexDirection: "row", gap: 8 }]}
				>
					<Image
						source={require("@/assets/images/profile/searchIcon.png")}
						style={{ width: 20, height: 20 }}
					/>
					<Text
						style={[
							{ fontSize: 15, width: width - 48 },
							pressed && { color: "#006dff" },
						]}
					>
						{title}
					</Text>
				</View>
			)}
		</Pressable>
	);
}
