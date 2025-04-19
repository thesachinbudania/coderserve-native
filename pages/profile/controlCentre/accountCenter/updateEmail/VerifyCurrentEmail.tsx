import Layout from '../../../../authentication/Layout';
import OtpValidator from '../../../../authentication/components/form/OtpValidator';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import { useWizard } from 'react-use-wizard';

export default function VerifyCurrentEmail() {
	const email = useSelector((state: RootState) => state.user.email);
	const wizard = useWizard();
	return (
		<Layout
			title='Verify Your Email'
			secondaryText="We've sent a verification code to your email"
		>
			<OtpValidator
				email={email ? email : ''}
				otpFor='change_email'
				nextStep={() => { wizard.nextStep() }}
			/>
		</Layout>
	)
}
