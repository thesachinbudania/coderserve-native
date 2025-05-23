import { Animated, BackHandler, Dimensions, Keyboard, Platform, Text, useAnimatedValue, View } from 'react-native'
import FormInput from '@/components/form/FormInput';
import { TopNav, measureY, setSuggestions, styles } from '@/app/(protected)/jobs/resume/updateEducation';
import SearchBar from '@/components/profile/SearchBar';
import React, { SetStateAction } from 'react';
import DateSelect from '@/components/jobs/resume/DateSelect';
import LocationSelectMenu from '@/components/form/LocationSelectMenu';
import BlueButton from '@/components/buttons/BlueButton';
import { degrees, fieldsOfStudy, universities } from '@/constants/jobsEducationSuggestions';
import SearchSuggestion from '@/components/jobs/resume/SearchSuggestions';
import { useDispatch, useSelector } from 'react-redux';
import { useUserStore } from '@/zustand/stores';
import { useNavigation } from '@react-navigation/native';
import Error from '@/components/messsages/Error';
import NoBgButton from '@/components/buttons/NoBgButton';
import PopUpMessage from '@/components/general/PopUpMessage';

const windowWidth = Dimensions.get('window').width;

export default function Education({ route, page, setPage, setShowHeader, setScrollEnabled }: { page: number, setPage: React.Dispatch<SetStateAction<number>>, route: any, setShowHeader: React.Dispatch<React.SetStateAction<boolean>>, setScrollEnabled: React.Dispatch<React.SetStateAction<boolean>> }) {
	let editDegree = null;
	const currentDegrees = useSelector((state: RootState) => state.jobs.degrees);
	if (route.params && route.params.edit) {
		const degreeId = route.params.id;
		const degree = currentDegrees?.find((degree) => degree.id === degreeId);
		if (degree?.type === 0) {
			editDegree = degree;
		}
	}

	// final form values
	const [degree, setDegree] = React.useState(editDegree ? editDegree.degree : '');
	const [fieldOfStudy, setFieldOfStudy] = React.useState(editDegree ? editDegree.field_of_study : '');
	const [marks, setMarks] = React.useState(editDegree ? editDegree.marks : '');
	const [university, setUniversity] = React.useState(editDegree ? editDegree.institution : '');
	const [joinMonth, setJoinMonth] = React.useState(editDegree ? editDegree.joining_month : '');
	const [joinYear, setJoinYear] = React.useState(editDegree ? editDegree.joining_year : '');
	const [endMonth, setEndMonth] = React.useState(editDegree ? editDegree.end_month : '');
	const [endYear, setEndYear] = React.useState(editDegree ? editDegree.end_year : '');
	const [country, setCountry] = React.useState<string | null>(editDegree ? editDegree.country : '');
	const [state, setState] = React.useState<string | null>(editDegree ? editDegree.state : '');
	const [city, setCity] = React.useState<string | null>(editDegree ? editDegree.city : '');

	// state for dispatching degrees
	const dispatch = useDispatch();

	// navigation
	const navigation = useNavigation();

	// mutations for api calls
	const [addDegree, { isLoading: isAddDegreeLoading }] = useAddDegreeMutation();
	const [updateDegree, { isLoading: isUpdateDegreeLoading }] = useUpdateDegreeMutation();
	const [deleteDegree, { isLoading: isDeleteDegreeLoading }] = useDeleteDegreeMutation();

	// error state
	const [error, setError] = React.useState('');

	// function for handling api calls
	const handleDelete = async () => {
		try {
			const response = await deleteDegree({ id: editDegree?.id }).unwrap();
			if (response) {
				dispatch(setDegrees(response['degrees']));
			}
			navigation.goBack();
		}
		catch (error) {
			setError('Something went wrong. Please try again.');
			console.log(error);
		}
	}

	const handleSave = async () => {
		const data = {
			id: Date.now(),
			type: 0,
			degree: degree,
			field_of_study: fieldOfStudy,
			marks: marks,
			institution: university,
			joining_month: joinMonth,
			joining_year: joinYear,
			end_month: endMonth,
			end_year: endYear,
			country: country,
			state: state,
			city: city,
		}
		try {
			const response = await addDegree({ new_degree: data }).unwrap();
			console.log(response)
			if (response) {
				dispatch(setDegrees(response['degrees']));
			}
			navigation.goBack();
		}
		catch (error) {
			setError('Something went wrong. Please try again.');
			console.log(error);
		}
	}

	const handleUpdate = async () => {
		const data = {
			id: editDegree?.id || Date.now(),
			type: 0,
			degree: degree,
			field_of_study: fieldOfStudy,
			marks: marks,
			institution: university,
			joining_month: joinMonth,
			joining_year: joinYear,
			end_month: endMonth,
			end_year: endYear,
			country: country,
			state: state,
			city: city,
		}
		try {
			const response = await updateDegree(data).unwrap();
			if (response) {
				dispatch(setDegrees(response['degrees']));
			}
			navigation.goBack();
		}
		catch (error) {
			setError('Something went wrong. Please try again.');
			console.log(error);
		}
	}

	// popup for confirming delete
	const [showPopUp, setShowPopUp] = React.useState(false);

	// focused search bar states
	const [degreeFocused, setDegreeFocused] = React.useState(false);
	const [fieldOfStudyFocused, setFieldOfStudyFocused] = React.useState(false);
	const [universityFocused, setUniversityFocused] = React.useState(false);

	// effect for handling back button
	React.useEffect(() => {
		const backAction = () => {
			if (degreeFocused || fieldOfStudyFocused || universityFocused) {
				setDegreeFocused(false);
				setFieldOfStudyFocused(false);
				setUniversityFocused(false);
				Keyboard.dismiss();
				return true;
			}
			return false;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	})

	React.useEffect(() => {
		if (degreeFocused || fieldOfStudyFocused || universityFocused) {
			setScrollEnabled(false);
		}
		else {
			setScrollEnabled(true);
		}
	}, [degreeFocused, fieldOfStudyFocused, universityFocused])
	// refs for search bars 
	const degreeRef = React.useRef(null);
	const fieldOfStudyRef = React.useRef(null);
	const universityRef = React.useRef(null);

	// values for searches
	const [degreeSearchText, setDegreeSearchText] = React.useState(editDegree ? editDegree.degree : '');
	const [fieldOfStudySearchText, setFieldOfStudySearchText] = React.useState(editDegree ? editDegree.field_of_study : '');
	const [universitySearchText, setUniversitySearchText] = React.useState(editDegree ? editDegree.institution : '');

	// suggestions for searches
	const [degreeSuggestions, setDegreeSuggestions] = React.useState<any[]>([]);
	const [fieldOfStudySuggestions, setFieldOfStudySuggestions] = React.useState<any[]>([]);
	const [universitySuggestions, setUniversitySuggestions] = React.useState<any[]>([]);

	// function to handle search suggestions
	React.useEffect(() => {
		setSuggestions(degreeSearchText, setDegreeSuggestions, degrees);
	}, [degreeSearchText])

	React.useEffect(() => {
		setSuggestions(fieldOfStudySearchText, setFieldOfStudySuggestions, fieldsOfStudy);
	}, [fieldOfStudySearchText])

	React.useEffect(() => {
		setSuggestions(universitySearchText, setUniversitySuggestions, universities);
	}, [universitySearchText])

	// effect for hiding header on search bars focused
	React.useEffect(() => {
		if (degreeFocused || fieldOfStudyFocused || universityFocused) {
			setShowHeader(false);
		}
		else {
			setShowHeader(true);
		}
	}, [degreeFocused, fieldOfStudyFocused, universityFocused])

	// animated values
	const contentOpacity = useAnimatedValue(1);
	const degreeTranslateY = useAnimatedValue(0);
	const fieldOfStudyTranslateY = useAnimatedValue(0);
	const universityTranslateY = useAnimatedValue(0);

	// function to handle focus and blur events
	const animatedDegree = async () => {
		const degreeY = await measureY(degreeRef);
		if (degreeY && degreeFocused) {
			Animated.timing(degreeTranslateY, {
				toValue: Platform.OS === 'ios' ? -degreeY + 32 : -degreeY,
				duration: 300,
				useNativeDriver: true,
			}).start()
			Animated.timing(contentOpacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start()
		}
		else {
			Animated.timing(degreeTranslateY, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start()
			Animated.timing(contentOpacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start()
		}
	}

	const animatedFieldOfStudy = async () => {
		const fieldOfStudyY = await measureY(fieldOfStudyRef);
		if (fieldOfStudyY && fieldOfStudyFocused) {
			Animated.timing(fieldOfStudyTranslateY, {
				toValue: Platform.OS === 'ios' ? -fieldOfStudyY + 32 : -fieldOfStudyY,
				duration: 300,
				useNativeDriver: true,
			}).start()
			Animated.timing(contentOpacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start()
		}
		else {
			Animated.timing(fieldOfStudyTranslateY, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start()
			Animated.timing(contentOpacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start()
		}
	}

	const animatedUniversity = async () => {
		const universityY = await measureY(universityRef);
		if (universityY && universityFocused) {
			Animated.timing(universityTranslateY, {
				toValue: Platform.OS === 'ios' ? -universityY + 32 : -universityY,
				duration: 300,
				useNativeDriver: true,
			}).start()
			Animated.timing(contentOpacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start()
		}
		else {
			Animated.timing(universityTranslateY, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start()
			Animated.timing(contentOpacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start()
		}
	}

	// effects to handle focus and blur events
	React.useEffect(() => {
		animatedDegree();
	}, [degreeFocused])

	React.useEffect(() => {
		animatedFieldOfStudy();
	}, [fieldOfStudyFocused])

	React.useEffect(() => {
		animatedUniversity();
	}, [universityFocused])

	return (
		<>
			<PopUpMessage
				heading='Delete this education?'
				text='This action will permanently remove this education from your resume. You won’t be able to undo this.'
				visible={showPopUp}
				setVisible={setShowPopUp}
				onPress={handleDelete}
				isLoading={isDeleteDegreeLoading}
			/>
			<Animated.View style={{ opacity: contentOpacity }}>
				<TopNav
					page={page}
					setPage={setPage}
				/>
			</Animated.View>
			<Animated.View style={{ alignItems: 'center', marginTop: 48 }}>
				<View style={{ width: degreeFocused || fieldOfStudyFocused || universityFocused ? windowWidth : windowWidth - 32, gap: 48 }}>
					<Animated.View style={{ opacity: degreeFocused ? 1 : contentOpacity }}>
						<Animated.View style={{ opacity: contentOpacity }}>
							<Text style={styles.label}>Degree</Text>
						</Animated.View>
						<Animated.View
							ref={degreeRef}
							style={{ transform: [{ translateY: degreeTranslateY }] }}
						>
							<SearchBar
								isFocused={degreeFocused}
								setIsFocused={setDegreeFocused}
								placeholder='ex: Bachelor of Engineering'
								text={degreeSearchText}
								onChangeText={setDegreeSearchText}
							/>
							<View
								style={{
									display: degreeFocused ? "flex" : "none",
									height: "100%",
									backgroundColor: "#f7f7f7",
								}}
							>
								{
									degreeSearchText &&
									<SearchSuggestion
										title={degreeSearchText}
										onPress={() => {
											setDegreeFocused(false);
											Keyboard.dismiss();
											setDegree(degreeSearchText);
										}}
									/>
								}
								{degreeSuggestions.map((item, index) => (
									<SearchSuggestion
										key={index}
										title={item}
										onPress={() => {
											setDegreeSearchText(item);
											setDegreeFocused(false);
											Keyboard.dismiss();
											setDegree(item);
										}}
									/>
								))}
							</View>
						</Animated.View>
					</Animated.View>
					<Animated.View style={{ opacity: fieldOfStudyFocused ? 1 : contentOpacity }}>
						<Animated.View style={{ opacity: contentOpacity }}>
							<Text style={styles.label}>Field of Study</Text>
						</Animated.View>
						<Animated.View
							ref={fieldOfStudyRef}
							style={{ transform: [{ translateY: fieldOfStudyTranslateY }] }}
						>
							<SearchBar
								isFocused={fieldOfStudyFocused}
								setIsFocused={setFieldOfStudyFocused}
								placeholder='ex: Computer Science'
								text={fieldOfStudySearchText}
								onChangeText={setFieldOfStudySearchText}
							/>
							<View
								style={{
									display: fieldOfStudyFocused ? "flex" : "none",
									height: "100%",
									backgroundColor: "#f7f7f7",
								}}
							>
								{
									fieldOfStudySearchText &&
									<SearchSuggestion
										title={fieldOfStudySearchText}
										onPress={() => {
											setFieldOfStudyFocused(false);
											Keyboard.dismiss();
											setFieldOfStudy(fieldOfStudySearchText);
										}}
									/>
								}
								{fieldOfStudySuggestions.map((item, index) => (
									<SearchSuggestion
										key={index}
										title={item}
										onPress={() => {
											setFieldOfStudySearchText(item);
											setFieldOfStudyFocused(false);
											Keyboard.dismiss();
											setFieldOfStudy(item);
										}}
									/>
								))}
							</View>
						</Animated.View>
					</Animated.View>
					<Animated.View style={{ opacity: contentOpacity }}>
						<Text style={styles.label}>Percentage of Mark Obtained (Out of 100)</Text>
						<FormInput
							placeholder='ex: 85.4'
							keyboardType='numeric'
							value={marks}
							onChangeText={setMarks}
							topMargin={false}
						/>
					</Animated.View>
					<Animated.View style={{ opacity: universityFocused ? 1 : contentOpacity }}>
						<Animated.View style={{ opacity: contentOpacity }}>
							<Text style={styles.label}>University/College/Institution</Text>
						</Animated.View>
						<Animated.View
							ref={universityRef}
							style={{ transform: [{ translateY: universityTranslateY }] }}
						>
							<SearchBar
								isFocused={universityFocused}
								setIsFocused={setUniversityFocused}
								placeholder='ex: Madras Institute of Technology'
								text={universitySearchText}
								onChangeText={setUniversitySearchText}
							/>
							<View
								style={{
									display: universityFocused ? "flex" : "none",
									height: "100%",
									backgroundColor: "#f7f7f7",
								}}
							>
								{
									universitySearchText &&
									<SearchSuggestion
										title={universitySearchText}
										onPress={() => {
											setUniversityFocused(false);
											Keyboard.dismiss();
											setUniversity(universitySearchText);
										}}
									/>
								}
								{universitySuggestions.map((item, index) => (
									<SearchSuggestion
										key={index}
										title={item}
										onPress={() => {
											setUniversitySearchText(item);
											setUniversityFocused(false);
											Keyboard.dismiss();
											setUniversity(item);
										}}
									/>
								))}
							</View>
						</Animated.View>
					</Animated.View>
					<Animated.View
						style={{ flexDirection: "row", gap: 16, opacity: contentOpacity }}
					>
						<View style={{ flex: 1 / 2 }}>
							<Text style={styles.label}>Joining Date</Text>
							<DateSelect
								placeholder="Jan 2000"
								selectedMonth={joinMonth}
								selectedYear={joinYear}
								setSelectedMonth={setJoinMonth}
								setSelectedYear={setJoinYear}
							/>
						</View>
						<View style={{ flex: 1 / 2 }}>
							<Text style={styles.label}>Ending Date</Text>
							<DateSelect
								placeholder="Dec 2022"
								selectedMonth={endMonth}
								selectedYear={endYear}
								setSelectedMonth={setEndMonth}
								setSelectedYear={setEndYear}
								presentOption
							/>
						</View>
					</Animated.View>
					<Animated.View style={{ opacity: contentOpacity }}>
						<Text style={styles.label}>Location</Text>
						<LocationSelectMenu
							selectedCountry={country}
							setSelectedCountry={setCountry}
							selectedState={state}
							setSelectedState={setState}
							selectedCity={city}
							setSelectedCity={setCity}
						/>
					</Animated.View>
					<Animated.View style={{ opacity: contentOpacity, marginBottom: Platform.OS === 'ios' ? 64 : 112 }}>
						<BlueButton
							title={editDegree ? "Update" : "Save"}
							onPress={editDegree ? handleUpdate : handleSave}
							loading={editDegree ? isUpdateDegreeLoading : isAddDegreeLoading}
							disabled={editDegree ? (
								!degree ||
								!fieldOfStudy ||
								!marks ||
								!university ||
								!joinMonth ||
								!joinYear ||
								!endMonth ||
								!endYear ||
								!country ||
								!state ||
								!city ||
								(
									editDegree.degree === degree &&
									editDegree.field_of_study === fieldOfStudy &&
									editDegree.marks === marks &&
									editDegree.institution === university &&
									editDegree.joining_month === joinMonth &&
									editDegree.joining_year === joinYear &&
									editDegree.end_month === endMonth &&
									editDegree.end_year === endYear &&
									editDegree.country === country &&
									editDegree.state === state &&
									editDegree.city === city

								)

							)
								: (
									!degree ||
									!fieldOfStudy ||
									!marks ||
									!university ||
									!joinMonth ||
									!joinYear ||
									!endMonth ||
									!endYear ||
									!country ||
									!state ||
									!city

								)}
						/>
						{
							editDegree &&
							<View style={{ marginTop: 16 }}>
								<NoBgButton
									title='Delete'
									dangerButton
									onPress={() => setShowPopUp(true)}
								/>
							</View>
						}
						{
							error &&
							<View style={{ marginTop: 8 }}>
								<Error message={error} />
							</View>
						}

					</Animated.View>
				</View>
			</Animated.View>
		</>
	)
}

