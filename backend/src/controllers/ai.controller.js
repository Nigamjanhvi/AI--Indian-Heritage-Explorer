import { GoogleGenerativeAI } from '@google/generative-ai';
import Site from '../models/Site.js';

function model() {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: 'gemini-1.5-flash' });
}

export async function recommend(req, res) {
  const { interests = [], days = 3, state = '' } = req.body;
  const sites = await Site.find(state ? { state: { $regex: state, $options: 'i' } } : {}).limit(20);
  const summary = sites.map(site => `${site.name} in ${site.state} (${site.category})`).join('; ');
  const prompt = `Recommend Indian heritage places and generate a ${days}-day itinerary.
Interests: ${interests.join(', ') || 'history, culture, architecture'}.
Available sites: ${summary || 'Use famous Indian heritage places'}.
Return concise day-wise suggestions with reasons.`;

  const gemini = model();
  if (!gemini) {
    return res.json({
      answer: `Gemini API key is not configured. Based on your interests, start with ${sites.slice(0, 5).map(s => s.name).join(', ') || 'Taj Mahal, Hampi, Jaipur and Ajanta Caves'}.`
    });
  }

  const result = await gemini.generateContent(prompt);
  res.json({ answer: result.response.text() });
}

export async function chat(req, res) {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  const gemini = model();
  if (!gemini) {
    return res.json({ answer: 'Gemini API key is not configured yet. Add GEMINI_API_KEY to the backend environment.' });
  }

  const result = await gemini.generateContent(`You are an Indian heritage travel assistant. Answer helpfully and concisely: ${message}`);
  res.json({ answer: result.response.text() });
}
