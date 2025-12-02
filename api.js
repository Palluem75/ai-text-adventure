/**
 * Sends a message to the Google Gemini API.
 * @param {string} apiKey - The API key for authentication.
 * @param {Array} messages - The history of messages (including system prompt).
 * @returns {Promise<string>} - The response text from the AI.
 */
export async function sendToGemini(apiKey, messages) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;

    // Transform messages to Gemini format
    // Gemini expects: { role: "user" | "model", parts: [{ text: "..." }] }
    // System prompt is usually handled via systemInstruction in newer API versions or just as the first user message for simple setups.
    // Here we will map our internal message structure to Gemini's structure.
    // Assuming 'messages' is an array of objects: { role: 'system'|'user'|'assistant', content: '...' }

    const contents = messages
        .filter(msg => msg.role !== 'system') // Filter out system message if we use systemInstruction, or keep it if we prepend.
        .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

    // Extract system prompt if present
    const systemMessage = messages.find(msg => msg.role === 'system');
    const systemInstruction = systemMessage ? {
        role: "user",
        parts: [{ text: "System Instruction: " + systemMessage.content }]
    } : null;

    // If using systemInstruction feature is preferred, we can add it to the body.
    // For simplicity and broad compatibility with the 'generateContent' endpoint without beta features sometimes, 
    // we can just prepend it to the contents or use the systemInstruction field if available.
    // Let's use the systemInstruction field as it's cleaner for 1.5 models.

    const body = {
        contents: contents,
        generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        }
    };

    if (systemMessage) {
        body.systemInstruction = {
            parts: [{ text: systemMessage.content }]
        };
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API Request failed');
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('No response candidates from Gemini.');
        }

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
}
