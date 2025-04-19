import { Animated, BackHandler, Dimensions, Keyboard, Platform, View, SafeAreaView, TouchableWithoutFeedback, useAnimatedValue } from 'react-native';
import SearchBar from '../components/SearchBar';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '../Page';
import Header from './Header';
import { SectionContainer, SectionOption, Section } from './OptionsSection';

export default function ControlCentre() {
	const [search, setSearch] = React.useState('');
	const navigation = useNavigation<NavigationProp>();
	const [isFocused, setIsFocused] = React.useState(false);
	const contentOpacity = useAnimatedValue(1);
	const searchBarMarginTop = useAnimatedValue(57);
	const width = Dimensions.get('window').width;
	const contentWidth = useAnimatedValue(width - 32);

	React.useEffect(() => {
		navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
		return () => navigation.getParent()?.setOptions({
			tabBarStyle: {
				display: 'flex',
				height: 54,
				marginBottom: 0,
				paddingBottom: 0,
			}
		});
	}, [])
	React.useEffect(() => {
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			if (isFocused) {
				Keyboard.dismiss(); // Dismiss keyboard manually
				setIsFocused(false); // Hide search bar
				return true; // Prevent default back action
			}
			navigation.goBack();
			return true;
		});

		return () => backHandler.remove();
	}, [isFocused]);
	React.useEffect(() => {
		if (isFocused) {
			Animated.timing(contentOpacity, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start();
			Animated.timing(searchBarMarginTop, {
				toValue: 4,
				duration: 200,
				useNativeDriver: true,
			}).start();
			Animated.timing(contentWidth, {
				toValue: width,
				duration: 200,
				useNativeDriver: false,
			}).start();
		} else {
			Animated.timing(contentOpacity, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}).start();
			Animated.timing(searchBarMarginTop, {
				toValue: 57,
				duration: 200,
				useNativeDriver: true,
			}).start();
			Animated.timing(contentWidth, {
				toValue: width - 32,
				duration: 200,
				useNativeDriver: false
			}).start();
		}
	}, [isFocused]);
	return (
		<SafeAreaView style={[{ flex: 1 }, Platform.OS === 'ios' && { marginTop: -16, }]}>
			<View style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? 64 : 80, position: 'relative', backgroundColor: 'white' }}>
				<Animated.View style={{ opacity: contentOpacity }}>
					<Header onBackPress={() => navigation.goBack()} title='Your Control Centre' />
				</Animated.View>
				<Animated.ScrollView contentContainerStyle={{ alignItems: 'center' }} style={{ flex: 1, backgroundColor: isFocused ? '#f7f7f7' : 'white', transform: [{ translateY: searchBarMarginTop }], paddingTop: isFocused ? 0 : 24, marginBottom: isFocused ? -64 : 0 }}>
					<TouchableWithoutFeedback onPress={() => {
						Keyboard.dismiss();
						setIsFocused(false)
					}} >
						<Animated.View style={{ width: contentWidth }}>
							<View style={{ marginBottom: !isFocused ? 48 : 0 }}>
								<SearchBar
									onChangeText={setSearch}
									setIsFocused={setIsFocused}
									isFocused={isFocused}
								/>
							</View>
							<Animated.View style={{ opacity: contentOpacity }}>
								<SectionContainer>
									<Section title='Your Account'>
										<SectionOption
											title='Account Center'
											subTitle='Manage email, password, pro membership, ad preferences, account status, device permissions, and login activity.'
											onPress={() => navigation.navigate('AccountCenter', {
												screen: 'Home',
												params: {
													popUpVisible: false,
													title: '',
													body: ''
												}

											})}
										/>
									</Section>
									<Section title='Privacy & Safety Controls'>
										<SectionOption
											title='Account Visibility'
											subTitle='Toggle profile between public and private.'
										/>
										<SectionOption
											title='Blocked Users'
											subTitle='Restrict specific users from interacting with you.'
										/>
										<SectionOption
											title='Muted Profile'
											subTitle='Hide posts from selected profiles in your feed.'
										/>
										<SectionOption
											title='Tag Permissions'
											subTitle='Control who can tag you.'
										/>
										<SectionOption
											title='Comment Permissions'
											subTitle='See who can comment on your posts.'
										/>
									</Section>
									<Section title='Communication Settings'>
										<SectionOption
											title='Messaging Settings'
											subTitle='Manage incoming message requests.'
										/>
									</Section>
									<Section title='Content Engagement & Activity'>
										<SectionOption
											title='Saved Posts'
											subTitle="View all posts you've bookmarked."
										/>
										<SectionOption
											title='Liked Posts'
											subTitle="See a list of posts you've liked."
										/>
										<SectionOption
											title='Comment History'
											subTitle='Review your comments across posts.'
										/>
										<SectionOption
											title='Tagged Content'
											subTitle='Find posts where you have been tagged.'
										/>
									</Section>
									<Section title='More Info & Support'>
										<SectionOption
											title='Help Center'
											subTitle='Access support and troubleshooting resources.'
										/>
										<SectionOption
											title='About'
											subTitle='Learn about policies and terms.'
										/>
									</Section>
								</SectionContainer>
							</Animated.View>
						</Animated.View>
					</TouchableWithoutFeedback>
				</Animated.ScrollView>
			</View>
		</SafeAreaView>
	)
}

