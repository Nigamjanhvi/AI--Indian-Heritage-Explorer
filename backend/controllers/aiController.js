import asyncHandler from '../middleware/asyncHandler.js';
import { askGemini, generateItinerary, detectIntent, detectDestination } from '../services/geminiService.js';

export const chat = asyncHandler(async (req, res) => {
  const { message, conversationHistory } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

  // Detect intent and destination to tailor the assistant instructions
  const intent = detectIntent(message, conversationHistory || []);
  const detected = detectDestination(message, conversationHistory || []);
  const placeHint = detected && detected.place ? detected.place : null;
  const isIndia = detected && typeof detected.isIndia !== 'undefined' ? detected.isIndia : true;

  let systemPrompt = isIndia
    ? `You are a friendly, premium India travel assistant. Answer precisely using real monuments, local foods, and practical travel tips.`
    : `You are a friendly, premium travel assistant for ${placeHint || 'the requested destination'}. Answer precisely using real monuments, local foods, and practical travel tips relevant to ${placeHint || 'the destination'}.`;
  if (intent === 'destination_query') systemPrompt += ' The user is asking about places to visit; provide named attractions and short notes.';
  if (intent === 'temple_query') systemPrompt += ' Focus on the temple: location, history, best time, travel route and nearby attractions.';
  if (intent === 'food_query') systemPrompt += ' Provide specific local dishes and recommended places to try them.';
  if (intent === 'weather') systemPrompt += ' Provide seasonal/weather guidance and packing tips.';

  systemPrompt += ' When asked, prefer returning structured JSON with keys: type, title, destination, attractions (array), foods (array), tips (array), text (string), followUpQuestions (array).';

  console.log('AI Chat request:', { message, conversationHistoryLength: (conversationHistory || []).length, intent, detected: { place: placeHint, isIndia } });

  const response = await askGemini({
    message,
    messages: conversationHistory,
    systemPrompt,
    fallbackPrompt: message
  });

  // askGemini returns { text, json, raw }
  console.log('AI Chat response preview:', { textSample: (response && response.text) ? response.text.slice(0, 240) : null, hasJson: !!response.json });

  res.json({ success: true, response: response.text || (typeof response.raw === 'string' ? response.raw : ''), parsed: response.json || null, raw: response.raw });
});

export const itinerary = asyncHandler(async (req, res) => {
  const response = await generateItinerary(req.body);
  res.json({ success: true, response, answer: response, reply: response });
});
