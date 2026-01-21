import { Image, Dimensions, Linking, Pressable, Share, StyleSheet, ScrollView, Text, View } from 'react-native';
import IconButton from '@/components/profile/IconButton';
import TopSection from '@/components/jobs/resume/TopSection';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomName from '@/components/profile/home/BottomName';
import Menu, { MenuButton } from '@/components/jobs/Menu';
import React from 'react';
import ReadMore from '@/components/general/ReadMore';
import { DetailsList } from '../jobView/page';
import { Rating } from '@/app/(freeRoutes)/jobs/resume/language';
import OtherCertificationListing from '@/components/jobs/resume/CertificationListing';
import { Portal } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/zustand/stores';
import { useJobsState } from '@/zustand/jobsStore';
import type { JobsState } from '@/zustand/jobsStore';

const { width } = Dimensions.get('window');


type ExperienceListingProps = {
  children?: React.ReactNode;
  image: any;
  onPress?: () => void;
  showLine?: boolean;
  showPress?: boolean;
}

export function ExperienceListing({ children, image, onPress = () => { }, showLine = true, showPress = false }: ExperienceListingProps) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={[styles.experienceContainer, pressed && showPress && { marginHorizontal: -16, backgroundColor: '#f5f5f5', paddingHorizontal: 16 }]}>
          <View>
            <View style={styles.logoContainer}>
              <Image source={image} style={styles.logo} />
            </View>
            {showLine && <View style={styles.sideLine} />}
          </View>
          <View>
            {children}
          </View>
        </View>
      )}
    </Pressable>
  )
}

export function Header({ menuRef, title }: { menuRef: React.RefObject<any>, title?: string }) {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const focused = useIsFocused();
  return (
    focused &&
    <Portal>
      <View style={[styles.header, { top: 0, paddingTop: top + 8 }]}>
        {
          title && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <IconButton onPress={() => router.back()}>
                <Image source={require('@/assets/images/Back.png')} style={styles.menuIcon} />
              </IconButton>
              <Text style={styles.headerText}>{title}</Text>
            </View>
          )
        }
        <View style={[!title && { flex: 1, alignItems: 'flex-end' }]}>
          <IconButton onPress={() => menuRef?.current.open()}>
            <Image source={require('@/assets/images/profile/home/menu.png')} style={styles.menuIcon} />
          </IconButton>
        </View>
      </View>
    </Portal>

  )
}

export function ResumeDetails({ showLess = false, jobsState, userState }: { showLess?: boolean, jobsState?: JobsState, userState?: any }) {
  let jobs, user;
  if (!jobsState) {
    jobs = useJobsState(state => state);
  }
  else {
    jobs = jobsState;
  }
  if (!userState) {
    user = useUserStore(state => state);
  }
  else {
    user = userState;
  }
  return (
    <View style={[styles.container]}>
      <View>
        <Text style={styles.heading}>About</Text>
        {jobs.about ? <ReadMore
          text={jobs.about}
        />
          : (
            <Text style={styles.smallText}>The user hasn't shared their story yet.</Text>
          )
        }
      </View>
      <View>
        <Text style={styles.heading}>Experience</Text>
        {
          (jobs.previous_experience && jobs.previous_experience.length > 0) ?
            <View style={{}}>
              {
                jobs.previous_experience.map((experience, index) => (
                  <ExperienceListing
                    image={experience.company.logo ? { uri: 'https://api.coderserve.com' + experience.company.logo } : require('@/assets/images/jobs/experienceImg.png')}
                    key={index}
                    showLine={jobs.previous_experience ? (index !== jobs.previous_experience.length - 1) : false}
                  >
                    <View style={{ width: width - 96 }}>
                      <Text style={styles.containerPrimaryHeading}>{experience.job_role}</Text>
                      <Text style={styles.containerSecondaryHeading}>{experience.company.name}</Text>
                      <Text style={styles.containerTertiaryHeading}>{experience.joining_month.slice(0, 3)} {experience.joining_year} - {experience.end_month === 'Present' || experience.end_year === 'Present' ? 'Present' : `${experience.end_month.slice(0, 3)} ${experience.end_year}`} ({experience.job_type})</Text>
                      <Text style={styles.containerTertiaryHeading}>{experience.city}, {experience.country}</Text>
                      {
                        experience.description && (
                          <View style={{ marginTop: 4, width: width - 96 }}>
                            <ReadMore
                              text={experience.description + 'something extra extra'}
                              numberOfLines={2}
                              textStyle={{ color: '#a6a6a6', fontSize: 11 }}
                            />
                          </View>

                        )
                      }
                    </View>
                  </ExperienceListing>
                ))
              }

            </View>
            :
            <Text style={styles.smallText}>The user hasn't shared their experience yet.</Text>
        }


      </View>
      <View>
        <Text style={styles.heading}>Education</Text>
        {
          (jobs.degrees && jobs.degrees.length > 0) ?
            <View style={{ marginBottom: -32 }}>
              {
                jobs.degrees.map((degree, index) => (
                  <ExperienceListing
                    image={require('@/assets/images/jobs/educationImg.png')}
                    key={index}
                    showLine={jobs.degrees ? (index !== jobs.degrees.length - 1) : false}
                  >
                    <View style={{ marginBottom: 32, width: width - 96 }}>
                      <Text style={styles.containerPrimaryHeading}>{degree.degree}</Text>
                      <Text style={styles.containerSecondaryHeading}>{degree.field_of_study}</Text>
                      <Text style={styles.containerTertiaryHeading}>Scored {degree.marks}%</Text>
                      <Text style={styles.containerTertiaryHeading}>{degree.institution}</Text>
                      <Text style={styles.containerTertiaryHeading}>{degree.joining_month.slice(0, 3)} {degree.joining_year} - {degree.end_month === 'Present' || degree.end_year === 'Present' ? 'Present' : `${degree.end_month.slice(0, 3)} ${degree.end_year}`}</Text>
                      <Text style={styles.containerTertiaryHeading}>{degree.city}, {degree.country}</Text>
                    </View>
                  </ExperienceListing>
                ))
              }

            </View>
            :
            <Text style={styles.smallText}>The user hasn't shared their education details yet.</Text>
        }
      </View>
      <View>
        <Text style={styles.heading}>Certifications</Text>
        <Text style={styles.smallText}>The user hasn't completed any certifications yet.</Text>
      </View>
      <View>
        <Text style={styles.heading}>Other Certifications</Text>
        {
          jobs.other_certifications && jobs.other_certifications.length > 0 ? (
            <View style={{ marginTop: 8, gap: 16 }}>
              {/* @ts-ignore */}
              {jobs.other_certifications.map((certification, index) => (
                <OtherCertificationListing
                  certification={certification}
                  key={index}
                  onPress={() => Linking.openURL(certification.link)}
                />
              ))}
            </View>
          ) :

            <Text style={styles.smallText}>The user hasn't shared any certifications yet.</Text>
        }
      </View>
      <View>
        <Text style={styles.heading}>Challenges</Text>
        <Text style={styles.smallText}>The user hasn't completed any challenges yet.</Text>
      </View>
      {
        !showLess && (
          <View style={{ gap: 48 }}>
            <View>
              <Text style={styles.heading}>Skills</Text>
              {
                (jobs.skills && jobs.skills.length > 0) ?
                  <View style={{ marginTop: 8, marginBottom: -8 }}>
                    <DetailsList
                      content={jobs.skills}
                    />
                  </View>
                  :
                  <Text style={styles.smallText}>The user hasn't shared their skills yet.</Text>
              }
            </View>
            <View>
              <Text style={styles.heading}>Languages</Text>
              {
                jobs.languages && jobs.languages.length > 0 ? (
                  <>
                    {
                      jobs.languages.map((language, index) => (
                        <View key={index} style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 13, color: '#737373' }}>{language.language}</Text>
                          <View style={{ width: 91 }}>
                            <Rating
                              stars={language.rating}
                              editable={false}
                              size={14}
                            />
                          </View>
                        </View>
                      ))
                    }
                  </>
                ) :
                  <Text style={styles.smallText}>The user hasn't shared any languages they know yet.</Text>
              }
            </View>
            <View>
              <Text style={styles.heading}>Date of Birth</Text>
              {user.dobDate && user.dobMonth && user.dobYear ? <Text style={[styles.smallText, { color: '#737373' }]}>{user.dobDate} {user.dobMonth} {user.dobYear}</Text> : <Text style={styles.smallText}>The user hasn't shared their date of birth yet.</Text>}
            </View>
            <View>
              <Text style={styles.heading}>Get In Touch</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                {
                  user.email && (
                    <IconButton
                      onPress={() => Linking.openURL(`mailto:${user.email}`)}
                    >
                      <Image source={require('@/assets/images/jobs/Email.png')} style={styles.menuIcon} />
                    </IconButton>
                  )
                }
                {
                  user.mobileCountryCode && user.mobile && (
                    <IconButton
                      onPress={() => Linking.openURL(`tel:${user.mobileCountryCode + ' ' + user.mobile}`)}
                    >
                      <Image source={require('@/assets/images/jobs/Phone.png')} style={styles.menuIcon} />
                    </IconButton>

                  )
                }
                {
                  user.whatsappNumber && user.whatsappCountryCode && (
                    <IconButton
                      onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=${user.whatsappCountryCode}${user.whatsappNumber}`)}
                    >
                      <Image source={require('@/assets/images/jobs/WhatsApp.png')} style={styles.menuIcon} />
                    </IconButton>
                  )
                }
                {
                  user.gitHub && (
                    <IconButton
                      onPress={() => Linking.openURL(user.gitHub ? user.gitHub : 'https://github.com/')}
                    >
                      <Image source={require('@/assets/images/jobs/GitHub.png')} style={styles.menuIcon} />
                    </IconButton>
                  )
                }
                {
                  user.website && (
                    <IconButton
                      onPress={() => Linking.openURL(user.website ? user.website : 'https://www.example.com')}
                    >
                      <Image source={require('@/assets/images/jobs/Website.png')} style={styles.menuIcon} />
                    </IconButton>
                  )
                }

              </View>
            </View>
          </View>
        )
      }
    </View>


  )
}

export default function Resume() {
  const router = useRouter();
  const user = useUserStore(state => state);
  const menuRef = React.useRef<any>(null);
  const focused = useIsFocused();
  const shareResume = async () => {
    try {
      await Share.share({
        message: 'https://coderserve.com/resume/' + user.username,
      });
    } catch (error) {
      console.error('Error sharing resume:', error);
    }
  }
  const { top } = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ backgroundColor: 'white' }}>
      {
        focused && <Header
          menuRef={menuRef}
          title='Your Resume'
        />}

      <View style={{ marginTop: 57 + top }}>
        <TopSection />
      </View>
      <View style={styles.body}>
        <ResumeDetails />
        <BottomName />
      </View>

      <Menu menuRef={menuRef}>
        <MenuButton
          heading='Employment Status'
          text="Show if you're currently job hunting."
          onPress={() => {
            menuRef?.current.close();
            router.push('/(freeRoutes)/jobs/resume/employmentStatus')
          }}
        />
        <MenuButton
          heading='Salary Expectation'
          text='Set expected salary for job matches.'
          onPress={() => {
            menuRef?.current.close();
            router.push('/(freeRoutes)/jobs/resume/salaryExpectations')
          }}
        />
        <MenuButton
          heading='Update Resume'
          text='Add/remove resume details.'
          onPress={() => {
            menuRef?.current.close();
            router.push('/jobs/resume/update')
          }}
        />
        <MenuButton
          heading='Share Resume'
          text='Share your resume via link.'
          onPress={shareResume}
        />

      </Menu>
    </ScrollView>
  )
}


export const styles = StyleSheet.create({
  container: {
    marginTop: 48,
    gap: 48,
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  smallText: {
    fontSize: 13,
    color: '#A6A6A6',
    textAlign: 'justify'
  },
  readButton: {
    fontSize: 13,
    color: '#006dff',
    textDecorationLine: 'underline',
  },
  name: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: 'bold'
  },
  body: {
    marginHorizontal: 16,
  },
  profileImg: {
    width: 96,
    height: 96,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#f5f5f5',
  },
  status: {
    color: '#004aad',
    fontSize: 13,
    fontWeight: 'bold',
  },
  profileRow: {
    flexDirection: 'row',
    position: 'relative',
    marginTop: -32
  },
  header: {
    backgroundColor: 'white',
    top: 0,
    width: '100%',
    zIndex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  bgImage: {
    width: '100%',
    height: 164,
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  experienceContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
  },
  logoContainer: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    backgroundColor: 'white',
  },
  logo: {
    margin: 8,
    height: 24,
    width: 24,
  },
  containerPrimaryHeading: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  containerSecondaryHeading: {
    marginTop: 4,
    fontSize: 13,
  },
  containerTertiaryHeading: {
    marginTop: 4,
    fontSize: 13,
    color: '#737373',
  },
  sideLine: {
    width: 1,
    flex: 1,
    marginLeft: 22,
    marginTop: 8,
    backgroundColor: '#eeeeee',
  },
  addEntryContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginTop: 8
  },
  certificationContainer: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    borderRadius: 12,
    gap: 16,
    alignItems: 'center',
  }
})
