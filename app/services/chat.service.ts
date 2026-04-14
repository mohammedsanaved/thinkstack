// Replace with Firebase logic

export async function getRecentMessages(chatId: string) {
  // TODO: Fetch last 5–10 messages from Firebase
  return 'Previous conversation...';
}

export async function saveMessage(
  chatId: string,
  userMessage: string,
  aiResponse: string,
) {
  // TODO: Save to Firebase
  console.log({ chatId, userMessage, aiResponse });
}
