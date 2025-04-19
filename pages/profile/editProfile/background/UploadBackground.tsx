import { Image, StyleSheet, Text, View } from 'react-native';
import Layout from '../../controlCentre/accountCenter/PageLayout';
import BlueButton from '../../../../components/buttons/BlueButton';
import NoBgButton from '../../../../components/buttons/NoBgButton';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { useSetBackgroundImageMutation, useDeleteBackgroundImageMutation } from '../../apiSlice';
import { setUser } from '../../../../app/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import PopUpMessage from '../PopUpMessage';
import { useNavigation } from '@react-navigation/native';
import PopUp from '../../../../components/messsages/PopUp';
import GreyBgButton from '../../../../components/buttons/GreyBgButton';
import BackgroundLoader from '../../BackgroundImageLoader';
import BackgroundImageLoader from '../../BackgroundImageLoader';

export default function Upload() {
	const [image, setImage] = React.useState<any>(null);

	const [setBackgroundImage, { isLoading }] = useSetBackgroundImageMutation();
	const [deleteBackgroundImage, { isLoading: isDeleteLoading }] = useDeleteBackgroundImageMutation();

	const [uploadPopUp, setUploadPopUp] = React.useState(false);
	const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);
	const dispatch = useDispatch();

	const backgroundImage = useSelector((state: RootState) => state.user.backgroundImage);
	const backgroundType = useSelector((state: RootState) => state.user.backgroundType);
	const navigation = useNavigation();

	async function deleteBackground() {
		try {
			await deleteBackgroundImage({}).unwrap();
			dispatch(setUser({ backgroundImage: '', backgroundType: 'default' }));
			setImage(null);
			navigation.goBack();
			navigation.goBack();
		}
		catch (e) {
			console.log(e);
		}
	}

	async function updateBackground() {
		if (image) {
			try {
				const response = await setBackgroundImage(image).unwrap();
				const backgroundImage = response.background_image;
				const backgroundType = response.background_type;
				dispatch(setUser({ backgroundImage: backgroundImage, backgroundType }));
				setUploadPopUp(true);
			}
			catch (e) {
				console.log(e);
			}
		}
	}

	async function openImagePicker() {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			quality: 1,
			aspect: [3, 1]
		})
		if (!result.canceled) {
			setImage(result.assets[0])
		}
	}

	return (
		<Layout
			headerTitle='Upload Profile Background'
		>
			<PopUpMessage
				visible={uploadPopUp}
				setVisible={setUploadPopUp}
				heading='Upload Successful'
				text='Your custom background image has been uplaoded and applied. Your profile now sports a fresh, new look!'
				singleButton
				onPress={() => {
					navigation.goBack();
					navigation.goBack();
				}}
				isLoading={false}
			/>
			<PopUp
				visible={deleteConfirmVisible}
				setVisible={setDeleteConfirmVisible}
			>
				<Text style={styles.popUpHeading}>Delete Custom Background!</Text>
				<Text style={styles.popUpText}>Removing your custom background will revert your profile to the default profile background image. Do you want to proceed?</Text>
				<View style={{ flexDirection: 'row', gap: 16 }}>
					<View style={{ flex: 1 / 2 }}>
						<BlueButton
							title='Yes, Delete'
							dangerButton
							onPress={deleteBackground}
							loading={isDeleteLoading}
						/>
					</View>
					<View style={{ flex: 1 / 2 }}>
						<GreyBgButton
							title='Cancel'
							onPress={() => setDeleteConfirmVisible(false)}
						/>
					</View>
				</View>
			</PopUp>
			{!image ?
				(
					backgroundType === 'custom' && backgroundImage ?
						<View style={{ overflow: 'hidden', borderRadius: 8 }}>
							<BackgroundImageLoader size={144} uri={backgroundImage} />
						</View>
						: (
							<View style={styles.imageContainer}>
								<Image source={require('../../assets/uploadIcon.png')} style={styles.uploadIcon} />
							</View>

						)
				)
				:
				<Image source={{ uri: image.uri }} style={{ borderRadius: 8, width: '100%', height: 144 }} />
			}
			<View style={{ gap: 16, marginTop: 48 }}>
				{image ?
					<>
						<BlueButton
							title="Save"
							onPress={updateBackground}
							loading={isLoading}
						/>
						<NoBgButton
							title='Cancel'
							onPress={() => { setImage(null) }}
						/>
					</> :
					<>
						<BlueButton
							title={backgroundType === 'default' ? 'Upload' : 'Update'}
							onPress={openImagePicker}
						/>
						{
							backgroundType === 'default' ? (
								<NoBgButton
									title='Cancel'
									onPress={() => { navigation.goBack() }}
								/>
							) : (
								<NoBgButton
									title='Delete'
									dangerButton
									onPress={() => setDeleteConfirmVisible(true)}
								/>
							)
						}
					</>
				}
			</View>
		</Layout>
	)
}

const styles = StyleSheet.create({
	imageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
		height: 144
	},
	uploadIcon: {
		height: 48,
		width: 48,
	},
	popUpHeading: {
		fontSize: 15,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center'
	},
	popUpText: {
		fontSize: 13,
		textAlign: 'center',
		marginBottom: 24,
		color: '#737373',
	}
})
