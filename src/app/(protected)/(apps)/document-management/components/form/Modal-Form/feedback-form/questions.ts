import { FormField } from "./types";

export const formData: FormField[] = [
    {
        type: "textarea",
        name: "comments",
        placeholder: "Your feedback",
        options: [],
    },
    {
        type: "radio",
        name: "supportRating",
        question: "How would you rate the technical support?",
        options: ["Excellent", "Good", "Neutral", "Poor", "Very Poor"],
    },
    {
        type: "radio",
        name: "featureSatisfaction",
        question: "How satisfied are you with the features available in the system?",
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
    },
    {
        type: "checkbox",
        name: "likedFeatures",
        question: "What feature did you like the most? (Select all that apply)",
        options: [
            { id: "1", label: "Navigation" },
            { id: "2", label: "Performance/Speed" },
            { id: "3", label: "Reporting/Analytics" },
            { id: "4", label: "User Interface (UI) Design" },
            { id: "5", label: "Security/Privacy" },
            { id: "6", label: "Customizability" },
            { id: "7", label: "Integration with other systems" },
        ],
    },
    {
        type: "radio",
        name: "navigationEase",
        question: "How easy was it to navigate through the application?",
        options: ["Very Easy", "Easy", "Neutral", "Difficult", "Very Difficult"],
    },
];

