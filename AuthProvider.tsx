import Auth from './pages/authentication/page';
import Home from './pages/home/page';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/store';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { setToken } from './app/slices';
import { setUser } from './app/userSlice';
import { setSalary, setAbout, setEmploymentStatus } from './app/jobsSlice';
import DeviceInfo from 'react-native-device-info';
import { useGetResumeQuery } from './pages/jobs/apiSlice';
import { ActivityIndicator, View } from 'react-native';

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', 'backgroundColor': 'white' }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  )

}


export default function AuthProvider() {
  const dispatch = useDispatch();
  const [areTokensFetched, setAreTokensFetched] = React.useState(false);
  const device = DeviceInfo.getBrand() + ' ' + DeviceInfo.getModel();
  const { data: resumeData, isLoading, isError } = useGetResumeQuery({});
  React.useEffect(() => {
    if (resumeData) {
      dispatch(setEmploymentStatus(resumeData.employment_status));
      dispatch(setAbout(resumeData.about));
      dispatch(setSalary({ currency: resumeData.expected_salary_currency, salary: resumeData.expected_salary }));
    }
  }, [resumeData])

  React.useEffect(() => {
    function fetchTokens() {
      SecureStore.getItemAsync('refreshToken').then((refreshToken) => {
        SecureStore.getItemAsync('accessToken').then((accessToken) => {
          if (refreshToken && accessToken) {
            dispatch(setToken({ refreshToken, accessToken }));
          }
          setAreTokensFetched(true);
        });
      });
    }
    fetchTokens();
    dispatch(setUser({ device }));
  }, []);


  const token = useSelector((state: RootState) => state.auth.refreshToken);
  const username = useSelector((state: RootState) => state.user.username);
  if (isLoading && !isError && token) {
    return <LoadingScreen />
  }
  return !areTokensFetched ? null : token && username ? <Home /> : <Auth />;
}
