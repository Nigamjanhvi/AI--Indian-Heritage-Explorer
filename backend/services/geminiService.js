import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

function hasGeminiKey() {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key');
}

function getModel() {
  if (!hasGeminiKey()) return null;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.75,
      topP: 0.9,
      maxOutputTokens: 1400
    }
  });
}

function parseGeminiText(result) {
  const response = result?.response;

  try {
    const text = response?.text?.();
    if (text?.trim()) return text.trim();
  } catch (error) {
    console.log('Gemini response.text() failed', error.message);
  }

  // Try multiple possible response shapes produced by various Gemini SDKs
  try {
    // 1) response.candidates -> content.parts[].text
    const candidateText = response?.candidates
      ?.flatMap(candidate => (candidate?.content?.parts || candidate?.content || []).map(part => part?.text || part || ''))
      ?.map(s => s && s.toString())
      ?.join('\n')
      ?.trim();
    if (candidateText) return candidateText;

    // 2) response.outputText or response.output?.text
    const outText = response?.outputText || response?.output?.text || response?.output?.content || null;
    if (typeof outText === 'string' && outText.trim()) return outText.trim();

    // 3) result?.candidates as top-level
    const topLevel = result?.candidates?.flatMap(c => c?.content?.parts || []).map(p => p?.text || '').join('\n').trim();
    if (topLevel) return topLevel;

    // 4) Some SDKs return generated text at result?.output[0]?.content[0]?.text
    const alt = result?.output?.[0]?.content?.[0]?.text;
    if (alt) return alt;
  } catch (err) {
    console.log('Error while extracting candidate text', err?.message || err);
  }

  // Helpful debug info when nothing is parsed
  const promptFeedback = response?.promptFeedback;
  const finishReasons = response?.candidates?.map(candidate => candidate.finishReason).filter(Boolean);
  console.log('Gemini empty candidate details', {
    promptFeedback,
    finishReasons,
    responseShape: Object.keys(response || {}).slice(0, 40),
    rawPreview: JSON.stringify(result?.response?.candidates?.slice(0,2) || result?.candidates?.slice(0,2) || []).slice(0,800)
  });

  return '';
}

export function detectIntent(message = '', messages = []) {
  const text = (message || '').toLowerCase();
  if (!text) return 'general';
  if (text.includes('weather') || text.includes('temperature') || text.includes('rain')) return 'weather';
  if (text.includes('itinerary') || text.includes('day') || text.match(/\bday\s*\d+/)) return 'travel_planning';
  if (text.includes('place') || text.includes('places') || text.includes('visit') || text.includes('attraction')) return 'destination_query';
  if (text.includes('temple') || text.includes('mandir') || text.includes('shrine')) return 'temple_query';
  if (text.includes('food') || text.includes('dish') || text.includes('eat') || text.includes('restaurant')) return 'food_query';
  if (text.includes('history') || text.includes('when built') || text.includes('who built')) return 'history_query';
  return 'general';
}

export function detectDestination(message = '', messages = []) {
  const text = (message || '').toLowerCase();
  const knownCountries = ['india', 'nepal', 'bhutan', 'pakistan', 'sri lanka', 'bangladesh', 'maldives'];
  const knownCities = ['jaipur', 'srinagar', 'delhi', 'agra', 'goa', 'kerala', 'udaipur', 'jodhpur', 'varanasi', 'chennai', 'mumbai', 'kolkata', 'lucknow'];

  for (const country of knownCountries) {
    if (text.includes(country)) return { place: country, isIndia: country === 'india' };
  }
  for (const city of knownCities) {
    if (text.includes(city)) return { place: city, isIndia: true };
  }

  // Check recent messages for place names
  for (const m of messages || []) {
    const t = (m.content || '').toLowerCase();
    for (const country of knownCountries) if (t.includes(country)) return { place: country, isIndia: country === 'india' };
    for (const city of knownCities) if (t.includes(city)) return { place: city, isIndia: true };
  }

  return { place: null, isIndia: true };
}

function heritageFallback(userPrompt = '') {
  const prompt = userPrompt.toLowerCase();
  const dayMatch = prompt.match(/(\d+)\s*(day|days)/);
  const days = dayMatch ? Number(dayMatch[1]) : 3;

  function miniItinerary(destination, theme, foods = 'regional thali, local snacks and tea stops') {
    return Array.from({ length: Math.min(days, 7) }, (_, index) => {
      const day = index + 1;
      if (day === 1) return `Day 1: Arrive in ${destination}\nStart with an easy orientation walk, one iconic viewpoint or landmark, and a relaxed local dinner.\nTip: Keep this day light so you can settle in and understand local travel time.\nFood: Try ${foods}.`;
      if (day === 2) return `Day 2: ${theme} highlights\nVisit the most meaningful sights early, add a local market or cultural stop, and keep sunset free for photos.\nTip: Book popular experiences in advance and avoid rushed transfers.\nFood: Choose a place known for local home-style cooking.`;
      return `Day ${day}: Slow travel and hidden gems\nExplore a nearby village, nature spot, museum, temple, fort, cafe street or scenic route based on your mood.\nTip: Keep one flexible block for weather, rest or spontaneous discoveries.\nFood: Try seasonal specialties and ask locals for a trusted restaurant.`;
    }).join('\n\n');
  }

  if (prompt.includes('rajasthan') || prompt.includes('fort')) {
    return `Here are excellent Rajasthan heritage ideas:

1. Amber Fort, Jaipur - grand courtyards, mirror work and hilltop views.
2. Mehrangarh Fort, Jodhpur - dramatic ramparts, museums and blue city views.
3. Jaisalmer Fort - a living desert fort with lanes, havelis and sunset points.
4. Chittorgarh Fort - powerful Rajput history and vast ruins.
5. Kumbhalgarh Fort - famous for its long defensive walls.

Travel tip: Pair Jaipur, Jodhpur and Udaipur for a classic 5 to 7 day route. Try dal baati churma, laal maas, ghewar and local thalis.`;
  }

  if (prompt.includes('kashmir') || prompt.includes('srinagar') || prompt.includes('gulmarg') || prompt.includes('pahalgam')) {
    return miniItinerary('Kashmir', 'meadows, gardens, lake views and mountain scenery', 'kahwa, rogan josh, dum aloo, nadru yakhni and wazwan dishes');
  }

  if (prompt.includes('goa')) {
    return miniItinerary('Goa', 'beaches, Portuguese heritage, cafes and relaxed coastal drives', 'Goan fish curry, poi bread, bebinca, xacuti and kokum drinks');
  }

  if (prompt.includes('kerala') || prompt.includes('backwater') || prompt.includes('munnar')) {
    return miniItinerary('Kerala', 'backwaters, spice gardens, hill views and cultural performances', 'appam with stew, sadya, puttu kadala, seafood and banana chips');
  }

  if (prompt.includes('himachal') || prompt.includes('manali') || prompt.includes('shimla') || prompt.includes('road trip')) {
    return miniItinerary('Himachal', 'mountain drives, old towns, cafes, temples and viewpoints', 'siddu, trout, thukpa, momos and local Himachali dham');
  }

  if (prompt.includes('honeymoon') || prompt.includes('couple')) {
    return `For a romantic India trip, consider Udaipur, Kashmir, Kerala, Coorg, Andaman, Goa or Munnar.

Best picks:
1. Udaipur - lakes, palaces, sunset dinners and boutique stays.
2. Kashmir - houseboats, gardens, meadows and mountain views.
3. Kerala - backwaters, Ayurveda, beaches and slow luxury.
4. Coorg - coffee estates, misty mornings and nature stays.

Tip: Choose fewer places and better stays. A relaxed 4 to 6 day plan feels more special than a rushed itinerary.`;
  }

  if (prompt.includes('family') || prompt.includes('kids')) {
    return `Family-friendly India vacation ideas:

1. Jaipur and Udaipur - forts, palaces, easy hotels and cultural shows.
2. Kerala - backwaters, beaches, wildlife and gentle pacing.
3. Mysore and Coorg - palace, gardens, coffee estates and scenic drives.
4. Delhi and Agra - museums, monuments and a short Taj Mahal trip.

Tip: Keep mornings for sightseeing, afternoons for rest, and choose hotels near main areas to reduce travel fatigue.`;
  }

  if (prompt.includes('budget') || prompt.includes('backpacking')) {
    return `Budget travel ideas in India:

1. Rajasthan backpacking - Jaipur, Pushkar, Jodhpur and Udaipur.
2. Himachal - McLeod Ganj, Bir, Manali and hostels.
3. Goa - local buses, guesthouses and beach shacks.
4. Hampi - affordable stays, cycling and ruins.

Money tips: travel by train or bus, eat at local restaurants, book hostels early, and group nearby sights by area.`;
  }

  if (prompt.includes('weather') || prompt.includes('pack') || prompt.includes('packing')) {
    return `Packing and weather guidance for India:

1. North India winter: carry layers, a warm jacket and comfortable shoes.
2. Summer: light cotton clothes, sunscreen, cap, reusable water bottle and sunglasses.
3. Monsoon: quick-dry clothes, waterproof footwear and a compact umbrella.
4. Temples and heritage sites: modest clothing, socks, scarf and easy-to-remove footwear.

Tell me your destination and month, and I can make this more exact.`;
  }

  if (prompt.includes('food')) {
    return `India food trail ideas:

1. Delhi - chaat, kebabs, parathas and old city sweets.
2. Rajasthan - dal baati churma, kachori, laal maas and ghewar.
3. Kerala - appam, stew, seafood, sadya and banana chips.
4. Tamil Nadu - dosa, filter coffee, Chettinad meals and temple prasadam.
5. Lucknow - kebabs, biryani and Awadhi desserts.

Tip: Mix famous spots with clean local restaurants and avoid overpacking your food day.`;
  }

  if (prompt.includes('safe') || prompt.includes('safety')) {
    return `India travel safety tips:

1. Keep digital and physical copies of IDs.
2. Use trusted transport apps or hotel-arranged taxis at night.
3. Dress respectfully at religious places.
4. Drink sealed or filtered water.
5. Avoid overly crowded areas with valuables exposed.
6. Share your route with someone if doing long road trips.

Most tourist routes are comfortable with basic planning and common sense.`;
  }

  if (prompt.includes('temple') || prompt.includes('south india') || prompt.includes('tamil')) {
    return `For South Indian temple travel, start with:

1. Meenakshi Amman Temple, Madurai - vibrant gopurams and sacred halls.
2. Brihadeeswarar Temple, Thanjavur - Chola architecture and UNESCO heritage.
3. Ramanathaswamy Temple, Rameswaram - long corridors and pilgrimage history.
4. Virupaksha Temple, Hampi - living temple inside a UNESCO landscape.
5. Shore Temple, Mahabalipuram - Pallava stonework by the sea.

Best time: November to February. Dress modestly and check temple timings before visiting.`;
  }

  if (prompt.includes('unesco') || prompt.includes('delhi')) {
    return `UNESCO heritage near Delhi:

1. Qutub Minar, Delhi - Indo-Islamic architecture and early Sultanate history.
2. Humayun's Tomb, Delhi - garden tomb that influenced Mughal architecture.
3. Red Fort, Delhi - imperial Mughal fort and national landmark.
4. Taj Mahal, Agra - reachable as a day trip or overnight journey.
5. Fatehpur Sikri, near Agra - Akbar's planned capital.

Tip: Combine Delhi and Agra into a 3-day heritage route.`;
  }

  return `Here are a few heritage travel ideas for India:

1. For monuments: explore Delhi, Agra, Jaipur and Gwalior.
2. For temples: try Tamil Nadu, Odisha, Karnataka and Varanasi.
3. For UNESCO sites: visit Hampi, Ajanta, Ellora, Qutub Minar and Taj Mahal.
4. For culture: plan around festivals, food trails, textile clusters and classical dance regions.

Tell me your city, number of days and interests, and I can shape a day-wise route.`;
}

function itineraryFallback({ destination = 'Rajasthan', days = 3, budget = 'medium', interests = [] } = {}) {
  const interestText = interests?.length ? interests.join(', ') : 'history, culture and food';
  const dayCount = Number(days) || 3;

  return Array.from({ length: dayCount }, (_, index) => {
    const day = index + 1;
    if (day === 1) {
      return `Day 1: Arrival in ${destination}
Place: Begin with the old city, a major fort or palace, and a local market.
Description: Ease into the destination with iconic architecture and a guided heritage walk.
Travel Tips: Start early, keep time for photos, and book monument tickets online where possible.
Food Recommendation: Try a traditional thali and a local sweet.`;
    }
    if (day === 2) {
      return `Day 2: Heritage and Culture Trail
Place: Visit temples, museums, craft streets and historic neighborhoods.
Description: Focus on ${interestText}, with time for stories behind the monuments.
Travel Tips: Hire a local guide for deeper context and carry water.
Food Recommendation: Choose a regional lunch and evening street snacks.`;
    }
    return `Day ${day}: Hidden Gems and Slow Travel
Place: Explore nearby heritage villages, stepwells, gardens or lesser-known monuments.
Description: A relaxed day for local culture, photography and shopping for crafts.
Travel Tips: Keep this day flexible and avoid long afternoon walks in hot weather.
Food Recommendation: Try a family-run restaurant or local breakfast specialty.`;
  }).join('\n\n');
}

export async function askGemini({ message, messages = [], systemPrompt = '', fallbackPrompt = message, fallbackText = null } = {}) {
  const model = getModel();
  const preview = (systemPrompt || '') + ' | ' + (message || '');
  const requestLabel = { model: MODEL_NAME, promptPreview: preview.slice(0, 180) };

  console.log('Gemini Request', requestLabel);

  if (!model) {
    const fallback = fallbackText || heritageFallback(fallbackPrompt);
    console.log('No Gemini key - using fallback');
    return { text: fallback, json: null, raw: fallback };
  }

  // Build a single prompt that includes system prompt and recent conversation
  const history = (messages || []).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
  const instruction = `Respond concisely and when possible return valid JSON only with keys: type, title, destination, attractions (array), foods (array), tips (array), text (string), followUpQuestions (array). Also include a brief natural language summary if JSON is not appropriate.`;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const finalPrompt = `${systemPrompt}\n\n${instruction}\n\nConversation:\n${history}\nUser: ${message}`;

      const result = await model.generateContent(finalPrompt);
      console.log('Gemini Response', JSON.stringify({ attempt, promptFeedback: result?.response?.promptFeedback, finishReasons: result?.response?.candidates?.map(candidate => candidate.finishReason) }));

      const parsedText = parseGeminiText(result);
      console.log('Parsed Response', parsedText || '[empty]');

      // Try to parse JSON from the model output
      let parsedJson = null;
      if (parsedText) {
        try {
          // Some models return JSON inside markdown or code fences - attempt to extract
          const jsonMatch = parsedText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          const jsonCandidate = jsonMatch ? jsonMatch[0] : parsedText;
          parsedJson = JSON.parse(jsonCandidate);
        } catch (e) {
          parsedJson = null;
        }
      }

      if (parsedText) return { text: parsedText, json: parsedJson, raw: result };
    } catch (error) {
      console.log('Gemini Error', { attempt, message: error.message, status: error.status, details: error.errorDetails });
    }
  }

  const fallback = fallbackText || heritageFallback(fallbackPrompt);
  console.log('Parsed Response (fallback)', fallback);
  return { text: fallback, json: null, raw: fallback };
}

export async function generateItinerary({ destination, state, days = 3, budget = 'medium', interests = [], companion = 'travelers', occasion = 'vacation', season = 'flexible', weather = 'pleasant', destinationType = 'Anywhere in India' }) {
  const place = destination || state || 'India';
  const prompt = `You are a friendly premium India travel planner.

Generate a beautiful ${days}-day itinerary for ${place}.
Destination type: ${destinationType}
Budget: ${budget}
Travelling with: ${companion}
Occasion: ${occasion}
Travel season: ${season}
Weather preference: ${weather}
Interests: ${(interests || []).join(', ') || 'history, architecture, food and culture'}

If the destination is Jaipur, use Jaipur-specific heritage sites such as Amber Fort, City Palace, Hawa Mahal, Jantar Mantar, Nahargarh Fort and local bazaar experiences. Mention Jaipur foods like dal baati churma, ghewar and laal maas.
If the destination is a specific city, name actual monuments, markets and local neighborhoods in that city.
If the destination is a state, build a focused regional route with real destinations in that state.
If the destination is Anywhere in India, recommend a premium heritage or food-focused route that reflects India’s real cultures and seasons.
Avoid vague phrases like "city highlights" or "popular attractions" without naming real places.

Use this exact structure for each day:

Day 1: Short title
Place: specific place or route
Description: 2-3 useful sentences
Travel Tips: practical timing, transport or booking advice
Food Recommendation: local dish or food area
Distance: estimated local distance or route note
Budget Note: simple cost guidance

Also include nearby attractions, packing suggestions and travel safety tips naturally inside the day plan. Keep it warm, practical and easy for a first-time traveler.`;

  const fallbackText = itineraryFallback({ destination: place, days, budget, interests });
  const responseObj = await askGemini({
    message: prompt,
    systemPrompt: 'You are a premium travel itinerary generator for India. Provide practical day-wise plans and real place names.',
    fallbackPrompt: `${place} ${days} day itinerary ${budget} ${(interests || []).join(' ')}`,
    fallbackText
  });

  const text = (responseObj && responseObj.text) ? responseObj.text : fallbackText;
  return (typeof text === 'string' ? text.trim() : JSON.stringify(text));
}
