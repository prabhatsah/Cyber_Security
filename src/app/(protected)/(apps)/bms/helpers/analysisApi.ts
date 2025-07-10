// utils/api.ts
export const analyzeDamper = async (data: any) => {
    try {
        console.log("Request data being sent:", data);

        const response = await fetch('http://127.0.0.1:5050/analyse_damper_feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const textResponse = await response.text();
        console.log("Raw text response:", textResponse);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${textResponse}`);
        }

        try {
            // First try to parse as JSON
            const responseData = JSON.parse(textResponse);
            console.log("Response data (JSON):", responseData);
            return responseData;
        } catch (e) {
            // If not JSON, return the text as is
            console.log("Response is plain text:", textResponse);
            return {
                success: true,
                message: textResponse
            };
        }
    } catch (error) {
        console.error('Error analyzing damper:', error);
        throw error;
    }
};

export const analyzeValve = async (data: any) => {
    try {
        console.log("Request data being sent:", data);

        const response = await fetch('http://127.0.0.1:5050/analyse_cooling_coil_feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const textResponse = await response.text();
        console.log("Raw text response:", textResponse);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${textResponse}`);
        }

        try {
            // First try to parse as JSON
            const responseData = JSON.parse(textResponse);
            console.log("Response data (JSON):", responseData);
            return responseData;
        } catch (e) {
            // If not JSON, return the text as is
            console.log("Response is plain text:", textResponse);
            return {
                success: true,
                message: textResponse
            };
        }
    } catch (error) {
        console.error('Error analyzing valve:', error);
        throw error;
    }
};

