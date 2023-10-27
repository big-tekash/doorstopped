const { OpenAI } = require("openai");
const axios = require("axios");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async function(event, context) {
  let inputChat;

  if (event.httpMethod === 'POST') {
    // Parse the JSON body of the request
    const body = JSON.parse(event.body);
    inputChat = body.input; // Get inputChat from the request body
    console.log(body)
  } else {
    console.log('not PoST')
  }
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an education expert. You will be given meeting minutes from a school board. Your job is to ONLY find information about important policy changes that could negatively affect students. Prioritize grading, tests, suspensions, new hires, lunch, budget cuts, and major repairs. Double check that there's evidence for what you're saying in the text. Be simple and concise."
        },
        {   
          role: "user",
          content: inputChat
        }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: "200",
    });

    return {
      statusCode: 200,
      body: JSON.stringify(completion.choices[0].message.content)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error: ${error.message}`
    };
  }
};