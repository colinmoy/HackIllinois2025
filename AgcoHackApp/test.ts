import axios from 'axios';
import { configDotenv } from 'dotenv';
// configDotenv();

export const AZURE_OPENAI_API_KEY = process.env.REACT_APP_AZURE_OPENAI_API_KEY; //PUT API HERE
export const AZURE_OPENAI_ENDPOINT = "https://openai-agco-poc.openai.azure.com";
export const API_VERSION = "2024-10-21";

// Define the endpoints (AI used)
export const endpoints: Record<string, string> = {
    // gpt_40: "gpt-4o-2",
    gpt_o1_mini: "o1-mini"
};

// Define the payload (Message log)
export const payload: { messages: Array<{ role: string, content: Array<{ type: string, text: string }> }> } = {
    messages: []
};

// Function to test an endpoint. Returns the message content if it works, null otherwise.
export async function testEndpoint(name: string, deploymentId: string, payload: { messages: Array<{ role: string, content: Array<{ type: string, text: string }> }> }): Promise<string | null> {
    try {
        const response = await axios.post(
            `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${deploymentId}/chat/completions?api-version=${API_VERSION}`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": AZURE_OPENAI_API_KEY!
                }
            }
        );
        console.log(`${name} endpoint is working.`);
        return response.data.choices[0].message.content;

    } catch (error: any) {
        console.error(`${name} endpoint failed. Error:`, error.response?.data || error.message);
        return null;
    }
}

// inputMessage: String
// Returns [{chatBotName : String, response : String (or null on error)}]
// Returns the response in the {chatBotName}.txt file
export async function askChatBot(messageType: string, inputMessage: string): Promise<[string, string | null][]> {
    payload.messages.push({ role: "user", content: [{ type: messageType, text: inputMessage }] });

    const outputMessages: [string, string | null][] = await (async () => {
        const outputMessages: [string, string | null][] = [];
        for (const [name, deploymentId] of Object.entries(endpoints)) {
            let botResponse = testEndpoint(name, deploymentId, payload);
            outputMessages.push([name, await botResponse]);
        }

        return outputMessages;
    })();

    return outputMessages;
}

// Clears the current message log.
export function clearMessageLog(): void {
    payload.messages = [];
}
