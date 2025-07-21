import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/zustand/stores';
import protectedApi from '@/helpers/axios';
import PopUp from '@/components/messsages/PopUp';
import DefaultButton from '@/components/buttons/DefaultButton';
import Clipboard from '@react-native-clipboard/clipboard';

function Heading({ children }: { children: string }) {
  return (
    <Text style={{ marginTop: 16, fontSize: 21, fontWeight: 'bold', textAlign: 'center' }}>{children}</Text>
  )
}

function SubHeading({ children }: { children: string }) {
  return (
    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{children}</Text>
  )
}

interface ParagraphProps {
  children: string;
  topMargin?: number;
  bottomMargin?: number;
}

function Paragraph({ children, topMargin = 8, bottomMargin = 0 }: ParagraphProps) {
  return (
    <Text style={{ marginTop: topMargin, marginBottom: bottomMargin, fontSize: 13, color: '#737373' }}>{children}</Text>
  )
}

interface SectionProps {
  children?: React.ReactNode;
  title: string;
}

function Section({ title }: SectionProps) {
  return (
    <View style={{ marginTop: 48 }}>
      <SubHeading>{title}</SubHeading>
    </View>
  )
}
interface TableProps {
  width1: number;
  width2: number;
  title1: string;
  title2: string;
  data: Array<{ data1: string; data2: string }>;
  bottomMargin?: number;
  topMargin?: number;
}
function Table({ title1, title2, width1, width2, data, bottomMargin = 0, topMargin = 8 }: TableProps) {
  return (
    <View style={{ marginBottom: bottomMargin, marginTop: topMargin }}>
      <View style={{ flexDirection: 'row', gap: 32 }}>
        <Text style={{ flex: width1, fontWeight: 'bold', fontSize: 13 }}>{title1}</Text>
        <Text style={{ flex: width2, fontWeight: 'bold', fontSize: 13 }}>{title2}</Text>
      </View>
      {
        data.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', marginTop: 16, gap: 32 }}>
            <Text style={{ flex: width1, color: '#737373', fontSize: 13 }}>{item.data1}</Text>
            <Text style={{ flex: width2, color: '#737373', fontSize: 13 }}>{item.data2}</Text>
          </View>
        ))
      }
    </View>
  )
}

interface UnorderedListProps {
  items: string[];
  topMargin?: number;
  bottomMargin?: number;
}
const UnorderedList = ({ items, topMargin = 8, bottomMargin = 0 }: UnorderedListProps) => {
  return (
    <View style={{ gap: 16, marginTop: topMargin, marginBottom: bottomMargin }}>
      {items.map((item, index) => item != '' && (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }} key={index}>
          <Text style={{
            marginRight: 6,
            fontSize: 22,
            lineHeight: 22,
            color: '#737373'
          }}>{'\u2022'}</Text>
          <Text style={{ fontSize: 13, color: '#737373' }}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

interface ParagraphBoxProps {
  children: string;
  topMargin?: number;
  bottomMargin?: number;
}

const ParagraphBox = ({ children, topMargin = 8, bottomMargin = 0 }: ParagraphBoxProps) => {
  return (
    <View style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 8, marginTop: topMargin, marginBottom: bottomMargin }}>
      <Text style={{ fontSize: 13, color: '#737373' }}>{children}</Text>
    </View>
  )
}

interface McqProps {
  topMargin?: number;
  bottomMargin?: number;
  renderNext: () => void;
  id: number;
}

const Quiz = ({ topMargin = 8, bottomMargin = 0, renderNext, id }: McqProps) => {
  interface OptionProps {
    title: string;
    selected: boolean;
    setSelected: () => void;
    correct?: boolean;
  }
  const Option = ({ selected, setSelected, title, correct = false }: OptionProps) => {
    return (
      <Pressable
        style={() => [{ marginHorizontal: -16, paddingHorizontal: 16, paddingVertical: 8 }, (selected) && { backgroundColor: '#e9f2ff' }, correct && { backgroundColor: 'white' }]}
        onPress={setSelected}
      >
        {() => (
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <View style={[{ width: 14, height: 14, borderWidth: 2.5, borderColor: '#737373', borderRadius: 100 }, (selected) && { borderColor: '#006dff' }, correct && { borderColor: "#00bf63" }]} />
            <Text style={[{ fontSize: 13, color: '#737373' }, (selected) && { color: '#006dff' }, correct && { color: '#00bf63' }]}>{title}</Text>
          </View>
        )}
      </Pressable>
    )
  }

  interface QuestionProps {
    title: string;
    options: string[];
    answers: any;
    setAnswer?: (answer: number) => void;
    order: number;
    incorrect?: boolean;
    answer?: number;
    code?: string;
  }

  const Question = ({ title, options, answers, code, setAnswer, order, incorrect = false, answer }: QuestionProps) => {
    const selected = answers[order] || null;
    return (
      <>
        <Text style={{ fontSize: 13, color: '#737373', marginBottom: 8 }}>{order}. {title}</Text>
        {
          code && <CodeBlock bottomMargin={8}>{code}</CodeBlock>
        }
        {
          options.map((option, index) => (
            <Option
              key={index}
              selected={answer ? false : selected === index + 1}
              title={option}
              setSelected={() => setAnswer && setAnswer(index + 1)}
              correct={answer === index + 1}
            />
          ))
        }
        {
          incorrect &&
          <Text style={{ fontSize: 13, color: "#ff5757" }}>Incorrect Answer</Text>
        }
      </>
    )
  }
  const [questions, setQuestions] = React.useState<any>([]);
  const [answers, setAnswers] = React.useState<any>({});
  const [loading, setLoading] = React.useState(true);
  const [incorrectAnswers, setIncorrectAnswers] = React.useState<number[]>([]);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [correctAnswers, setCorrectAnswers] = React.useState<number[]>([]);
  const [popUpVisible, setPopUpVisible] = React.useState(false);
  const [points, setPoints] = React.useState(0);

  React.useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await protectedApi.get('/home/quiz/' + id + '/');
        setQuestions(response.data.questions);
        if (response.data.correct_answers) {
          setCorrectAnswers(response.data.correct_answers);
          setSubmitted(true);
          renderNext();
        }
      } catch (error: any) {
        console.error('Error fetching questions:', error.response.data);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [])

  const submitQuiz = async () => {
    setSubmitLoading(true);
    try {
      const response = await protectedApi.put('/home/quiz/' + id + '/', answers);
      setPoints(response.data.points);
      if (response.data.correct === false) {
        setIncorrectAnswers(response.data.incorrect);
      }
      else {
        setSubmitted(true);
        setCorrectAnswers(response.data.answers)
        setIncorrectAnswers([]);
        renderNext();
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error.response.data);
    } finally {
      setSubmitLoading(false);
      setPopUpVisible(true);
    }
  }

  const popUpMessage = {
    'correct': "Nice comeback! You've successfully completed the quiz on your retry. Well done for not giving up!",
    'incorrect': "Oops! Some answers were incorrect and partial points have been deducted. Don't worry - you can review and try again."
  }

  return (
    loading ? <View style={{ height: 400, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#202020" />
    </View> :
      <View style={{ marginTop: topMargin, marginBottom: bottomMargin, gap: 32 }}>
        <PopUp
          visible={popUpVisible}
          setVisible={setPopUpVisible}
        >
          <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Assessment Complete</Text>
          <Text style={{ paddingVertical: 32, textAlign: 'center', fontSize: 33, color: (!submitted && incorrectAnswers.length > 0) ? '#ff5757' : '#00bf63', fontWeight: 'bold' }}>{!submitted && incorrectAnswers.length > 0 ? '-' : '+'}{points} points</Text>
          <Text style={{ fontSize: 13, color: '#737373', marginBottom: 24, textAlign: 'center' }}>{!submitted && incorrectAnswers.length > 0 ? popUpMessage['incorrect'] : popUpMessage['correct']}</Text>
          <DefaultButton
            title='Done'
            onPress={() => setPopUpVisible(false)}
          />
        </PopUp>
        {questions.map((question: any, index: number) => (
          <View
            key={index}
          >
            <Question
              title={question.title}
              options={question.options}
              key={index}
              order={index + 1}
              setAnswer={(answer) => setAnswers({ ...answers, [index + 1]: answer })}
              answers={answers}
              incorrect={incorrectAnswers.includes(index + 1)}
              answer={correctAnswers.length > 0 ? correctAnswers[index] : undefined}
              code={question.code ? question.code : undefined}
            />
          </View>
        ))}
        {
          !submitted &&
          <GradientBoxWithButton
            text="Once you've answered above questions, click 'Done' to proceed."
            buttonTitle='Done'
            onPress={submitQuiz}
          />
        }
      </View>
  )
}


const GradientBoxWithButton = ({ disabled = false, text, onPress, buttonTitle }: { buttonTitle: string, disabled?: boolean, text: string, onPress?: () => void }) => {
  return (
    <LinearGradient
      colors={['#691a00', '#ae2a00']}
      style={{ padding: 16, borderRadius: 12, marginTop: 16 }}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={{ color: 'white', fontSize: 13 }}>
        {text}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
        <YellowButton
          title={buttonTitle}
          onPress={onPress}
        />
      </View>
    </LinearGradient>
  )
}

const YellowButton = ({ title, onPress }: { title: string, onPress?: () => void }) => {
  return (
    <Pressable
      style={({ pressed }) => [{ borderRadius: 32, paddingHorizontal: 32, paddingVertical: 16, backgroundColor: pressed ? '#ffe370' : 'white' }]}
      onPress={onPress}
    >
      <Text>{title}</Text>
    </Pressable>
  )
}

const EndBox = () => {
  const router = useRouter();
  const { first_name } = useUserStore();
  return (
    <GradientBoxWithButton
      text={`Congrats ${first_name}! You successfully completed Introduction to AI`}
      buttonTitle='Close'
      onPress={() => router.back()}
    />
  )
}

interface CodeBlockProps {
  children: string;
  topMargin?: number;
  bottomMargin?: number;
}

const CodeBlock = ({ children, topMargin = 8, bottomMargin = 0 }: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);
  const copyToClipboard = () => {
    Clipboard.setString(children);
    setCopied(true);
  }
  return (
    <View style={{ marginTop: topMargin, backgroundColor: "#101c2c", marginBottom: bottomMargin, borderRadius: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 16, backgroundColor: "#2a2f41", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <Pressable onPress={copyToClipboard}><Text style={{ fontSize: 11, color: 'white' }}>{copied ? 'Copied' : 'Copy Code'}</Text></Pressable>
      </View>
      <Text style={{ fontSize: 13, color: 'white', padding: 16 }}>{children}</Text>
    </View>
  )
}

const OutputCode = ({ children, topMargin = 8, bottomMargin = 0 }: CodeBlockProps) => {
  return (
    <View style={{ marginTop: topMargin, backgroundColor: "#101c2c", marginBottom: bottomMargin, borderRadius: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 16, backgroundColor: "#2a2f41", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <Text style={{ fontSize: 11, color: 'white' }}>Output</Text>
      </View>
      <Text style={{ fontSize: 13, color: 'white', padding: 16 }}>{children}</Text>
    </View>
  )
}


export const componentsMap = {
  'paragraph': (props: any) => <Paragraph {...props} />,
  'heading': (props: any) => <Heading {...props} />,
  'subHeading': (props: any) => <SubHeading {...props} />,
  'section': (props: any) => <Section {...props} />,
  'table': (props: any) => <Table {...props} />,
  'unorderedList': (props: any) => <UnorderedList {...props} />,
  'paragraphBox': (props: any) => <ParagraphBox {...props} />,
  'quiz': (props: any) => <Quiz {...props} />,
  'endBox': (props: any) => <EndBox {...props} />,
  'codeBlock': (props: any) => <CodeBlock {...props} />,
  'outputCode': (props: any) => <OutputCode {...props} />,
}

export type ComponentName = keyof typeof componentsMap;


