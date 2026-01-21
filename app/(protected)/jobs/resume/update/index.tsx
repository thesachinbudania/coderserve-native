import TopSection from "@/components/jobs/resume/TopSection";
import Layout from "@/components/general/PageLayout";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { ProfileSection } from "@/components/profile/home/ProfileSection";
import { Dimensions, Linking, Image } from "react-native";
import IconButton from "@/components/profile/IconButton";
import BottomName from "@/components/profile/home/BottomName";
import ReadMoreText from "@/components/general/ReadMore";
import { ExperienceListing } from "../index";
import SmallTextButton from "@/components/buttons/SmallTextButton";
import NoBgButton from "@/components/buttons/NoBgButton";
import { DetailsList } from "../../jobView/page";
import { Rating } from "@/app/(freeRoutes)/jobs/resume/language";
import OtherCertificationListing from "@/components/jobs/resume/CertificationListing";
import { useUserStore } from "@/zustand/stores";
import { useJobsState, useResumeEdit } from "@/zustand/jobsStore";
import { useRouter } from "expo-router";
import { apiUrl } from '@/constants/env';

const { width } = Dimensions.get("window");

export function EditResume({ showLess = false, editable = true }: { showLess?: boolean, editable?: boolean }) {
  const user = useUserStore(state => state);
  const jobs = useJobsState(state => state);
  const { setResumeEdit } = useResumeEdit(state => state);
  const router = useRouter();

  return (
    <View style={styles.resumeContainer}>
      {jobs.about ? (
        <View>
          <Text style={styles.detailsHeading}>About</Text>
          {
            editable ? (
              <Pressable
                onPress={() => router.push('/(freeRoutes)/jobs/resume/about')}
              >
                {({ pressed }) => (
                  <View
                    style={[
                      styles.editDetailsContainer,
                      pressed && { backgroundColor: "#f5f5f5" },
                    ]}
                  >
                    <ReadMoreText text={jobs.about || ""} />
                  </View>
                )}
              </Pressable>
            ) : <ReadMoreText text={jobs.about || ""} />
          }
        </View>
      ) : (
        <ProfileSection
          title="About"
          content={editable ? "You haven't introduced yourself yet. Let the world know about your  story!" : "This user hasn't shared their story yet."}
          onPress={() => router.push('/(freeRoutes)/jobs/resume/about')}
          editable={editable}
        />
      )}
      {jobs.previous_experience && jobs.previous_experience.length > 0 ? (
        <View>
          <Text style={styles.detailsHeading}>Experience</Text>
          {editable ? (jobs.previous_experience.map((experience, index) => (
            <ExperienceListing
              image={
                experience.company.logo
                  ? {
                    uri:
                      apiUrl + experience.company.logo,
                  }
                  : require("@/assets/images/jobs/experienceImg.png")
              }
              key={index}
              showPress
              onPress={() => {
                setResumeEdit({
                  edit: true,
                  id: experience.id,
                });
                router.push('/(freeRoutes)/jobs/resume/workExperience');
              }}
            >
              <View style={{ marginBottom: 32, width: width - 96 }}>
                <Text style={styles.containerPrimaryHeading}>
                  {experience.job_role}
                </Text>
                <Text style={styles.containerSecondaryHeading}>
                  {experience.company.name}
                </Text>
                <Text style={styles.containerTertiaryHeading}>
                  {experience.joining_month.slice(0, 3)}{" "}
                  {experience.joining_year} -{" "}
                  {experience.end_month === "Present" ||
                    experience.end_year === "Present"
                    ? "Present"
                    : `${experience.end_month.slice(0, 3)} ${experience.end_year}`}{" "}
                  ({experience.job_type})
                </Text>
                <Text style={styles.containerTertiaryHeading}>
                  {experience.city}, {experience.country}
                </Text>
                {experience.description && (
                  <View style={{ marginTop: 4, width: width - 96 }}>
                    <ReadMoreText
                      text={experience.description}
                      numberOfLines={2}
                      textStyle={{ color: "#a6a6a6" }}
                    />
                  </View>
                )}
              </View>
            </ExperienceListing>
          ))) : jobs.previous_experience.map((experience, index) => (
            <ExperienceListing
              image={
                experience.company.logo
                  ? {
                    uri:
                      apiUrl + experience.company.logo,
                  }
                  : require("@/assets/images/jobs/experienceImg.png")
              }
              key={index}
              showLine={jobs.previous_experience ? index !== jobs.previous_experience.length - 1 : false}
            >
              <View style={{ marginBottom: 32, width: width - 96 }}>
                <Text style={styles.containerPrimaryHeading}>
                  {experience.job_role}
                </Text>
                <Text style={styles.containerSecondaryHeading}>
                  {experience.company.name}
                </Text>
                <Text style={styles.containerTertiaryHeading}>
                  {experience.joining_month.slice(0, 3)}{" "}
                  {experience.joining_year} -{" "}
                  {experience.end_month === "Present" ||
                    experience.end_year === "Present"
                    ? "Present"
                    : `${experience.end_month.slice(0, 3)} ${experience.end_year}`}{" "}
                  ({experience.job_type})
                </Text>
                <Text style={styles.containerTertiaryHeading}>
                  {experience.city}, {experience.country}
                </Text>
                {experience.description && (
                  <View style={{ marginTop: 4, width: width - 96 }}>
                    <ReadMoreText
                      text={experience.description}
                      numberOfLines={2}
                      textStyle={{ color: "#a6a6a6" }}
                    />
                  </View>
                )}
              </View>
            </ExperienceListing>
          ))
          }
          {
            editable ? (
              <View style={styles.addEntryContainer}>
                <View
                  style={[styles.logoContainer, { backgroundColor: "#f5f5f5" }]}
                >
                  <Image
                    source={require("@/assets/images/jobs/plus.png")}
                    style={styles.logo}
                  />
                </View>
                <SmallTextButton
                  title="Add Experience"
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                  onPress={() => {
                    setResumeEdit({
                      edit: false,
                      id: null,
                    })
                    router.push('/(freeRoutes)/jobs/resume/workExperience')
                  }}
                />
              </View>
            ) : null
          }
        </View>
      ) : (
        <ProfileSection
          title="Experience"
          content={editable ? "You haven’t added any experience yet. Share your journey and expertise!" : "This user hasn't shared their experience yet."}
          onPress={() => {
            setResumeEdit({
              edit: false,
              id: null,
            })
            router.push('/(freeRoutes)/jobs/resume/workExperience')
          }
          }
          editable={editable}
        />
      )}

      {jobs.degrees && jobs.degrees.length > 0 ? (
        <View>
          <Text style={styles.detailsHeading}>Education</Text>
          {editable ? (jobs.degrees.map((degree, index) => (
            <ExperienceListing
              image={require("@/assets/images/jobs/educationImg.png")}
              key={index}
              showPress
              onPress={() => {
                setResumeEdit({
                  edit: true,
                  id: degree.id
                })
                router.push('/(freeRoutes)/jobs/resume/education');
              }
              }
            >
              <View style={{ marginBottom: 32, width: width - 96 }}>
                <Text style={styles.containerPrimaryHeading}>
                  {degree.degree}
                </Text>
                <Text style={styles.containerSecondaryHeading}>
                  {degree.field_of_study}
                </Text>
                <Text style={styles.containerTertiaryHeading}>
                  Scored {degree.marks}%
                </Text>
                <Text style={styles.containerTertiaryHeading}>
                  {degree.institution}
                </Text>
                <Text style={styles.containerTertiaryHeading}>
                  {degree.joining_month.slice(0, 3)} {degree.joining_year} -{" "}
                  {degree.end_month === "Present" ||
                    degree.end_year === "Present"
                    ? "Present"
                    : `${degree.end_month.slice(0, 3)} ${degree.end_year}`}
                </Text>
                <Text style={styles.containerTertiaryHeading}>
                  {degree.city}, {degree.country}
                </Text>
              </View>
            </ExperienceListing>
          ))) : jobs.degrees.map((degree, index) => (
            <ExperienceListing
              image={require("@/assets/images/jobs/educationImg.png")}
              key={index}
              showLine={jobs.degrees ? index !== jobs.degrees.length - 1 : false}
            >
              <View style={{ marginBottom: 32, width: width - 96 }}>
                <Text style={styles.containerPrimaryHeading}>
                  {degree.degree}
                </Text>
                <Text style={styles.containerSecondaryHeading}>
                  {degree.field_of_study}
                </Text>
                <Text style={styles.containerTertiaryHeading}>
                  Scored {degree.marks}%
                </Text>
                <Text style={styles.containerTertiaryHeading}>
                  {degree.institution}
                </Text>
                <Text style={styles.containerTertiaryHeading}>
                  {degree.joining_month.slice(0, 3)} {degree.joining_year} -{" "}
                  {degree.end_month === "Present" ||
                    degree.end_year === "Present"
                    ? "Present"
                    : `${degree.end_month.slice(0, 3)} ${degree.end_year}`}
                </Text>
                <Text style={styles.containerTertiaryHeading}>
                  {degree.city}, {degree.country}
                </Text>
              </View>
            </ExperienceListing>
          ))
          }
          {
            editable ? (
              <View style={styles.addEntryContainer}>
                <View
                  style={[styles.logoContainer, { backgroundColor: "#f5f5f5" }]}
                >
                  <Image
                    source={require("@/assets/images/jobs/plus.png")}
                    style={styles.logo}
                  />
                </View>
                <SmallTextButton
                  title="Add Education"
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                  onPress={() => {
                    setResumeEdit({
                      edit: false,
                      id: null,
                    })
                    router.push('/(freeRoutes)/jobs/resume/education')
                  }
                  }
                />
              </View>
            ) : null
          }
        </View>
      ) : (
        <ProfileSection
          title="Education"
          content={editable ? "You haven’t added any education yet. Highlight your academic achievements!" : "This user hasn't shared their education details yet."}
          onPress={() => {
            setResumeEdit({
              edit: false,
              id: null,
            })
            router.push('/(freeRoutes)/jobs/resume/education')
          }
          }
          editable={editable}
        />
      )}
      <View>
        <Text style={styles.detailsHeading}>Certifications</Text>
        <Text style={styles.detailsContent}>
          {editable ? "You haven't completed any certifications yet. Once you complete one, it'll be showcased here." :
            "This user hasn't completed any certifications yet."
          }
        </Text>
      </View>
      {jobs.other_certifications && jobs.other_certifications.length > 0 ? (
        <View>
          <Text style={styles.detailsHeading}>Other Certifications</Text>
          <View style={{ gap: 16 }}>
            {jobs.other_certifications.map((certification, index) => (
              <OtherCertificationListing
                certification={certification}
                key={index}
                onPress={() => {
                  if (!editable) {
                    Linking.openURL(certification.link);
                    return;
                  }
                  setResumeEdit({
                    edit: true,
                    id: certification.id,
                  });
                  router.push('/(freeRoutes)/jobs/resume/otherCertifications');
                }
                }
              />
            ))}
          </View>{
            editable && (
              <View style={styles.buttonContainer}>
                <NoBgButton
                  title="Add More"
                  onPress={() => {
                    setResumeEdit({
                      edit: false,
                      id: null,
                    });
                    router.push('/(freeRoutes)/jobs/resume/otherCertifications');
                  }
                  }
                />
              </View>
            )
          }

        </View>
      ) : (
        <ProfileSection
          title="Other Certifications"
          content={editable ? "You haven’t added any certifications yet. Showcase your achievements and skills!" : "This user hasn't shared any certifications yet."}
          onPress={() => {
            setResumeEdit({
              edit: false,
              id: null,
            });
            router.push('/(freeRoutes)/jobs/resume/otherCertifications');
          }
          }
          editable={editable}
        />
      )}

      <View>
        <Text style={styles.detailsHeading}>Challenges</Text>
        <Text style={styles.detailsContent}>
          {editable ? "You haven't completed any challenge yet. Once you do, they'll be showcased here." : "This user hasn't completed any challenges yet."}
        </Text>
      </View>
      {
        !showLess && (
          <View style={{ gap: 48 }}>
            {jobs.skills && jobs.skills.length > 0 ? (
              <View>
                <Text style={styles.detailsHeading}>Skills</Text>
                <Pressable
                  onPress={() =>
                    router.push('/(freeRoutes)/jobs/resume/skills')
                  }
                >
                  {({ pressed }) => (
                    <View
                      style={[
                        { marginBottom: -8 },
                        pressed && {
                          marginHorizontal: -16,
                          paddingHorizontal: 16,
                          backgroundColor: "#f5f5f5",
                        },
                      ]}
                    >
                      <DetailsList content={jobs.skills || []} />
                    </View>
                  )}
                </Pressable>
              </View>
            ) : (
              <ProfileSection
                title="Skills"
                content="You haven’t added any skills yet. Showcase your expertise and stand out!"
                onPress={() => router.push('/(freeRoutes)/jobs/resume/skills')}
              />
            )}
            {jobs.languages && jobs.languages.length > 0 ? (
              <View>
                <Text style={styles.detailsHeading}>Languages</Text>
                <View style={{ marginTop: -8, marginBottom: 16 }}>
                  {jobs.languages.map((language, index) => (
                    <Pressable
                      onPress={() => {
                        setResumeEdit({
                          edit: true,
                          id: language.id,
                        });
                        router.push('/(freeRoutes)/jobs/resume/language');
                      }
                      }
                      key={index}
                    >
                      {({ pressed }) => (
                        <View
                          key={index}
                          style={[
                            {
                              marginTop: 8,
                              flexDirection: "row",
                              justifyContent: "space-between",
                              paddingVertical: 4,
                              marginVertical: -4,
                            },
                            pressed && {
                              marginHorizontal: -16,
                              paddingHorizontal: 16,
                              backgroundColor: "#f5f5f5",
                            },
                          ]}
                        >
                          <Text style={{ fontSize: 13, color: "#737373" }}>
                            {language.language}
                          </Text>
                          <View style={{ width: 91 }}>
                            <Rating
                              stars={language.rating}
                              editable={false}
                              size={14}
                            />
                          </View>
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
                <View style={styles.buttonContainer}>
                  <NoBgButton
                    title="Add More"
                    onPress={() => {
                      setResumeEdit({
                        edit: false,
                        id: null,
                      });
                      router.push('/(freeRoutes)/jobs/resume/language');
                    }
                    }
                  />
                </View>
              </View>
            ) : (
              <ProfileSection
                title="Languages"
                content="You haven't added any languages yet. Highlight the languages you know!"
                onPress={() => {
                  setResumeEdit({
                    edit: false,
                    id: null,
                  });
                  router.push('/(freeRoutes)/jobs/resume/language');
                }
                }
              />
            )}

            <View>
              {user.dobDate && user.dobMonth && user.dobYear ? (
                <>
                  <Text style={styles.detailsHeading}>Date of Birth</Text>
                  <Pressable
                    onPress={() => router.push('/(freeRoutes)/profile/birthday')}
                  >
                    {
                      ({ pressed }) => <Text style={[styles.detailsContent, { color: '#737373' }, pressed && { backgroundColor: '#f5f5f5', marginHorizontal: -16, paddingHorizontal: 16 }]}>
                        {user.dobDate} {user.dobMonth} {user.dobYear}
                      </Text>
                    }

                  </Pressable>
                </>
              ) : (
                <ProfileSection
                  title="Date of Birth"
                  content="You haven’t added your date of birth yet. Add it to showcase your age!"
                  onPress={() => router.push('/(freeRoutes)/profile/birthday')}
                />
              )}
            </View>
            <View>
              <Text style={styles.detailsHeading}>Get In Touch</Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                {user.email && (
                  <IconButton onPress={() => Linking.openURL(`mailto:${user.email}`)}>
                    <Image
                      source={require("@/assets/images/jobs/Email.png")}
                      style={styles.menuIcon}
                    />
                  </IconButton>
                )}
                {user.mobileCountryCode && user.mobile && (
                  <IconButton
                    onPress={() =>
                      Linking.openURL(
                        `tel:${user.mobileCountryCode + " " + user.mobile}`,
                      )
                    }
                  >
                    <Image
                      source={require("@/assets/images/jobs/Phone.png")}
                      style={styles.menuIcon}
                    />
                  </IconButton>
                )}
                {user.whatsappNumber && user.whatsappCountryCode && (
                  <IconButton
                    onPress={() =>
                      Linking.openURL(
                        `https://api.whatsapp.com/send?phone=${user.whatsappCountryCode}${user.whatsappNumber}`,
                      )
                    }
                  >
                    <Image
                      source={require("@/assets/images/jobs/WhatsApp.png")}
                      style={styles.menuIcon}
                    />
                  </IconButton>
                )}
                {user.gitHub && (
                  <IconButton
                    onPress={() =>
                      Linking.openURL(
                        user.gitHub ? user.gitHub : "https://github.com/",
                      )
                    }
                  >
                    <Image
                      source={require("@/assets/images/jobs/GitHub.png")}
                      style={styles.menuIcon}
                    />
                  </IconButton>
                )}
                {user.website && (
                  <IconButton
                    onPress={() =>
                      Linking.openURL(
                        user.website ? user.website : "https://www.example.com",
                      )
                    }
                  >
                    <Image
                      source={require("@/assets/images/jobs/Website.png")}
                      style={styles.menuIcon}
                    />
                  </IconButton>
                )}
              </View>
            </View>
          </View>
        )
      }
    </View>
  );
}

export default function () {
  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingBottom: -64 }}>
      <Layout
        headerTitle="Update Resume"
        bottomPadding={false}
      >
        <View style={styles.container}>
          <TopSection />
          <EditResume />
        </View>
        <BottomName />
      </Layout>
    </View>
  );
}

export const styles = StyleSheet.create({
  editDetailsContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  container: {
    marginTop: -24,
    marginHorizontal: -16,
  },
  resumeContainer: {
    marginHorizontal: 16,
    marginTop: 32,
    gap: 40,
  },
  detailsHeading: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 6,
  },
  menuIcon: {
    height: 24,
    width: 24,
  },
  detailsContent: {
    fontSize: 13,
    color: "#a6a6a6",
    textAlign: "justify",
    verticalAlign: "bottom",
  },
  experienceContainer: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  logoContainer: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#f5f5f5",
  },
  logo: {
    margin: 8,
    height: 24,
    width: 24,
  },
  containerPrimaryHeading: {
    fontSize: 13,
    fontWeight: "bold",
  },
  containerSecondaryHeading: {
    marginTop: 4,
    fontSize: 13,
  },
  containerTertiaryHeading: {
    marginTop: 4,
    fontSize: 13,
    color: "#737373",
  },
  sideLine: {
    width: 2,
    flex: 1,
    marginLeft: 24,
    marginTop: 8,
    backgroundColor: "#f5f5f5",
  },
  addEntryContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginTop: 8,
  },
  certificationContainer: {
    flexDirection: "row",
    padding: 16,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    borderRadius: 12,
    gap: 16,
    alignItems: "center",
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: "#f5f5f5",
    borderRadius: 9,
    marginTop: 16,
  },
});
