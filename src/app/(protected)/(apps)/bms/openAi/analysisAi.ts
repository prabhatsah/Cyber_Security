
import OpenAI from "openai";
import path from "path";

// const imagePath = 



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
  });

export async function executeOpenAiAnalysis(){
    try {
        const response = await openai.responses.create({
            model: "o1",
            input: [
                {
                    role: "user",
                    content: [
                        { 
                            type: "input_text", 
                            text: "As an HVAC Technician/Building Automation Specialist, I am analyzing a BMS graph depicting  My goal is to diagnose control system behavior, identify inefficiencies, and propose actionable improvements. What insights can you provide based on the data? show the flowing information analysis, Graph Observation, Control System Behavior, Control System Efficiency,Deliverables,Compliance & Safety,Recommendations for Improvement, and Conclusion." 
                        },
                        {
                            type: "input_image",
                            image_url: `https://ikoncloud-dev.keross.com/download?ticket=b869ac78-36c1-4b17-9d3f-a03cd547e572&resourceId=8cf60eda-c832-40b4-9c9e-6ba4d608e9f1&resourceType=image/png#toolbar=0&navpanes=0&scrollbar=0`
                        },
                    ],
                },
            ],
        });
        
        console.log(response.output_text);
        
    } catch (error) {
        console.error("Error during OpenAI API call:", error);
    }
}