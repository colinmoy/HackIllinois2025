const AzureOpenAI = require('openai');
require('dotenv').config();

const client = new AzureOpenAI();

async function main() {
    const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-4o-2'
    });

    console.log(chatCompletion);
}

main();

console.log('byw~');