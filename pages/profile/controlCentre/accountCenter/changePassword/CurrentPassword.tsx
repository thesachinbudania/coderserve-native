import Layout from '../../../../authentication/Layout';
import FieldHeading from '../../../../authentication/components/form/FieldHeading';
import PasswordField from '../../../../../components/form/PasswordField';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import SmallTextButton from '../../../../../components/buttons/SmallTextButton';
import BlueButton from '../../../../../components/buttons/BlueButton';
import { useWizard } from 'react-use-wizard';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../page';


export default function ChangePassword({ currentPassword, setCurrentPassword }: { currentPassword: string, setCurrentPassword: React.Dispatch<React.SetStateAction<string>> }) {
	const wizard = useWizard();
	const navigation = useNavigation<StackProps>();
	return (
		<Layout
			title={'Update Password'}
			secondaryText='Enter Your Current Password'
		>
			<View>
				<FieldHeading>
					Current Password
				</FieldHeading>
				<PasswordField
					value={currentPassword}
					onChangeText={setCurrentPassword}
				/>
				<View style={styles.forgotPasswordContainer}>
					<SmallTextButton
						title='Forgot Password'
						onPress={() => navigation.navigate('ForgotPassword')}
					/>
				</View>
			</View>
			<BlueButton
				title='Continue'
				disabled={currentPassword == ''}
				onPress={() => wizard.nextStep()}
			/>
		</Layout>
	)
}

const styles = StyleSheet.create({
	forgotPasswordContainer: {
		marginTop: 8,
		alignItems: 'flex-end'
	}
})
