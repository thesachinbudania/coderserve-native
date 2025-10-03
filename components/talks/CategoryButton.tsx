import { Pressable, Text, StyleSheet } from 'react-native';

export default function CategoryButton({ title, onPress, selected = false }: { title: string, onPress?: () => void, selected?: boolean }) {
	return (
		<Pressable
			style={({ pressed }) => [{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f5f5f5", borderRadius: 32, paddingHorizontal: 24 }, !selected && pressed && { backgroundColor: "#d9d9d9" }, selected && { backgroundColor: "#202020" }]}
			onPress={onPress}
		>
			<Text style={{ color: selected ? "white" : "#737373", fontWeight: "bold", fontSize: 13 }}>{title}</Text>
		</Pressable>
	)
}


const styles = StyleSheet.create({})
