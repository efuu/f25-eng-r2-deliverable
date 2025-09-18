/* eslint-disable */
// TODO: Import whatever service you decide to use. i.e. `import OpenAI from 'openai';`
import Anthropic from '@anthropic-ai/sdk';

// HINT: You'll want to initialize your service outside of the function definition
const anthropic = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"]
});

// const msg = await anthropic.messages.create({
//   model: "claude-opus-4-1-20250805",
//   max_tokens: 64,
//   messages: [{ role: "user", content: "Hello, Claude" }],
// });
// console.log(msg);

export async function generateResponse(message: string): Promise<string> {
  try {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: message }],
      system: `You are an animal ChatBot. Only answer questions related to animals.
                For questions not related to animals, politely remind the user that you only
                answer animal-related questions.`
    });    
    if(msg.type === "error") {
      return "Error:" + msg.error.message;
    }
    return msg.content[0].text;
    
  } catch(err) {
    console.log("Error: " + err);
  }
  return "Error: model failed to run";
}
