import axios from 'axios';
import { configDotenv } from 'dotenv';
import * as fs from 'node:fs';
configDotenv();

const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = "https://openai-agco-poc.openai.azure.com";
const API_VERSION = "2024-10-21";

// Define the endpoints (AI used)
const endpoints: Record<string, string> = {
    // gpt_40: "gpt-4o-2",
    gpt_o1_mini: "o1-mini"
};

// Define the payload (Message log)
const payload: { messages: Array<{ role: string, content: Array<{ type: string, text: string }> }> } = {
    messages: []
};

// Function to test an endpoint. Returns the message content if it works, null otherwise.
async function testEndpoint(name: string, deploymentId: string, payload: { messages: Array<{ role: string, content: Array<{ type: string, text: string }> }> }): Promise<string | null> {
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

    for (const [name, response] of outputMessages) {
        console.log(response);
        fs.writeFile(`${name}.txt`, response || '', { flag: 'w' }, err => {});
    }

    return outputMessages;
}

// Clears the current message log.
function clearMessageLog(): void {
    payload.messages = [];
}

await askChatBot("text", "Say Hello when I say 93 but say the word apple right now");
await askChatBot("text", "93");
clearMessageLog();
await askChatBot("text", "93");
