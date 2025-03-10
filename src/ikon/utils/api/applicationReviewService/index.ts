import ikonBaseApi from "../ikonBaseApi"

export const getAllQuestions = async () : Promise<Record<string,string>> =>{
    const result = await ikonBaseApi({
        service: "applicationReviewService",
        operation: "getAllQuestions",
        arguments_: []
    })
    return result.data
}

export const getAllReviews = async () : Promise<Record<string,string>> =>{
    const result = await ikonBaseApi({
        service: "applicationReviewService",
        operation: "getAllReviews",
        arguments_: []
    })
    return result.data
}