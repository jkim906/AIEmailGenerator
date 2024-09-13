const readline = require("readline");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//helper function
function queryUser(query, callback) {
  rl.question(query, (answer) => {
    callback(answer);
  });
}

function writeEmail() {
  queryUser("CEO's name: ", function (ceoName) {
    queryUser("Company name: ", function (companyName) {
      queryUser(
        "A short description of the company: ",
        function (companyDescription) {
          let softwareExperience = "";
          if (companyDescription.toLowerCase().includes("software")) {
            softwareExperience =
              "Also mention this: We have experience investing in the software space, with recent investments in Xero and Vend in New Zealand.";
          }

          openai.chat.completions
            .create({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: "You are a email assistant for Everyday Capital.",
                },
                {
                  role: "user",
                  content: `Generate an email for me. The company sending this email is from Everyday Capital. The email is to the CEO of ${companyName}(Company Name) named ${ceoName}. A short description of their company: ${companyDescription}. Include why their companies industry is exciting and suggest a meeting. ${softwareExperience}.`,
                },
              ],
              max_tokens: 300,
              temperature: 0.2,
            })
            .then((response) => {
              const messageContent = response.choices[0].message.content;
              console.log("\nGenerated Email For You:\n");
              console.log(messageContent);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
          rl.close();
        }
      );
    });
  });
}

writeEmail();
