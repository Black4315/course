import AskQues from '@/components/AskQues';
import LeaderBoard from '@/components/LeaderBoard';
import {
    book,
    reading,
    clock,
    globe,
    presentation,
    dollar,
} from '@/utils'
import { FaRegCommentDots } from "react-icons/fa";
import { MdOutlineLeaderboard, MdQuestionMark } from "react-icons/md";

export const courseTopic = [
    {
        id: 1,
        title: 'Week 1-4',
        shortTitle: 'Course Introduction',
        body: 'Advanced story telling techniques for writers: Personas, Characters & Plots',
        ques: 0,
        minutes: 10,
        list: [
            'Introduction',
            'Course Overview',
            'Course Overview',
            'Course Exercise/Reference filles',
            'Code Editor instaliction (Optional if you have one)',
            'Embedding PHP in HTML'
        ]
    },
    {
        id: 2,
        title: 'Week 5-8',
        shortTitle: 'JavaScript Language Basics',
        body: 'Advanced story telling techniques for writers: Personas, Characters & Plots',
        ques: 2,
        minutes: 15,
        questions: [
            {
                question: 'Among the following states of India, which one has the oldest rock formations in the country?',
                answers: ['Aswan', 'Bahar', 'Kamaltake', 'Utter Pardesh']
            },

            {
                question: "Which mountain range forms the eastern boundary of the Deccan Plateau?",
                answers: ["Western Ghats", "Himalayas", "Aravalli Hills", "Eastern Ghats"]
            },


        ],
        list: [
            'Defining Functions',
            'Function Parameters',
            'Retum Values From Functions',
            'Global Variable and Scope',
            'Newer Way of creating a Constant',
            'Constants'
        ]
    },
    {
        id: 3,
        title: 'Week 5-8',
        shortTitle: 'Components & databinding',
        body: 'Advanced story telling techniques for writers: Personas, Characters & Plots',
        ques: 2,
        minutes: 15,
        questions: [
            {
                question: "Which Indian state is the largest producer of coffee?",
                answers: ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh"]
            },
            {
                question: "Which river is known as the 'Sorrow of Bihar' due to frequent flooding?",
                answers: ["Ganga", "Kosi", "Yamuna", "Godavari"]
            },

        ],
        list: [
            'Defining Function',
            'Function Parameters ',
            'Retum Values From Functions ',
            'Global Variable and Scope',
            'Newer Way of creating a Constant ',
            'Constants'
        ]
    },

];

export const curriculm = [
    { tooltip: 'Comments', Icon: FaRegCommentDots, Action: '#comment' },
    { tooltip: 'Leader board', Icon: MdOutlineLeaderboard, Action: LeaderBoard },
    { tooltip: 'Ask me', Icon: MdQuestionMark, Action: AskQues }
];
export const courseMat = [
    [
        {
            id: 1,
            title: "Instructor",
            icon: presentation,
            righthand: "Edward Norton",
        },
        {
            id: 2,
            title: "Duration",
            icon: clock,
            righthand: "3 weeks",
        },
        {
            id: 3,
            title: "Lessons",
            icon: book,
            righthand: "8",
        },
        {
            id: 4,
            title: "Enrolled",
            icon: reading,
            righthand: "65 students",
        },
    ],
    [
        {
            id: 5,
            title: "Language",
            icon: globe,
            righthand: "English",
        },
        {
            id: 6,
            title: "Price",
            icon: dollar,
            righthand: "50$",
        },
        {
            id: 7,
            title: "Enrolled",
            icon: reading,
            righthand: "65 students",
        },
        {
            id: 8,
            title: "Language",
            icon: globe,
            righthand: "English",
        },
    ],
];