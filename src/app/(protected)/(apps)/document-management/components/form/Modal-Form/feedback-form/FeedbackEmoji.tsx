"use client";
import { setOverallFeedback } from "@/store/redux/slices/overallFeedbackSlice";
import { useAppDispatch } from "@/store/store";
import { useAppSelector } from '@/store/store';
import { RootState } from '@/store/store';

const emojiList = [
  { emoji: "😢", label: "Very Poor" },
  { emoji: "😟", label: "Poor" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😊", label: "Good" },
  { emoji: "😍", label: "Excellent" },
];

interface FeedbackFormProps {
  selectedEmoji: string;
  onSelect: (emoji: string) => void;
}

export default function FeedbackEmoji() {
  // const isSelected = useAppSelector(selectedEmoji);
  // const selectedEmoji: any = useAppSelector((state: RootState) => state.overallFeedback.selectedEmoji);
  const selectedFeedback = useAppSelector((state) => state.overallFeedback);
  const selectedEmoji = selectedFeedback.selectedEmoji;
  const dispatch = useAppDispatch();

  const handleClick = (emoji: string, label: string) => {
    console.log("Selected Emoji:", emoji);
    var feedbackObj: any = { selectedEmoji: emoji, feedback: label };
    dispatch(setOverallFeedback(feedbackObj));
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-center gap-6">
        {emojiList.map(({ emoji, label }) => (
          <div key={emoji} className="text-center">
            <button
              className={`transition-transform duration-200 
                text-4xl sm:text-5xl md:text-6xl 
                ${selectedEmoji === emoji ? "scale-125" : ""}`}
              onClick={() => handleClick(emoji, label)}
            >
              {emoji}
            </button>
            <p className="mt-2 text-sm sm:text-base md:text-lg font-medium">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
