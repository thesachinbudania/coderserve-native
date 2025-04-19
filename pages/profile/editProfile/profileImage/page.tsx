import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Layout from '../../controlCentre/accountCenter/PageLayout';
import ImageLoader from '../../../../components/ImageLoader';
import { RootState } from '../../../../app/store';
import { useSelector } from 'react-redux';
import BlueButton from '../../../../components/buttons/BlueButton';
import NoBgButton from '../../../../components/buttons/NoBgButton';
import GreyBgButton from '../../../../components/buttons/GreyBgButton';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import PopUp from '../../../../components/messsages/PopUp';
import { useDeleteProfileImageMutation, useSetProfileImageMutation } from '../../apiSlice';
import ErrorMessage from '../../../../components/messsages/Error';
import { setUser } from '../../../../app/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export default function ProfileImage() {
	const profileImage = useSelector((state: RootState) => state.user.profilePicture);
	const [image, setImage] = React.useState<any>(null);
	const width = Dimensions.get('window').width;

	const [popUpVisible, setPopUpVisible] = React.useState(false);
	const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);

	const [setProfileImageMutation, { isLoading }] = useSetProfileImageMutation();
	const [deleteProfileImageMutation, { isLoading: isDeleteLoading }] = useDeleteProfileImageMutation();

	const [errored, setErrored] = React.useState(false);

	const dispatch = useDispatch();
	const navigation = useNavigation();


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

	async function saveImage() {
		if (image) {
			try {
				const response = await setProfileImageMutation(image).unwrap();
				const newImageUrl = response.profile_image;
				dispatch(setUser({ profilePicture: newImageUrl }));
				setImage(null);
				setPopUpVisible(true);
			}
			catch (e) {
				console.log(e);
				setErrored(true);
			}
		}
	}

	async function deleteImage() {
		try {
			const response = await deleteProfileImageMutation({}).unwrap();
			const newImageUrl = response.profile_image;
			dispatch(setUser({ profilePicture: newImageUrl }));
			setImage(null);
			navigation.goBack();
		}
		catch (e) {
			console.log(e);
			setErrored(true);
		}
	}

	return (
		<Layout
			headerTitle='Profile Image'
		>
			<PopUp
				visible={deleteConfirmVisible}
				setVisible={setDeleteConfirmVisible}
			>
				<Text style={styles.popUpHeading}>Confirm Profile Image Deletion</Text>
				<Text style={styles.popUpText}>Are you sure you want to delete your profile image? Your profile image is an important part of your identity on our platform. It helps others recognize you and builds trust in the community.</Text>
				<View style={{ flexDirection: 'row', gap: 16 }}>
					<View style={{ width: ((width - 80) / 2) }}>
						<BlueButton
							title='Yes, Delete'
							dangerButton
							onPress={() => deleteImage()}
						/>
					</View>
					<View style={{ width: ((width - 80) / 2) }}>
						<GreyBgButton
							title='Cancel'
							onPress={() => setDeleteConfirmVisible(false)}
						/>
					</View>
				</View>
			</PopUp>
			<PopUp
				visible={popUpVisible}
				setVisible={setPopUpVisible}
			>
				<Text style={styles.popUpHeading}>Profile Picture Updated</Text>
				<Text style={styles.popUpText}>Your new profile image has been successfully saved and is now live. Thanks for keeping your profile fresh and vibrant.</Text>
				<BlueButton
					title='Okay'
					onPress={() => navigation.goBack()}
				/>
			</PopUp>
			<View style={styles.imageContainer}>
				{
					!image ?
						<ImageLoader
							uri={image ? image : profileImage}
							size={148}
						/>
						:
						<Image
							source={image}
							style={{ width: 148, height: 148, borderRadius: 74, borderWidth: 2, borderColor: '#f5f5f5' }}
						/>


				}
			</View>
			<View style={styles.buttonContainer}>
				{!image ? (<><BlueButton
					title='Update'
					onPress={() => openImagePicker()}
				/>
					<NoBgButton
						title='Delete'
						dangerButton
						loading={isDeleteLoading}
						onPress={() => setDeleteConfirmVisible(true)}
					/></>) : (<>
						<BlueButton
							title='Save'
							loading={isLoading}
							onPress={() => saveImage()}
						/>
						<NoBgButton
							title='Cancel'
							dangerButton
							onPress={() => setImage(null)}
						/>
					</>)
				}
			</View>
			{
				errored && <ErrorMessage
					message='Something went wrong. Please try again later.'
				/>
			}

		</Layout>
	)
}

const styles = StyleSheet.create({
	imageContainer: {
		marginTop: 24,
		marginBottom: 48,
		alignItems: 'center'
	},
	buttonContainer: {
		gap: 16,
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
