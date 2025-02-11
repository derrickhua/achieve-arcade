import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getMilestones(message) {
  let timeoutId;
  let intervalId;
  const maxRetries = 3;
  let attempts = 0;

  async function runMilestoneGeneration(message) {
    try {
      // Create and start the run
      const run = await openai.beta.threads.createAndRun({
        assistant_id: process.env.ASSISTANT_ID,
        thread: {
          messages: [
            { role: "user", content: message },
          ],
        },
        stream: false
      });

      // Get the IDs of the thread and run
      const thread_id = run.thread_id;
      const run_id = run.id;

      // Set a timeout for the run
      const timeout = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
          console.log('Operation timed out');
          reject('Timed out');
        }, 60000);  // 1 minute timeout
      });

      const runCompleted = new Promise((resolve, reject) => {
        intervalId = setInterval(async () => {
          try {
            const runStatus = await openai.beta.threads.runs.retrieve(thread_id, run_id);
            if (runStatus.status === 'completed') {
              resolve(runStatus);
            }
          } catch (error) {
            console.error('Error retrieving run status:', error);
            reject(error);
          }
        }, 2000);  // Check every 2 seconds
      });

      const completedRunStatus = await Promise.race([runCompleted, timeout]);
      clearInterval(intervalId);
      clearTimeout(timeoutId);

      // Retrieve thread messages
      const threadMessages = await openai.beta.threads.messages.list(thread_id);

      // Log the content before parsing
      const responseText = threadMessages.data[0].content[0].text.value;

      // Extract the JSON string from the response
      const jsonStringMatch = responseText.match(/\[\s*\{[^]*?\}\s*\]/);
      if (!jsonStringMatch) {
        throw new Error('No valid JSON array found in the response');
      }
      const jsonString = jsonStringMatch[0];

      // Parse the JSON string
      const milestones = JSON.parse(jsonString);
      return milestones;

    } catch (error) {
      console.error('Error in runMilestoneGeneration:', error);
      if (attempts < maxRetries) {
        attempts++;
        console.log(`Retrying... Attempt ${attempts} of ${maxRetries}`);
        return runMilestoneGeneration(message);
      } else {
        throw new Error('Failed to parse JSON from OpenAI response after multiple attempts');
      }
    } finally {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    }
  }

  return runMilestoneGeneration(message);
}
