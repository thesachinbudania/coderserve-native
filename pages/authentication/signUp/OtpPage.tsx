import AuthLayout from '../Layout';
import React from 'react';
import { useWizard } from 'react-use-wizard';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useDispatch } from 'react-redux';
import { setTokenState } from './signUpSlice';
import OtpValidator from '../components/form/OtpValidator';



export default function OtpPage() {
	const wizard = useWizard();
	const email = useSelector((state: RootState) => state.signUp.email);
	const dispatch = useDispatch();

	function nextStep({ refresh, access }: { refresh: string, access: string }) {
		dispatch(setTokenState({ refresh, access }));
		wizard.nextStep();
	}
	return (
		<AuthLayout
			title='Verify Your Email'
			secondaryText="We've sent a verification code to your email"
		>
			<OtpValidator
				email={email ? email : 'null'}
				otpFor='account_verification'
				nextStep={nextStep}
			/>
		</AuthLayout>
	)
}


