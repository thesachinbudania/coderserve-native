import { Image, Text, View } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import { componentsMap } from '@/components/home/courses/Components';
import type { ComponentName } from '@/components/home/courses/Components';



const table1Data = [
  { data1: '1950', data2: 'Alan Turing proposed the idea of machines \'thinking\' - Turing Test' },
  { data1: '1956', data2: 'The term Artificial Intelligence was officially coined at the Dartmouth Conference' },
  { data1: '1980s', data2: 'Expert systems and rule-based AI emerged' },
  { data1: '2010s', data2: 'Explosion of Machine Learning and Deep Learning, fueled by data and GPUs' },
  { data1: '2020s', data2: 'Rise of Generative AI, LLMs like ChatGPT, and widespread real wold AI appliactions' }
]

const list1Data = [
  'Voice Assistants (Siri, Alexa, Google Assistant)',
  'Recommendation Systems (Netflix, YouTube, Amazon)',
  'Chatbotbs & Customer Support (websites, banking, delivery apps)',
  'Navigation (Google Maps predicting traffic)',
  'Face Recognition (in phones, airports, security systems)',
  'Healthcare (AI predicting diseases from scans)',
  'Finance (fraud detection, algorithmic trading)',
  'Creative Tools (AI writing, AI art, music, video'
]

const table2Data = [
  { data1: '"AI is consious or has emotions"', data2: 'No - AI doesn’t feel or understand anything. It learns patterns.' },
  { data1: '"AI will steal all jobs"', data2: 'No - AI doesn’t feel or understand anything. It learns patterns.' },
  { data1: '"AI always gives correct answers', data2: 'AI is only as good as the data and goals it’s trained on. It can be biased or wrong.' },
  { data1: '"Only big tech companies can use AI', data2: 'Open-source tools and APIs make AI accessible to anyone today. Even you.' },
]


const moduleContent = [
  { component: 'heading', children: 'Introduction to AI: The Future Begins Here' },
  { component: 'section', title: 'What is AI?' },
  { component: 'paragraph', children: 'Artificial Intelligence (AI) is the science of building machines that can think, learn, and make decisions - just like humans, or even better. It’s the technology behind voice assistants, self-driving cars, face recognition, and smart recommendations on apps like Netflix or YouTube.' },
  { component: 'paragraph', children: "At its core, AI is about teaching machines how to mimic human intelligence - whether it's recognizing patterns, solving problems, or making predictions.", topMargin: 4 },
  { component: 'section', title: 'A Brief History of AI' },
  { component: 'table', width1: 1 / 6, width2: 5 / 6, title1: 'Year', title2: 'Milestone', data: table1Data, bottomMargin: 24 },
  { component: 'paragraph', children: 'From simple chess engines to AI writing essays and generating images - AI has evolved from fantasy to everyday reality.' },
  { component: 'section', title: 'Current Applications of AI (You Use Them Daily)' },
  { component: 'unorderedList', items: list1Data },
  { component: 'section', title: 'Common Misconceptions About AI' },
  { component: 'table', width1: 1 / 3, width2: 2 / 3, title1: 'Myth', title2: 'Reality', data: table2Data },
  { component: 'section', title: 'Common Misconceptions About AI' },
  { component: 'paragraph', children: "One of the most interesting (and dangerous) challenges in AI is the “black box” problem:" },
  { component: 'paragraphBox', children: "We can build and train powerful models, but we often don’t fully understand how they make decisions internally.", topMargin: 16, bottomMargin: 16 },
  { component: 'paragraph', children: "Especially in deep learning and large language models (like ChatGPT), the inner workings are complex, with millions or billions of parameters - making it hard to interpret why a decision was made.", topMargin: 0, bottomMargin: 32 },
  { component: 'paragraph', children: "This raises critical questions:", topMargin: 0, bottomMargin: 8 },
  {
    component: 'unorderedList', items: [
      "Can we trust AI in sensitive areas like law or medicine?",
      "How do we detect bias or errors?",
      "Who is responsible when AI goes wrong?"
    ]
  },
  { component: 'paragraph', children: "Solving the black box issue is one of the most important frontiers in AI research today.", topMargin: 16 },
  { component: 'section', title: 'Final Thought' },
  { component: 'paragraphBox', children: "“AI is not magic. It’s math, logic, and data — scaled to a level that mimics intelligence.”" },
  { component: 'paragraph', children: "By the end of this course, you’ll not just use AI, but also understand how it works, where it can go wrong, and how to build it responsibly.", topMargin: 16 }
]

export default function Introduction() {
  return (
    <PageLayout headerTitle="Introduction to AI">
      <Image source={require('@/assets/images/blueTick.png')} style={{ marginHorizontal: 'auto', width: 256, height: 256 }} />
      {
        moduleContent.map((item, index) => {
          const { component, ...props } = item;
          const Component = componentsMap[component as ComponentName];
          return <Component key={index} {...props} />;
        })
      }
    </PageLayout>
  );
}
