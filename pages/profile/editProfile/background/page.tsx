import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Layout from '../../controlCentre/accountCenter/PageLayout';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../Page';
import PopUp from '../../../../components/messsages/PopUp';
import BlueButton from '../../../../components/buttons/BlueButton';
import GreyBgButton from '../../../../components/buttons/GreyBgButton';
import { useSetBackgroundMutation } from '../../apiSlice';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../../app/userSlice';


const backgroundImages = [
	require('../../assets/Background/1.png'),
	require('../../assets/Background/2.png'),
	require('../../assets/Background/3.png'),
	require('../../assets/Background/4.png'),
	require('../../assets/Background/5.png'),
	require('../../assets/Background/6.png'),
	require('../../assets/Background/7.png'),
	require('../../assets/Background/8.png'),
];

const mappedImages = {
	1: require('../../assets/Background/1.png'),
	2: require('../../assets/Background/2.png'),
	3: require('../../assets/Background/3.png'),
	4: require('../../assets/Background/4.png'),
	5: require('../../assets/Background/5.png'),
	6: require('../../assets/Background/6.png'),
	7: require('../../assets/Background/7.png'),
	8: require('../../assets/Background/8.png'),
}

function Button({ onPress = () => { }, selected = false, title }: { onPress?: () => void, selected?: boolean, title: string }) {
	return (
		<Pressable style={{ flex: 1 }} onPress={onPress}>
			{
				({ pressed }) => (
					<View style={[styles.button, !selected && { backgroundColor: '#f5f5f5' }, pressed && !selected && { backgroundColor: '#d9d9d9' },]}>
						<Text style={[styles.buttonText, !selected && { color: 'black' }]}>{title}</Text>
					</View>
				)
			}

		</Pressable>
	)
}

export default function Background() {

	const navigation = useNavigation<NavigationProp>();
	const [popUpVisible, setPopUpVisible] = React.useState(false);
	const [selectedImage, setSelectedImage] = React.useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(1);

	const [setBackground, { isLoading }] = useSetBackgroundMutation();

	const dispatch = useDispatch();

	async function updateBackground() {
		try {
			await setBackground({ background_pattern_code: selectedImage, background_type: 'default' }).unwrap();
			dispatch(setUser({ backgroundCode: selectedImage, backgroundType: 'default' }));
			navigation.goBack();
		}
		catch (e) {
			console.log(e);
		}
	}
	return (
		<Layout
			headerTitle='Profile Background'
		>
			<PopUp
				visible={popUpVisible}
				setVisible={setPopUpVisible}
			>
				<Image source={mappedImages[selectedImage]} style={[styles.bgImage, { height: 132 }]} />
				<View style={{ marginTop: 16, marginBottom: 48 }}>
					<Text style={styles.popUpText}>Your profile is about to get a fresh new look!</Text>
					<Text style={styles.popUpText}>Ready to set this as your background image?</Text>
				</View>
				<View style={{ flexDirection: 'row', gap: 16 }}>
					<View style={{ flex: 1 / 2 }}>
						<BlueButton
							title='Yes, update'
							onPress={updateBackground}
							loading={isLoading}
						/>
					</View>
					<View style={{ flex: 1 / 2 }}>
						<GreyBgButton
							title='Cancel'
							onPress={() => setPopUpVisible(false)}
						/>
					</View>
				</View>
			</PopUp>
			<View style={styles.buttonsContainer}>
				<Button
					selected
					title='Select'
				/>
				<Button
					title='Upload'
					onPress={() => navigation.navigate('EditProfileUploadBackground')}
				/>
			</View>
			<View style={styles.backgroundContainer}>
				{
					backgroundImages.map((image, index) => (
						<Pressable
							key={index}
							onPress={
								() => {
									setSelectedImage(index + 1 as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8);
									setPopUpVisible(true);
								}
							}
						>
							{
								({ pressed }) => (
									<Image
										source={image}
										style={[styles.bgImage, pressed && { borderWidth: 2, borderColor: 'black' }]}
									/>

								)
							}
						</Pressable>
					))
				}
			</View>
		</Layout>
	)
}

const styles = StyleSheet.create({
	backgroundContainer: {
		gap: 16,
		paddingBottom: Platform.OS === 'ios' ? 64 : 128,
	},
	buttonsContainer: {
		flexDirection: 'row',
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
		gap: 4,
		marginBottom: 32,
	},
	button: {
		height: 45,
		flex: 1 / 2,
		backgroundColor: '#202020',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: 13,
		fontWeight: 'bold',
		color: 'white',
	},
	bgImage: {
		width: '100%',
		height: 144,
		borderRadius: 8,
	},
	popUpText: {
		fontSize: 13,
		textAlign: 'center',
		color: '#737373',
	}
})
