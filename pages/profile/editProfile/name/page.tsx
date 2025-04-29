import Layout from '../../controlCentre/accountCenter/PageLayout';
import FieldLabel from '../../../../components/form/FieldLabel';
import { View } from 'react-native';
import FormInput from '../../../../components/form/FormInput';
import React from 'react';
import BlueButton from '../../../../components/buttons/BlueButton';
import Note from '../../../../components/form/Note';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../app/store';
import { useSetFullNameMutation } from '../../apiSlice';
import ErrorMessage from '../../../../components/messsages/Error';
import { setUser } from '../../../../app/userSlice';
import { useNavigation } from '@react-navigation/native';
import PopUpMessage from '../PopUpMessage';
import LockedButton from '../LockedButton';
import { formatDateTime } from '../username/page';

export default function Page() {
	const currentFirstName = useSelector((state: RootState) => state.user.firstName)
	const currentLastName = useSelector((state: RootState) => state.user.lastName)
	const lastNameChanged = useSelector((state: RootState) => state.user.lastNameChanged)
	const [firstName, setFirstName] = React.useState(currentFirstName || '')
	const [lastName, setLastName] = React.useState(currentLastName || '')
	const [setFullName, { isLoading }] = useSetFullNameMutation()
	const [error, setError] = React.useState('')
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [popUpVisible, setPopUpVisible] = React.useState(false);
	const [recentlyChanged, setRecentlyChanged] = React.useState(false);
	const [changeableDate, setChangeableDate] = React.useState<string | null>(null);
	React.useEffect(() => {
		if (lastNameChanged) {
			const lastChanged = new Date(lastNameChanged).getTime();
			const now = new Date().getTime();
			if (now - lastChanged < (60 * 24 * 60 * 60 * 1000)) {
				setRecentlyChanged(true);
			}
			const canChange = new Date(lastNameChanged).getTime() + (30 * 24 * 60 * 60 * 1000);
			console.log(formatDateTime(new Date(canChange).toString()))
			setChangeableDate(formatDateTime(new Date(canChange).toString()))
		}
	}, [])

	async function saveFullName() {
		try {
			await setFullName({ first_name: firstName, last_name: lastName }).unwrap()
			dispatch(setUser({ firstName: firstName, lastName: lastName, lastNameChanged: new Date().toString() }))
			navigation.goBack();
		}
		catch (e) {
			console.log(e)
			setError('Something went wrong! Please try again later.')
		}

	}

	return (
		<Layout
			headerTitle='Name'
		>
			<PopUpMessage
				heading='Confirm Profile Name Change'
				text="Are you sure you want to update your profile name? Once changed, you won't be able to modify it again for 60 days."
				visible={popUpVisible}
				setVisible={setPopUpVisible}
				onPress={saveFullName}
				isLoading={isLoading}
			/>
			<View style={{ gap: 48 }}>
				<View>
					<FieldLabel label='First Name'></FieldLabel>
					<FormInput
						placeholder='Natasha'
						value={firstName}
						onChangeText={setFirstName}
						disabled={recentlyChanged}
					/>
				</View>
				<View>
					<FieldLabel label='Last Name'></FieldLabel>
					<FormInput
						placeholder='Jackson'
						value={lastName}
						onChangeText={setLastName}
						disabled={recentlyChanged}
					/>
				</View>
				<View style={{ gap: 32 }}>
					<View style={{ gap: 8 }}>
						{
							recentlyChanged ?
								<LockedButton
									unlockDate={changeableDate || ''}
								/> :
								<BlueButton
									title='Update'
									disabled={(firstName === currentFirstName && lastName === currentLastName) || !firstName || !lastName}
									onPress={() => setPopUpVisible(true)}
								/>

						}
						<ErrorMessage message={error} />
					</View>
					{
						!recentlyChanged && <Note note="If you change your profile name, you won't be able to modify it again for 60 days." />
					}

				</View>
			</View>
		</Layout>
	)
}
