import SignIn from './signIn/page';
import SignUp from './signUp/page';
import React from 'react';
import ForgotPassword from './forgotPassword/page';

export default function Auth() {
	const [currentPage, setCurrentPage] = React.useState('signIn');

	function navigate(page: string) {
		setCurrentPage(page);
	}
	return (<> {
		currentPage === 'signIn' ?
			<SignIn
				navigate={navigate}
			/>
			: currentPage === 'forgotPassword' ?
				<ForgotPassword
					navigate={navigate}
				/>
				:
				<SignUp
					navigate={navigate}
				/>
	}</>)

}
