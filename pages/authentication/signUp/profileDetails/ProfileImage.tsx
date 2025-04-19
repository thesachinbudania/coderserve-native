import Layout from './Layout';
import { Image, Pressable, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BlueButton from '../../../../components/buttons/BlueButton';
import NoBgButton from '../../../../components/buttons/NoBgButton';
import React from 'react';
import { useWizard } from 'react-use-wizard';
import * as Haptics from 'expo-haptics';
import { useSetProfileImageMutation } from '../../apiSlice';
import ErrorText from '../../../../components/messsages/Error';

export default function ProfileImageScreen() {
	const [image, setImage] = React.useState<any>(null)
	const wizard = useWizard();
	const [uploadImage, { isLoading }] = useSetProfileImageMutation();
	const [error, setError] = React.useState('');

	async function updateProfileImage() {
		try {
			await uploadImage(image).unwrap();
			wizard.nextStep();
		}
		catch (error: any) {
			setError('Something went wrong! Please try again later.');

		}
	}

	async function openImagePicker() {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			quality: 1,
			aspect: [1, 1]
		})
		if (!result.canceled) {
			setImage(result.assets[0])
		}
	}

	return (
		<Layout
			step='Step 2 of 3'
			title="Profile Image"
			subtitle="Upload a profile image to add a personal touch to your account."
		>
			<View style={styles.container}>
				<View>
					<Pressable onPress={() => {
						openImagePicker();
						Haptics.selectionAsync();
					}} style={{ zIndex: 1 }}>
						{
							({ pressed }) => (
								<View style={[styles.plusIconView, pressed && { backgroundColor: '#006dff' }]}>
									<Image
										source={require('./assets/add.png')}
										style={styles.plusIcon}
									/>
								</View>
							)
						}
					</Pressable>
					)

					<Image
						source={image ? { uri: image.uri } : require('./assets/user.png')}
						style={[styles.imageView, image && { borderRadius: 80, borderWidth: 2, borderColor: '#f5f5f5' }]}
					/>
				</View>
				<View style={{ gap: 16, width: '100%' }}>
					<BlueButton
						title='Next'
						onPress={updateProfileImage}
						disabled={!image}
						loading={isLoading}
					/>
					<ErrorText message={error} />
					<NoBgButton
						title='Skip'
						onPress={() => wizard.nextStep()}
					/>
				</View>
			</View>
		</Layout>
	)
}


const styles = StyleSheet.create({
	imageView: {
		height: 160,
		width: 160,
	},
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 48,
		gap: 48,
	},
	plusIcon: {
		height: 32,
		width: 32,
		margin: 6,
	},
	plusIconView: {
		backgroundColor: 'black',
		borderRadius: 24,
		marginBottom: -36,
		marginRight: -4,
		zIndex: 1,
		alignSelf: 'flex-end',
	}
})
