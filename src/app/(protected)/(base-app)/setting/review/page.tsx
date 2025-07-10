import { getAllQuestions, getAllReviews } from "@/ikon/utils/api/applicationReviewService";

interface Question {
  QUESTIONS_ID: string;
  OPTIONS: string;
  QUESTIONS_TYPE: string;
  QUESTIONS_TEXT: string;
  CATEGORY: string;
}

interface Review {
  QUESTIONS_ID: string;
  RATING: number | null; 

}

export default async function Review() {
  // Fetch data
  const questions: Question[] = await getAllQuestions();
  const reviews: Review[] = await getAllReviews();

  // Join questions and reviews on QUESTIONS_ID
  const joinedData = reviews
    .map((review) => {
      const question = questions.find((q) => q.QUESTIONS_ID === review.QUESTIONS_ID);
      return question && review.RATING !== null
        ? { CATEGORY: question.CATEGORY, RATING: review.RATING }
        : null;
    })
    .filter((item): item is { CATEGORY: string; RATING: number } => item !== null); // Type-safe filter

  const groupedData = joinedData.reduce<Record<string, { totalRating: number; count: number }>>(
    (acc, item) => {
      if (!acc[item.CATEGORY]) {
        acc[item.CATEGORY] = { totalRating: 0, count: 0 };
      }
      acc[item.CATEGORY].totalRating += item.RATING;
      acc[item.CATEGORY].count += 1;
      return acc;
    },
    {}
  );


  const result = Object.entries(groupedData).map(([CATEGORY, data]) => ({
    CATEGORY,
    AVERAGE_RATING: Math.round((data.totalRating / data.count) * 10) / 10, // Round to 1 decimal
    E_COUNT: data.count,
  }));

  console.log(result);

  return <div>Review</div>;
}
