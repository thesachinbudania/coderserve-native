import { View, StyleSheet } from 'react-native';
import Layout from './Layout';
import SelectMenu from '../../../../components/form/SelectMenu';
import countryData from '../../../../constants/targetCountries';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';
import React from 'react';
import BlueButton from '../../../../components/buttons/BlueButton';
import { useTokenValidatorMutation, useSetLocationMutation } from '../../apiSlice';
import ErrorMessage from '../../../../components/messsages/Error';
import { setToken } from '../../../../app/slices';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { setUser } from '../../../../app/userSlice';



export default function LocationSelectPage() {
	const dispatch = useDispatch();
	const { access, refresh } = useSelector((state: RootState) => state.signUp.token);
	const [validateToken, { isLoading: isTokenValidating }] = useTokenValidatorMutation();
	// initial list of the countries we support currently
	const countriesList = countryData.map((country) => (
		country.name
	))
	// converting the countries list to the format provided by the library	
	const [countries, setCountries] = React.useState<{ name: string, id: number }[] | null>(null);
	React.useEffect(() => {
		GetCountries().then((countries) => {
			const filteredCountries = countries.filter((country) => (countriesList.includes(country.name)))
			setCountries(filteredCountries);
		})
	}, [])


	// storing the actual selected 
	const [selectedCountry, setSelectedCountry] = React.useState<string | null>(null);
	const [selectState, setSelectState] = React.useState<string | null>(null);
	const [selectedCity, setSelectedCity] = React.useState<string | null>(null);

	// storing the id of the selecte country
	const [selectedCountryId, setSelectedCountryId] = React.useState<number | null>(null);
	React.useEffect(() => {
		if (selectedCountry) {
			const country = countries?.find((country) => (country.name === selectedCountry));
			if (country) {
				setSelectedCountryId(country.id);
			}
		}
	}, [selectedCountry])

	// storing the states list
	const [states, setStates] = React.useState<{ name: string, id: number }[] | null>(null);
	React.useEffect(() => {
		if (selectedCountryId) {
			setSelectedStateId(null);
			setSelectState(null);
			setSelectedCity(null);
			GetState(selectedCountryId).then((states) => {
				setStates(states);
			})
		}
	}, [selectedCountryId])

	// storing the id of the selected state
	const [selectedStateId, setSelectedStateId] = React.useState<number | null>(null);
	React.useEffect(() => {
		if (selectState) {
			const state = states?.find((state) => (state.name === selectState));
			if (state) {
				setSelectedStateId(state.id);
			}
		}
	}, [selectState])

	// storing the cities list
	const [cities, setCities] = React.useState<{ name: string, id: number }[] | null>(null);
	React.useEffect(() => {
		if (selectedStateId && selectedCountryId) {
			setSelectedCity(null);
			GetCity(selectedCountryId, selectedStateId).then((cities) => {
				setCities(cities);
			})
		}
	}, [selectedStateId, selectedCountryId])

	const [updateLocation, { isLoading }] = useSetLocationMutation();
	const [error, setError] = React.useState('');


	async function setLocation() {
		try {
			await updateLocation({
				country: selectedCountry,
				state: selectState,
				city: selectedCity
			})
			const response = await validateToken({}).unwrap();
			const username = response.username;
			const userEmail = response.email;
			const firstName = response.first_name;
			const lastName = response.last_name;
			const profilePicture = response.profile_image;
			const backgroundCode = response.background_pattern_code;
			const backgroundType = response.background_type;
			const backgroundImage = response.background_image;
			const country = response.country;
			const city = response.city;
			const state = response.state;
			const dateJoined = response.date_joined;
			const gitHub = response.gitHub;
			const dobDate = response.dobDate;
			const dobMonth = response.dobMonth;
			const dobYear = response.dobYear;
			const website = response.website;
			const mobileCountryCode = response.mobileCountryCode;
			const mobileNumber = response.mobileNumber;
			const whatsappCountryCode = response.whatsappCountryCode;
			const whatsappNumber = response.whatsappNumber;
			dispatch(setUser({ username, email: userEmail, firstName, lastName, profilePicture, backgroundCode, backgroundType, backgroundImage, country, city, state, dateJoined, gitHub, dobDate, dobMonth, dobYear, website, mobileCountryCode, mobileNumber, whatsappCountryCode, whatsappNumber }));
			dispatch(setToken({ accessToken: access, refreshToken: refresh }));
		}
		catch (error) {
			console.log(error)
			setError('Something went wrong! Please try again later.');
		}
	}

	return (
		<View style={{ flex: 1 }}>
			<Layout
				step='Step 3 of 3'
				title='Location'
				subtitle='Certain features require your current location to deliver a personalized experience.'
			>
				<View style={styles.container}>
					<View style={{ gap: 16 }}>
						<SelectMenu
							placeholder='Select Country'
							options={!countries ? [] : countries.map((country) => (country.name))}
							onSelect={setSelectedCountry}
							selected={selectedCountry}
						/>
						<SelectMenu
							placeholder='Select State'
							options={!states ? [] : states.map((state) => (state.name))}
							onSelect={setSelectState}
							selected={selectState}
							error={!selectedCountryId ? 'Please select a country first' : false}
						/>
						<SelectMenu
							placeholder='Select District/City'
							options={!cities ? [] : cities.map((city) => (city.name))}
							onSelect={setSelectedCity}
							selected={selectedCity}
							error={!selectedStateId ? 'Please select a state first' : false}
						/>
						<ErrorMessage message={error} />
					</View>
					<BlueButton
						title="Complete"
						onPress={setLocation}
						loading={isLoading}
						disabled={!selectedCity || !selectedCountry || !selectState}
					/>

				</View>
			</Layout>
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
		marginTop: 48,
		gap: 48,
	}
})
