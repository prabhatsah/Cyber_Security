
// ****************** Type of Form Fields ******************

type RadioOption = string; // Options for radio buttons are strings.
type CheckboxOption = { id: string; label: string }; // Checkbox options contain an id and label.

interface TextareaField {
    type: "textarea";
    name: string;
    placeholder: string;
    options: never[]; // No options for textarea fields.
}

interface RadioField {
    type: "radio";
    name: string;
    question: string;
    options: RadioOption[]; // An array of options for radio buttons.
}

interface CheckboxField {
    type: "checkbox";
    name: string;
    question: string;
    options: CheckboxOption[]; // An array of options with id and label for checkboxes.
}

type FormField = TextareaField | RadioField | CheckboxField; // Union type for different form field types.

// ****************** Props for Feedback Form ******************

interface FeedbackFormProps {
    showCheckbox: boolean;
    onConfirmLogout: () => void;
    // selectedEmoji: string;
}
export type { FormField, FeedbackFormProps }; // Export the FormField type.