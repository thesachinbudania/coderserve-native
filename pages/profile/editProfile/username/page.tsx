import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Layout from '../../controlCentre/accountCenter/PageLayout';
import InputField from '../../../../components/form/FormInput';
import FieldLabel from '../..//../../components/form/FieldLabel';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import BlueButton from '../../../../components/buttons/BlueButton';
import { useVerifyUsernameTakenMutation } from '../../../authentication/apiSlice';
import { useSetUsernameMutation } from '../../apiSlice';
import ErrorMessage from '../../../../components/messsages/Error';
import GreyBgButton from '../../../../components/buttons/GreyBgButton';
import PopUp from '../../../../components/messsages/PopUp';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../../app/userSlice'
import Note from '../../../../components/form/Note';

export function formatDateTime(isoString: string) {
	const date = new Date(isoString);

	// Format the date (e.g., 20 Jan 2025)
	const formattedDate = date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	});

	return `${formattedDate}`;
}


export default function Username() {
	const currentUsername = useSelector((state: RootState) => state.user.username);
	const lastUsernameChanged = useSelector((state: RootState) => state.user.lastUsernameChanged);
	const [recentlyChanged, setRecentlyChanged] = React.useState(false);
	const [changeableDate, setChangeableDate] = React.useState<string | null>(null);
	React.useEffect(() => {
		if (lastUsernameChanged) {
			const lastChanged = new Date(lastUsernameChanged).getTime();
			const now = new Date().getTime();
			if (now - lastChanged < (30 * 24 * 60 * 60 * 1000)) {
				setRecentlyChanged(true);
			}
			const canChange = new Date(lastUsernameChanged).getTime() + (30 * 24 * 60 * 60 * 1000);
			console.log(formatDateTime(new Date(canChange).toString()))
			setChangeableDate(formatDateTime(new Date(canChange).toString()))
		}
	}, [])

	const [username, setUsername] = React.useState(currentUsername || '');
	const [verifyUsernameTaken] = useVerifyUsernameTakenMutation();
	const timeoutRef = React.useRef<any>();
	const [setUsernameApi, { isLoading }] = useSetUsernameMutation();

	const [message, setMessage] = React.useState('');
	const [didErrored, setDidErrored] = React.useState(false);
	const [confirmVisible, setConfirmVisible] = React.useState(false);

	const width = Dimensions.get('window').width;
	const dispatch = useDispatch();
	const navigation = useNavigation();

	React.useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if (username.length > 0 && username != currentUsername) {
			timeoutRef.current = setTimeout(() => {
				verifyUsername();
			}, 500);
		}
		else {
			setMessage('');
		}

	}, [username])



	async function verifyUsername() {
		setDidErrored(true)
		setMessage('')
		try {
			await verifyUsernameTaken(username).unwrap();
			setDidErrored(false);
			setMessage("Congratulations! The username you've chosen is available and ready for you to claim.");
		}
		catch (error: any) {
			setDidErrored(true);
			const errorMessage = error.data.username[0];
			if (errorMessage === 'custom user with this username already exists.') {
				setMessage("Oops, it looks like you're a bit late – that username is already taken.");
			}
			else if (errorMessage) {
				setMessage(errorMessage);
			}
			else {
				setMessage('Something went wrong!')
			}
		}
	}

	async function updateUsername() {
		try {
			await setUsernameApi(username).unwrap();
			dispatch(setUser({ username, lastUsernameChanged: new Date().toString() }));
			navigation.goBack();
		}
		catch (error: any) {
			console.log(error)
			setMessage('Something went wrong! Please try again.');
			setDidErrored(true);
			setConfirmVisible(false);

		}
	}


	return (
		<Layout
			headerTitle='Username'
		>
			<PopUp
				visible={confirmVisible}
				setVisible={setConfirmVisible}
			>
				<Text style={styles.popUpHeading}>Confirm Username Change</Text>
				<Text style={styles.popUpText}>Are you sure you want to update your username? Once changed, you won't be able to modify it again for 30 days.</Text>
				<View style={{ flexDirection: 'row', gap: 16 }}>
					<View style={{ width: ((width - 80) / 2) }}>
						<BlueButton
							title='Yes, Update'
							onPress={() => updateUsername()}
							loading={isLoading}
						/>
					</View>
					<View style={{ width: ((width - 80) / 2) }}>
						<GreyBgButton
							title='Cancel'
							onPress={() => setConfirmVisible(false)}
						/>
					</View>
				</View>
			</PopUp>

			<FieldLabel label='Your Username' />
			<View style={{ gap: 8 }}>
				<InputField
					placeholder='Username'
					value={username}
					onChangeText={setUsername}
					disabled={recentlyChanged}
				/>
				<ErrorMessage message={message} status={didErrored ? 'error' : "success"} />
			</View>
			<View style={{ marginTop: 48, marginBottom: 32 }}>
				{
					recentlyChanged ?
						<View style={{ gap: 32 }}>
							<View style={styles.disabledButton}>
								<Image source={require('../assets/lock.png')} style={styles.lockIcon} />
							</View>
							<Text style={{ textAlign: 'center', color: '#737373', fontSize: 11 }}>You can update your name after {changeableDate}</Text>
						</View> :
						<BlueButton
							title='Update'
							disabled={username === currentUsername || username === '' || didErrored}
							onPress={() => setConfirmVisible(true)}
						/>
				}
			</View>
			{
				!recentlyChanged && <Note note="If you change your profile name, you won't be able to modify it again for 30 days." />
			}

		</Layout>
	)
}


const styles = StyleSheet.create({
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
	},
	disabledButton: {
		backgroundColor: '#a8b8c8',
		height: 45,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
	},
	lockIcon: {
		width: 20,
		height: 20,
	}

})
