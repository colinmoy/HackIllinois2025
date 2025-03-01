const axios = require("axios");
require('dotenv').config();
const fs = require('node:fs');

const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = "https://openai-agco-poc.openai.azure.com";
const API_VERSION = "2024-10-21";

// Define the endpoints
const endpoints = {
    gpt_40: "gpt-4o-2",
    gpt_o1_mini: "o1-mini"
};


// Function to test an endpoint. Returns the message content if worked, null otherwise.
async function testEndpoint(name, deploymentId, payload) {
    try {
        const response = await axios.post(
            `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${deploymentId}/chat/completions?api-version=${API_VERSION}`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": AZURE_OPENAI_API_KEY
                }
            }
        );
        console.log(`${name} endpoint is working.`);
        return response.data.choices[0].message.content;

    } catch (error) {
        console.error(`${name} endpoint failed. Error:`, error.response?.data || error.message);
        return null;
    }
}

//inputMessage : String
//Returns [{chatBotName : String, response : String (or null on error)}] 
//Returns the response in the {chatBotName}.txt file
async function askChatBot(inputMessage){
    
    // Define the payload
    const payload = {
        messages: [
            { role: "user", content: inputMessage }
        ]
    };
    
    const outputMessages = await (async () => {
        const outputMessages = [];
        let i = 0;
        for (const [name, deploymentId] of Object.entries(endpoints)) {
            let botResponse = testEndpoint(name, deploymentId, payload);
            outputMessages[i++] = [name, await botResponse];
        }
    
        return outputMessages;
    })();

    for (const [name,response] of outputMessages){
        console.log(response);
        fs.writeFile(`${name}.txt`, response, {flag : 'w'}, err => {});
    }

    return outputMessages
}

askChatBot("Testing Testing 1 2 3");
