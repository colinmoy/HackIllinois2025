const axios = require("axios");
require('dotenv').config();

const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = "https://openai-agco-poc.openai.azure.com";
const API_VERSION = "2024-10-21";

// Define the endpoints
const endpoints = {
    gpt_40: "gpt-4o-2",
    gpt_o1_mini: "o1-mini"
};

// Define the payload
const payload = {
    messages: [
        { role: "user", content: "Hello, how are you?" }
    ]
};

// Function to test an endpoint
async function testEndpoint(name, deploymentId) {
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
        console.log(`${name} endpoint is working. Response:`, response.data);
    } catch (error) {
        console.error(`${name} endpoint failed. Error:`, error.response?.data || error.message);
    }
}

// Test both endpoints
(async () => {
    for (const [name, deploymentId] of Object.entries(endpoints)) {
        await testEndpoint(name, deploymentId);
    }
})();
