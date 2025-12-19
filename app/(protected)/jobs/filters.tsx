import { Dimensions, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import Tick from '@/components/jobs/Tick';
import React from 'react';
import BlueButton from '@/components/buttons/BlueButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CategoryName({ title, selectedCategory, setSelectedCategory }: { title: string, selectedCategory: string, setSelectedCategory: React.Dispatch<React.SetStateAction<string>> }) {
	return (
		<Pressable onPress={() => setSelectedCategory(title)}>
			{
				({ pressed }) => (
					<View style={[categoryStyles.container, pressed && { backgroundColor: '#e9e9e9' }, selectedCategory === title && { backgroundColor: 'white' }]}>
						<Text style={[{ fontSize: 13 }, selectedCategory === title && { color: '#006dff', fontWeight: 'bold' }]}>{title}</Text>
					</View>
				)
			}
		</Pressable>
	)
}

const categoryStyles = StyleSheet.create({
	container: {
		width: '100%',
		padding: 16,
	}
})
type AutoCompleteOptions =
	| 'off'
	| 'email'
	| 'name'
	| 'username'
	| 'password'
	| 'postal-code'
	| 'tel'
	| 'street-address';

function FormInput({ placeholder, value, onChangeText, }: { autocomplete?: AutoCompleteOptions, light?: boolean, placeholder: string, value: string, onChangeText: React.Dispatch<React.SetStateAction<string>>, topMargin?: boolean }) {
	const [isFocused, setIsFocused] = React.useState(false);
	return (
		<TextInput
			style={[styles.input, { backgroundColor: '#202020' }]}
			onFocus={() => setIsFocused(true)}
			onBlur={() => setIsFocused(false)}
			placeholder={placeholder}
			placeholderTextColor={'#a6a6a6'}
			value={value}
			onChangeText={onChangeText}
			cursorColor="black"
			autoCapitalize="none"
			keyboardType='numeric'
			inputMode='numeric'
		/>
	)
}

const categories = { 'Company': ['Accenture', 'Capgemini', 'Google', 'Microsoft'], 'Job Type': ['Full Time', 'Part Time'], 'Work Type': ['On-site', 'Remote', 'Hybrid'], 'Job Location': ['Banglore(22)'], 'Experience': ['Anyone can apply', 'Minimum 1 years'], 'Salary Range': [] }

function SalaryRangeInput() {
	const [range, setRange] = React.useState('')
	return (
		<View style={salaryRangeStyles.salaryRangeContainer}>
			<Text style={salaryRangeStyles.heading}>Minimum Salary Range</Text>
			<FormInput
				placeholder='Enter here'
				value={range}
				onChangeText={setRange}
				light
			/>
		</View>
	)
}

const salaryRangeStyles = StyleSheet.create({
	salaryRangeContainer: {
		padding: 16,
		backgroundColor: '#000',
		borderRadius: 12,
	},
	heading: {
		color: 'white',
		fontSize: 11,
	},
})

export default function Filters() {
	const [selectedCategory, setSelectedCategory] = React.useState('Company')
	const { bottom } = useSafeAreaInsets();
	const { height } = Dimensions.get('window');
	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<Layout
				headerTitle='Search Filter'
			>
				<Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
					<View style={styles.container}>
						<View style={[styles.categoryContainer, { height: height - 114 }]}>
							{
								Object.keys(categories).map((category) => (
									<CategoryName
										title={category}
										selectedCategory={selectedCategory}
										setSelectedCategory={setSelectedCategory}
									/>
								))
							}
						</View>
						<View style={styles.optionsContainer}>
							{
								selectedCategory === 'Salary Range' ? (
									<>
										<SalaryRangeInput />
										<SalaryRangeInput />
									</>
								) :
									// @ts-ignore
									categories[selectedCategory].map((option: string) => (
										<Tick
											title={option}
										/>
									))
							}
						</View>
					</View>
				</Pressable>
			</Layout>
			<View style={[styles.applyButtonContainer, { paddingBottom: bottom - 16 }]}>
				<View style={{ flex: 1 / 3 }}>
					<View style={{ padding: 16, paddingLeft: 32, }}>
						<BlueButton
							title='Clear Filter'
							disabled
						/>
					</View>
				</View>
				<View style={{ flex: 2 / 3 }}>
					<View style={{ padding: 16, paddingLeft: 0, paddingRight: 32 }}>
						<BlueButton
							title='Apply Filter'
							disabled
						/>
					</View>
				</View>
			</View>

		</View>
	)
}


const styles = StyleSheet.create({
	applyButtonContainer: {
		position: 'absolute',
		bottom: 0,
		flexDirection: 'row',
		backgroundColor: 'white',
		borderTopWidth: 1,
		borderColor: '#eeeeee',
		marginHorizontal: -16,
	},
	container: {
		flex: 1,
		marginHorizontal: -16,
		marginTop: -24,
		flexDirection: 'row',
	},
	categoryContainer: {
		flex: 1 / 3,
		backgroundColor: '#f7f7f7',
	},
	optionsContainer: {
		flex: 2 / 3,
		padding: 16,
		gap: 16,
	},
	input: {
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 8,
		height: 45,
		marginTop: 8,
		fontSize: 15,
		paddingLeft: 12,
		color: 'white',
	}
})
