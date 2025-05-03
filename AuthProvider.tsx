import Auth from './pages/authentication/page';
import Home from './pages/home/page';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/store';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { setToken } from './app/slices';
import { setUser } from './app/userSlice';
import { setTokenState } from './pages/authentication/signUp/signUpSlice';
import { setLanguages, setSkills, setOtherCertifications, setSalary, setAbout, setEmploymentStatus, setPreviousExperience, setDegrees } from './app/jobsSlice';
import DeviceInfo from 'react-native-device-info';
import { useGetResumeQuery } from './pages/jobs/apiSlice';
import { ActivityIndicator, View } from 'react-native';
import SignUp from './pages/authentication/signUp/page';

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
  const user = useSelector((state: RootState) => state.user);
  React.useEffect(() => {
    if (resumeData) {
      dispatch(setEmploymentStatus(resumeData.employment_status));
      dispatch(setAbout(resumeData.about));
      dispatch(setSalary({ currency: resumeData.expected_salary_currency, salary: resumeData.expected_salary }));
      dispatch(setPreviousExperience(resumeData.previous_experience));
      dispatch(setDegrees(resumeData.degrees));
      dispatch(setOtherCertifications(resumeData.other_certifications));
      dispatch(setSkills(resumeData.skills));
      dispatch(setLanguages(resumeData.languages));
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

  const { refreshToken, accessToken } = useSelector((state: RootState) => state.auth);
  const [signUpCompleted, setSignUpCompleted] = React.useState(true);
  const [signUpStep, setSignUpStep] = React.useState(0);
  const tempRefreshToken = useSelector((state: RootState) => state.auth.refreshToken);
  React.useEffect(() => {
    if (user.email && !user.username) {
      setSignUpCompleted(false);
      setSignUpStep(3);
      dispatch(setTokenState({ refresh: refreshToken, access: accessToken }));
      console.log(tempRefreshToken)
    }
    else if (user.email && user.username && (user.state === '' || user.country === '' || user.city === '')) {
      setSignUpCompleted(false);
      setSignUpStep(5);
      dispatch(setTokenState({ refresh: refreshToken, access: accessToken }));
      console.log(tempRefreshToken)
    }
    else {
      setSignUpStep(0);
      setSignUpCompleted(true);
    }
  }, [user])
  if (isLoading && !isError && refreshToken) {
    return <LoadingScreen />
  }
  return !areTokensFetched ? null : refreshToken && !signUpCompleted && signUpStep != 0 ? <SignUp
    navigate={(page: string) => { }}
    screen={signUpStep}
  /> : refreshToken && user.username ? <Home /> : <Auth />;
}
