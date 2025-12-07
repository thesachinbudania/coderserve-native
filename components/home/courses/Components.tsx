import React from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/zustand/stores';
import protectedApi from '@/helpers/axios';
import PopUp from '@/components/messsages/PopUp';
import DefaultButton from '@/components/buttons/DefaultButton';
import Clipboard from '@react-native-clipboard/clipboard';
import BottomSheet from '@/components/messsages/BottomSheet';

function Heading({ children }: { children: string }) {
  return (
    <Text style={{ marginTop: 16, fontSize: 21, fontWeight: 'bold', textAlign: 'center' }}>{children}</Text>
  )
}

function SubHeading({ children, topMargin = 0, bottomMargin = 0 }: { children: string, topMargin?: number, bottomMargin?: number }) {
  return (
    <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: topMargin, marginBottom: bottomMargin }}>{children}</Text>
  )
}

interface ParagraphProps {
  children: string | { type: 'text' | 'code', content: string }[];
  topMargin?: number;
  bottomMargin?: number;
}

function Paragraph({ children, topMargin = 8, bottomMargin = 0 }: ParagraphProps) {
  return (
    typeof children === 'string' ?
      <Text style={{ marginTop: topMargin, marginBottom: bottomMargin, fontSize: 13, color: '#737373' }}>{children}</Text> :
      <Text style={{ marginTop: topMargin, marginBottom: bottomMargin, flexWrap: 'wrap' }}>
        {children.map((child, idx) => {
          if (child.type === 'text') {
            return <Text key={idx} style={{ fontSize: 13, color: "#737373" }}>{child.content} </Text>;
          } else if (child.type === 'code') {
            return (
              <Text key={idx} style={{ color: '#3c5fff', fontSize: 13 }}>
                {child.content}
              </Text>
            );
          }
          return null;
        })}
      </Text>
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
  items: string[] | { type: 'text' | 'code', content: string }[][];
  topMargin?: number;
  bottomMargin?: number;
  gap?: number;
}
const UnorderedList = ({ items, topMargin = 8, bottomMargin = 0, gap = 16 }: UnorderedListProps) => {
  return (
    <View style={{ gap: gap, marginTop: topMargin, marginBottom: bottomMargin }}>
      {items.map((item, index) => item != '' && (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }} key={index}>
          <Text style={{
            marginRight: 6,
            fontSize: 22,
            lineHeight: 22,
            color: '#737373'
          }}>{'\u2022'}</Text>
          <Paragraph children={item} topMargin={0} bottomMargin={0} />
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
  const sheetRef = React.useRef<any>(null);
  // temporarily store the points from backend on submit quiz
  const [points, setPoints] = React.useState(0);
  const [pointsLeft, setPointsLeft] = React.useState(100);

  const [submittedResponse, setSubmittedResponse] = React.useState<any>(null);

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
      setPoints(response.data.points)
      if (response.data.correct === false) {
        setIncorrectAnswers(response.data.incorrect);
        // use functional update to avoid stale closure over pointsLeft
        setPointsLeft(prev => {
          const next = prev - response.data.points;
          console.log('points left updated:', prev, '-', response.data.points, '=', next);
          return next;
        });
        setSubmittedResponse(answers);
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
      sheetRef.current?.open();
    }
  }

  const popUpMessage = {
    'correct': "Nice comeback! You've successfully completed the quiz on your retry. Well done for not giving up!",
    'incorrect': "Oops! Some answers were incorrect and partial points have been deducted. Don't worry - you can review and try again."
  }

  return (
    loading ? <View style={{ height: 400, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View> :
      <View style={{ marginTop: topMargin, marginBottom: bottomMargin, gap: 32 }}>
        <BottomSheet
          menuRef={sheetRef}
          height={272}
        >
          <>
            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Assessment Complete</Text>
            <Text style={{ paddingVertical: 32, textAlign: 'center', fontSize: 33, color: (!submitted && incorrectAnswers.length > 0) ? '#ff5757' : '#00bf63', fontWeight: 'bold' }}>{!submitted && incorrectAnswers.length > 0 ? `- ${points}` : `+ ${pointsLeft}`} points</Text>
            <Text style={{ fontSize: 13, color: '#737373', marginBottom: 24, textAlign: 'center' }}>{!submitted && incorrectAnswers.length > 0 ? popUpMessage['incorrect'] : popUpMessage['correct']}</Text>
            <DefaultButton
              title='Okay'
              onPress={() => sheetRef.current?.close()}
            />
          </>
        </BottomSheet>
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
            loading={submitLoading}
            disabled={questions.length != Object.keys(answers).length || (submittedResponse !== null && submittedResponse == answers)}
          />
        }
      </View>
  )
}


const GradientBoxWithButton = ({ disabled = false, text, onPress, buttonTitle, loading = false }: { loading?: boolean, buttonTitle: string, disabled?: boolean, text: string, onPress?: () => void }) => {
  return (
    <LinearGradient
      colors={['#00362f', '#399d96']}
      style={{ borderRadius: 12, marginTop: 16, }}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={{ padding: 16 }} >
        <Text style={{ color: 'white', fontSize: 13 }}>
          {text}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
          <YellowButton
            title={buttonTitle}
            onPress={onPress}
            disabled={disabled}
            loading={loading}
          />
        </View>
      </View>
    </LinearGradient>
  )
}

const YellowButton = ({ title, onPress, disabled, loading = false }: { title: string, onPress?: () => void, disabled?: boolean, loading?: boolean }) => {
  return (
    <Pressable
      style={({ pressed }) => [{ borderRadius: 32, paddingHorizontal: 32, paddingVertical: 16, backgroundColor: pressed ? '#00362f' : 'white' }, disabled && { backgroundColor: "#aec5c1" }]}
      onPress={disabled ? () => { } : onPress}
    >
      {
        ({ pressed }) => (
          loading ? <ActivityIndicator size="small" /> :
            <Text style={[pressed && { color: "white" }, disabled && { color: '#3b5350' }]}>{title}</Text>
        )
      }

    </Pressable>
  )
}

const EndBox = ({ text = null, onPress = null, buttonText = null }: { text?: string | null, onPress?: (() => void) | null, buttonText?: string | null }) => {
  const router = useRouter();
  const { first_name } = useUserStore();
  return (
    <GradientBoxWithButton
      text={text ? text : `Congrats ${first_name}! You successfully completed Introduction to AI`}
      buttonTitle={buttonText ? buttonText : 'Close'}
      onPress={onPress ? onPress : () => router.back()}
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


const MiniTask = ({ renderNext, id, outputLines = 2 }: { renderNext: () => void, id: number, outputLines?: number }) => {
  const { first_name } = useUserStore();
  const [yesClicked, setYesClicked] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [points, setPoints] = React.useState(0);
  const [pointsLeft, setPointsLeft] = React.useState(100);

  const [answer, setAnswer] = React.useState<string>('');
  const [completed, setCompleted] = React.useState<boolean>(false);
  const [popUpVisible, setPopUpVisible] = React.useState(false);
  const [errored, setErrored] = React.useState(false);
  const [correctAnswer, setCorrectAnswer] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await protectedApi.get(`/home/mini_task/${id}/`);
        setData(response.data);
        setLoading(false);
        setCompleted(response.data.completed);
        if (response.data.completed) {
          setCorrectAnswer(response.data.answer);
          renderNext();
        }
      } catch (error: any) {
        console.error('Error fetching mini task data:', error.response.data);
      }
    }
    fetchData();
  }, [id]);

  const submitAnswer = async () => {
    setSubmitLoading(true);
    if (answer === '') {
      return
    }
    try {
      const response = await protectedApi.put(`/home/mini_task/${id}/`, { answer });
      setPoints(response.data.points);
      if (response.data.correct) {
        setCompleted(true);
        setCorrectAnswer(response.data.answer)
        renderNext();
      }
      else {
        setCompleted(false);
        setErrored(true);
        setPointsLeft(prev => prev - response.data.points);
      }
      setPopUpVisible(true);
    } catch (error: any) {
      console.error('Error submitting mini task answer:', error.response.data);
    }
    finally {
      setSubmitLoading(false);
    }
  }
  return (
    loading ? <View style={{ height: 400, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View> :
      !yesClicked && !completed ?
        <View style={{ marginTop: 48 }}>
          <EndBox
            text={`${first_name}! Are you ready to try your mini task?`}
            buttonText={'Yes'}
            onPress={() => setYesClicked(true)}
          /></View> : (
          <>
            <Section title="Your Mini Task" />
            {
              data.question.map((item: any, index: number) => {
                const { component, ...props } = item;
                const Component = componentsMap[component as ComponentName];
                return <Component key={index} {...props} />
              })
            }
            {
              !completed && data.question_autohide.length > 0 && data.question_autohide.map((item: any, index: number) => {
                const { component, ...props } = item;
                const Component = componentsMap[component as ComponentName];
                return <Component key={index} {...props} />
              })
            }
            {
              !completed ? (
                <>
                  <TextInput
                    placeholder={'Output'}
                    multiline={true}
                    numberOfLines={outputLines}
                    style={[{
                      height: (outputLines * 16) + 32,
                      borderColor: 'black',
                      borderWidth: 1,
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor: '#fff',
                      color: '#000',
                      fontSize: 13,
                      textAlignVertical: 'top',
                      marginTop: 16
                    }, focused && { borderColor: '#006dff' }]}
                    placeholderTextColor={'#cbe1ff'}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    value={answer}
                    onChangeText={setAnswer}
                  />
                  {
                    errored && <Text style={{ marginTop: 8, color: "#ff5757" }}>Incorrect output. Try again</Text>
                  }
                  <View style={{ marginTop: 32 }}>
                    <GradientBoxWithButton
                      text="Once you've entered the output above, click 'Done' to proceed."
                      buttonTitle='Done'
                      onPress={submitAnswer}
                      loading={submitLoading}
                      disabled={!answer || answer === ''}
                    />
                  </View>
                </>
              ) : (
                correctAnswer && correctAnswer.map((item: any, index: number) => {
                  const { component, ...props } = item;
                  const Component = componentsMap[component as ComponentName];
                  return <Component key={index} {...props} />
                })
              )
            }

            <PopUp
              visible={popUpVisible}
              setVisible={setPopUpVisible}
            >
              <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{!completed ? 'Incorrect Submission' : 'Successful Submission'}</Text>
              <Text style={{ paddingVertical: 32, textAlign: 'center', fontSize: 33, color: (!completed) ? '#ff5757' : '#00bf63', fontWeight: 'bold' }}>{!completed ? `- ${points}` : `+ ${pointsLeft}`} points</Text>
              <Text style={{ fontSize: 13, color: '#737373', marginBottom: 24, textAlign: 'center' }}>{!completed ? "Great Job! Your code passed all test cases and you've earned partial points for this task." : "Oops! Your code didn't pass all the test cases and partial points have been deducted. Don't worry - you can review and try again!"}</Text>
              <DefaultButton
                title='Done'
                onPress={() => setPopUpVisible(false)}
              />
            </PopUp>
          </>
        )
  )
}

const MoveToNext = ({ renderNext, children }: { renderNext: () => void, children: string }) => {
  const [show, setShow] = React.useState(true);
  return (
    show &&
    <View style={{ marginTop: 32 }}>
      <EndBox
        text={children}
        buttonText='Okay'
        onPress={() => { renderNext(); setShow(false) }}
      />
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
  'miniTask': (props: any) => <MiniTask {...props} />,
  'moveToNext': (props: any) => <MoveToNext {...props} />
}

export type ComponentName = keyof typeof componentsMap;


