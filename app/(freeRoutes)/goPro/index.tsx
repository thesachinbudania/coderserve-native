import { ActivityIndicator, Text, Image, View, ScrollView, StatusBar } from 'react-native';
import IconButton from '@/components/profile/IconButton';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import BlueButton from '@/components/buttons/BlueButton';
import UnorderedList from '@/components/general/UnorderedList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomName from '@/components/profile/home/BottomName';
import { useState, useEffect, useRef } from 'react';
import protectedApi from '@/helpers/axios';
import errorHandler from '@/helpers/general/errorHandler';
import BottomDrawer from '@/components/BottomDrawer';

function Section({ title, content }: { title: string, content: string }) {
    return (
        <View>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{title}</Text>
            <Text style={{ fontSize: 13, color: '#737373', marginTop: 4, textAlign: 'justify' }}>{content}</Text>
        </View>
    )
}

const features = [
    {
        title: "Verified Pro Badge",
        content: "A Verified Pro badge on your profile shows recruiters and peers that you're serious, authentic and premium - boosting trust, profile views and opportunities.",
        type: "section"
    },
    {
        title: "Job Recommendations",
        content: "Receive AI-driven job matches based on your experience, qualifications, certifications, learning progress, skills, preferences, and profile data. Fewer irrelavant listings - more meaningful interviews.",
        type: "section"
    },
    {
        type: "custom",
        renderer: (
            <View>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Job Insights</Text>
                <Text style={{ fontSize: 13, color: '#737373', marginTop: 4 }}>Get deeper job analytics before applying:</Text>
                <UnorderedList
                    items={["How many candidates have applied", "Your relative hiring probability, calculated by comparing your profile with other applicants"]}
                    gap={0}
                    textStyle={{ fontSize: 13, color: "#737373" }}
                />
                <Text style={{ fontSize: 13, color: "#737373", marginTop: 12 }}>Apply smarter and focus on jobs where you truly stand out.</Text>
            </View>
        )
    },
    {
        title: "Jobs with Low Competition",
        content: "Filter and find jobs with minimal applicants. Less competition means a higher chance of getting noticed and hired.",
        type: "section"
    },
    {
        title: "Ads-Free Learning",
        content: "Enjoy a completely ad-free experience across learning modules and challenges - so you can focus without distractions.",
        type: "section"
    },
    {
        title: "AI Learning Assistant",
        content: "Get a personalized, on-page AI assistant inside learning modules that helps you understand concepts, get unstuck instantly, and continue learning without leaving the module.",
        type: "section"
    },
    {
        title: "Weekly Contests",
        content: "Sharpen your competitive skills with exclusive weekly contests available only to Pro members. Solve curated problems, climb leaderboard rankings, and earn visibility and respect in the community.",
        type: "section"
    },
    {
        title: "Spotlight",
        content: "Spotlight helps you discover highly similar profile that closely match your background using advanced filtering criteria such as job role, company and certifications.",
        type: "section"
    },
    {
        title: "Profile Visitors",
        content: "See a clear list of users who viewed your profile. No guessing, no anonymity - just real insights that help you turn profile views into outreach and opportunities.",
        type: "section"
    },
    {
        title: "GIF Profile Images",
        content: "Add animated GIFs to your profile photo, bringing personality, creativity, and a unique presence that stands out in crowded feeds.",
        type: "section"
    },
    {
        title: "External Links",
        content: "Include up to 5 clickable links per month in your posts - perfect for portfolios, demos, blogs, or project repositories. Share your work without limitations.",
        type: "section"
    },
    {
        title: "Priority Support",
        content: "Enjoy priority support with a guaranteed first response within 24 hours for support requests and complaints - so you’re never left waiting.",
        type: "section"
    },
    {
        title: "Impersonation Protection",
        content: "Get priority detection and removal of impersonator or fake accounts. Pro profiles receive additional monitoring and an expedited verification and takedown process to protect your identity.",
        type: "section"
    }
]

export default function GoPro() {
    const router = useRouter();
    const [loaded] = useFonts({
        magnolia: require('@/assets/fonts/magnolia.otf'),
    });

    const { top } = useSafeAreaInsets();
    const [waitlisted, setWaitlisted] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchWaitlisted = async () => {
        try {
            const res = await protectedApi.get('/home/is_waitlisted/');
            setWaitlisted(res.data.is_waitlisted);
        } catch (err: any) {
            console.log(err.response.data)
            errorHandler(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchWaitlisted();
    }, [])

    const [joining, setJoining] = useState(false);

    const joinWaitlist = async () => {
        try {
            setJoining(true);
            await protectedApi.post('/home/pro_waitlist/');
            setWaitlisted(true);
            joinedSheetRef.current?.open();
        } catch (err: any) {
            errorHandler(err);
        } finally {
            setJoining(false);
        }
    }
    const drawerRef = useRef<any>(null);
    const joinedSheetRef = useRef<any>(null);


    return (
        !loaded || loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#202020" />
        </View> : <View style={{ backgroundColor: "#0d0d0d", flex: 1 }}>
            <StatusBar backgroundColor={'#0d0d0d'} barStyle={'light-content'} />
            <ScrollView style={{ paddingTop: top }}>
                <View style={{ marginHorizontal: 16 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <IconButton onPress={() => router.back()} dark>
                            <Image source={require('@/assets/images/arrows/left.png')} style={{ height: 24, width: 24, tintColor: 'white' }} />
                        </IconButton>
                    </View>
                    <View style={{ alignSelf: 'center', marginTop: -24, alignItems: 'center' }}>
                        <Image source={require('@/assets/images/goProStar.png')} style={{ height: 150, width: 156 }} />
                        <Text style={{ fontFamily: 'magnolia', fontSize: 29, color: 'white', marginTop: 32 }}>Coder Serve Pro</Text>
                        <Text style={{ fontSize: 13, marginTop: 8, color: "#a6a6a6", textAlign: 'center' }}>Go beyond the basics and unlock powerful tools for visibility, smarter job discovery, and faster learning with Coder Serve Pro.</Text>
                    </View>
                    <BlueButton title={waitlisted ? "Coming Soon!" : "Join Waitlist"} style={{ marginTop: 28 }} onPress={waitlisted ? () => drawerRef.current?.open() : joinWaitlist} loading={joining} />
                </View>
                <View style={{ gap: 32, backgroundColor: 'white', marginTop: 32, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingTop: 24 }}>
                    {
                        features.map((feature, index) => (
                            feature.type === "section" ? (
                                <Section key={index} title={feature.title || ''} content={feature.content || ''} />
                            ) : (
                                <View key={index}>
                                    {feature.renderer}
                                </View>
                            )
                        ))
                    }
                </View>
                <View style={{ backgroundColor: 'white' }}>
                    <BottomName />
                </View>
            </ScrollView>
            <BottomDrawer
                sheetRef={drawerRef}
                draggableIconHeight={0}
            >
                <View style={{ marginHorizontal: 16 }}>
                    <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>You're Already on the Pro Waitlist!</Text>
                    <Text style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: "#737373" }}>You've successfully joined the Pro waitlist. We'll notify you the moment Pro becomes available for you - no action needed.</Text>
                    <View style={{ marginTop: 30 }}>
                        <BlueButton title="Okay" onPress={() => drawerRef.current?.close()} />
                    </View>
                </View>
            </BottomDrawer>
            <BottomDrawer
                sheetRef={joinedSheetRef}
                draggableIconHeight={0}
            >
                <View style={{ marginHorizontal: 16 }}>
                    <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>You're on the Pro Waitlist!</Text>
                    <Text style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: "#737373" }}>Pro access is currently limited as we roll it out in phases. You're now on the waitlist and will be notified as soon as Pro becomes available for you.</Text>
                    <View style={{ marginTop: 30 }}>
                        <BlueButton title="Okay" onPress={() => joinedSheetRef.current?.close()} />
                    </View>
                </View>
            </BottomDrawer>
        </View>
    )
}