import Header from '../../Header';
import { ActivityIndicator, BackHandler, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Section, SectionOption, SectionContainer } from '../../OptionsSection';
import React from 'react';
import MapView from 'react-native-maps';
import BottomDrawer from '../../../../../components/BottomDrawer';
import BlueButton from '../../../../../components/buttons/BlueButton';
import { useNavigation } from '@react-navigation/native';
import { useGetLoginHistoryQuery } from '../../../apiSlice';


const greyMapStyle = [
	{
		"elementType": "geometry",
		"stylers": [{ "color": "#f5f5f5" }]
	},
	{
		"elementType": "labels.icon",
		"stylers": [{ "visibility": "off" }]
	},
	{
		"elementType": "labels.text.fill",
		"stylers": [{ "color": "#616161" }]
	},
	{
		"elementType": "labels.text.stroke",
		"stylers": [{ "color": "#f5f5f5" }]
	},
	{
		"featureType": "administrative.land_parcel",
		"stylers": [{ "visibility": "off" }]
	},
	{
		"featureType": "poi",
		"stylers": [{ "visibility": "off" }]
	},
	{
		"featureType": "road",
		"elementType": "geometry",
		"stylers": [{ "color": "#cccccc" }]
	},
	{
		"featureType": "road",
		"elementType": "labels.text.fill",
		"stylers": [{ "color": "#757575" }]
	},
	{
		"featureType": "water",
		"elementType": "geometry",
		"stylers": [{ "color": "#b0b0b0" }]
	}
];

function LogInfo({ deviceName, firstSignIn, lastActivity }: { deviceName: string, firstSignIn: string, lastActivity: string }) {
	return (
		<View style={logStyles.container}>
			<View>
				<Text style={logStyles.heading}>Device name</Text>
				<Text style={logStyles.info}>{deviceName}</Text>
			</View>
			<View>
				<Text style={logStyles.heading}>First Sign-In</Text>
				<Text style={logStyles.info}>{firstSignIn}</Text>
			</View>
			<View>
				<Text style={logStyles.heading}>Last Activity</Text>
				<Text style={logStyles.info}>{lastActivity}</Text>
			</View>
		</View>
	)
}

const logStyles = StyleSheet.create({
	container: {
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#eee',
		padding: 16,
		gap: 24,
	},
	heading: {
		fontSize: 9,
		color: '#a6a6a6',
		marginBottom: 4,
	},
	info: {
		fontSize: 13
	}
})

type currentLog = {
	deviceName: string,
	signInTime: string,
	lastActivity: string,
	lat: number,
	long: number,
}

function formatDateTime(isoString: string) {
	const date = new Date(isoString);

	// Format the date (e.g., 20 Jan 2025)
	const formattedDate = date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});

	// Format the time (e.g., 10:30 am)
	const formattedTime = date.toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});

	return `${formattedDate}, ${formattedTime}`;
}

export default function Page() {
	const sheetRef = React.useRef<any>(null);
	const navigation = useNavigation();
	const { data, isLoading, error, isError } = useGetLoginHistoryQuery({});
	const [currentLog, setCurrentLog] = React.useState<currentLog | null>(null);
	const handleBackButtonPress = () => {
		navigation.goBack();
		return true;
	};
	React.useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			handleBackButtonPress,
		);

		return () => backHandler.remove();
	}, []);
	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<Header title='Login Activity' onBackPress={() => {
				navigation.goBack()
			}} />
			{isLoading && !data ? <View style={styles.loadingView}><ActivityIndicator
				color='black'
				size='large'
			/></View> :
				!isError ? (
					<ScrollView style={styles.body} contentContainerStyle={{ flex: 1 }}>
						<ScrollView contentContainerStyle={styles.logsContainer}>
							<SectionContainer>
								<Section>
									{
										data?.results?.map((log: any, index: number) => (
											<SectionOption
												key={index}
												title={log.device.device_name}
												subTitle={log.state + ', ' + log.country}
												onPress={() => {
													setCurrentLog({
														deviceName: log.device.device_name,
														signInTime: log.time,
														lastActivity: log.device.last_activity,
														lat: Number(log.lat),
														long: Number(log.long),
													})
													sheetRef.current.open()
												}}
											/>
										))
									}
								</Section>
							</SectionContainer>
							<BottomDrawer
								sheetRef={sheetRef}
								draggableIconHeight={0}
								height={552}
							>
								<View style={styles.detailsContainer}>
									{
										currentLog && currentLog.lat && currentLog.long &&
										<>
											<LogInfo
												deviceName={currentLog.deviceName}
												firstSignIn={formatDateTime(currentLog.signInTime)}
												lastActivity={formatDateTime(currentLog.lastActivity)}
											/>
											<Text style={[logStyles.heading, { marginTop: 32 }]}>Signed in from a nearby location</Text>
											<View style={styles.mapViewContainer}>
												<MapView
													style={styles.mapView}
													customMapStyle={greyMapStyle}
													initialRegion={{
														latitude: currentLog.lat,
														longitude: currentLog.long,
														latitudeDelta: Platform.OS === 'ios' ? 0.0722 : 0.0121,
														longitudeDelta: Platform.OS === 'ios' ? 0.0721 : 0.0121,
													}}
												/>
											</View>
										</>

									}
									<BlueButton
										title='Thanks'
										onPress={() => sheetRef.current.close()}
									/>
								</View>
							</BottomDrawer>
						</ScrollView>
					</ScrollView>
				) : (
					<View style={styles.loadingView}>
						<Text>{error.toString()}</Text>
					</View>
				)
			}

		</View>
	)
}


const styles = StyleSheet.create({
	body: {
		marginTop: 57,
	},
	logsContainer: {
		marginTop: 16,
		paddingHorizontal: 16,
	},
	detailsContainer: {
		flex: 1,
		paddingHorizontal: 16,
	},
	mapViewContainer: {
		borderRadius: 8,
		overflow: 'hidden',
		marginTop: 4,
		borderWidth: 1,
		borderColor: '#eee',
		marginBottom: 32,
	},
	mapView: {
		height: 184,
	},
	loadingView: {
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	}
})
