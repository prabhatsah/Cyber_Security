export const apiRequest = async (url: string, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
