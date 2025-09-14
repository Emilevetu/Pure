export interface ChatGPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatGPTResponse {
  content: string;
  error?: string;
}

export class ChatGPTService {
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  private static readonly MODEL = 'gpt-4o'; // GPT-4 Omni (le plus récent disponible)
  
  // Remplacez par votre clé API OpenAI
  private static readonly API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

  static async generateAstrologyAnalysis(
    planetaryData: string,
    birthData: string
  ): Promise<ChatGPTResponse> {
    console.log('🔍 [ChatGPT] Starting analysis...');
    console.log('🔑 [ChatGPT] API Key length:', this.API_KEY ? this.API_KEY.length : 0);
    
    if (!this.API_KEY) {
      console.error('❌ [ChatGPT] No API key found');
      return {
        content: '',
        error: 'OpenAI API key not configured. Please configure VITE_OPENAI_API_KEY in your environment variables.'
      };
    }

    // Valider la clé API (format moderne OpenAI)
    if (!this.API_KEY.startsWith('sk-')) {
      console.error('❌ [ChatGPT] Invalid API key format - must start with "sk-"');
      return {
        content: '',
        error: 'Invalid OpenAI API key format. Key must start with "sk-".'
      };
    }

    // Vérifier s'il y a des caractères non-ASCII dans la clé API
    if (/[^\x00-\x7F]/.test(this.API_KEY)) {
      console.warn('⚠️ [ChatGPT] API key contains non-ASCII characters, will be cleaned');
    }
    
    console.log('✅ [ChatGPT] API key format validated');

    try {
      console.log('📝 [ChatGPT] Preparing prompts...');
      console.log('🌍 [ChatGPT] Planetary data length:', planetaryData.length);
      console.log('👶 [ChatGPT] Birth data length:', birthData.length);
      const systemPrompt = `Tu es un astrologue expert et un astronome professionnel. Tu combines la précision scientifique de la NASA avec l'interprétation astrologique traditionnelle.

TON RÔLE :
- Analyser les positions planétaires précises calculées par JPL Horizons
- Fournir des interprétations astrologiques basées sur des données astronomiques exactes
- Créer un thème astral complet et personnalisé
- Utiliser un langage accessible mais professionnel

FORMAT DE RÉPONSE :
- Titre principal en gras avec des étoiles
- Sections clairement structurées avec des emojis appropriés
- Texte en gras pour les éléments clés (utilise **texte**)
- Espacement généreux entre les sections
- Ton chaleureux et professionnel

DONNÉES À ANALYSER :
- Positions planétaires exactes (longitude/latitude écliptique)
- Coordonnées géographiques de naissance
- Date et heure précises de naissance

IMPORTANT : Base tes interprétations sur les données astronomiques fournies, pas sur des généralités.`;

      const userPrompt = `Voici les données astronomiques précises de la NASA JPL Horizons pour générer un thème astral :

${planetaryData}

${birthData}

Génère-moi un thème astral complet et détaillé basé sur ces données astronomiques précises. Inclus une analyse du Soleil, de la Lune, et des aspects planétaires significatifs.`;

      const messages: ChatGPTMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      console.log('📤 [ChatGPT] Sending request to OpenAI...');
      console.log('🌐 [ChatGPT] API URL:', this.API_URL);
      console.log('🤖 [ChatGPT] Model:', this.MODEL);
      console.log('💬 [ChatGPT] Messages count:', messages.length);
      
      // Log the first 200 characters of each message to check for encoding issues
      messages.forEach((msg, index) => {
        console.log(`📨 [ChatGPT] Message ${index + 1} (${msg.role}):`, msg.content.substring(0, 200) + '...');
      });

      const requestBody = {
        model: this.MODEL,
        messages,
        max_tokens: 1500,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      };

      console.log('📋 [ChatGPT] Request body prepared:', JSON.stringify(requestBody, null, 2));

      // Valider et nettoyer les données avant l'envoi
      const cleanRequestBody = {
        ...requestBody,
        messages: requestBody.messages.map(msg => ({
          ...msg,
          content: msg.content.replace(/[^\x00-\x7F]/g, '') // Supprimer les caractères non-ASCII
        }))
      };

      console.log('🧹 [ChatGPT] Data cleaned, non-ASCII characters removed');

      // Créer les en-têtes de manière sécurisée
      const cleanApiKey = this.API_KEY.replace(/[^\x00-\x7F]/g, ''); // Nettoyer la clé API
      console.log('🔑 [ChatGPT] API key cleaned, length:', cleanApiKey.length);
      
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${cleanApiKey}`);

      console.log('🔧 [ChatGPT] Headers created successfully');

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(cleanRequestBody)
      });

      console.log('📥 [ChatGPT] Response received:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('❌ [ChatGPT] API response not ok:', response.status, response.statusText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 [ChatGPT] Response data:', data);
      
      const content = data.choices[0]?.message?.content || 'No response received';
      console.log('✅ [ChatGPT] Analysis completed successfully');

      return { content };

    } catch (error) {
      console.error('💥 [ChatGPT] Error caught:', error);
      console.error('💥 [ChatGPT] Error type:', typeof error);
      console.error('💥 [ChatGPT] Error message:', error instanceof Error ? error.message : 'No message');
      console.error('💥 [ChatGPT] Error stack:', error instanceof Error ? error.stack : 'No stack');
      
      return {
        content: '',
        error: `Error during analysis generation: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  static async generateProfileAnalysis(
    astroData: any,
    profileData: any
  ): Promise<ChatGPTResponse> {
    console.log('🔍 [ChatGPT] Starting profile analysis...');
    console.log('📊 [ChatGPT] AstroData:', JSON.stringify(astroData, null, 2));
    console.log('👤 [ChatGPT] ProfileData:', JSON.stringify(profileData, null, 2));
    
    if (!this.API_KEY) {
      console.error('❌ [ChatGPT] No API key found');
      return {
        content: '',
        error: 'OpenAI API key not configured'
      };
    }

    try {
      const userPrompt = `Tu es un astrologue tres qualifié, tu dis des faits concrets et non du baratin sur les planètes. Ton but est de m'aider à me connaitre.
Ta réponse doit capter mon attention et mon respect.
Utilise un ton respectueux et calme. Utilise "vous" et non "tu".

DONNÉES ASTRONOMIQUES :
- Ascendant : ${astroData.houseSystem?.ascendant?.sign || 'N/A'} (Maison ${astroData.houseSystem?.ascendant?.house || 'N/A'})
- MC : ${astroData.houseSystem?.mc?.sign || 'N/A'} (Maison ${astroData.houseSystem?.mc?.house || 'N/A'})
- Soleil : ${astroData.sun?.sign || 'N/A'} (Maison ${astroData.sun?.house || 'N/A'})
- Lune : ${astroData.moon?.sign || 'N/A'} (Maison ${astroData.moon?.house || 'N/A'})
- Mercure : ${astroData.mercury?.sign || 'N/A'} (Maison ${astroData.mercury?.house || 'N/A'})
- Vénus : ${astroData.venus?.sign || 'N/A'} (Maison ${astroData.venus?.house || 'N/A'})
- Mars : ${astroData.mars?.sign || 'N/A'} (Maison ${astroData.mars?.house || 'N/A'})
- Jupiter : ${astroData.jupiter?.sign || 'N/A'} (Maison ${astroData.jupiter?.house || 'N/A'})
- Saturne : ${astroData.saturn?.sign || 'N/A'} (Maison ${astroData.saturn?.house || 'N/A'})
- Uranus : ${astroData.uranus?.sign || 'N/A'} (Maison ${astroData.uranus?.house || 'N/A'})
- Neptune : ${astroData.neptune?.sign || 'N/A'} (Maison ${astroData.neptune?.house || 'N/A'})
- Pluton : ${astroData.pluto?.sign || 'N/A'} (Maison ${astroData.pluto?.house || 'N/A'})

RÉPONSES PERSONNELLES :
- Énergie : ${profileData.energy || 'N/A'}
- Ressources : ${profileData.resources || 'N/A'}
- Rôle : ${profileData.role || 'N/A'}
- Priorité : ${profileData.priority || 'N/A'}

Apprends moi quelque chose sur ma vie. Dis moi quelque chose qui fait sens pour moi.

Consigne finale : écris une seule réponse en 3 phrases maximum, directe et impactante, du style :
« Vous êtes destiné à rayonner par votre intelligence et vos réalisations, mais votre équilibre repose sur la liberté d'explorer et de créer.
Votre intensité peut impressionner ou déranger, mais elle constitue votre force : vous percevez ce que d'autres ne voient pas.
Votre mission est de transformer votre rigueur en puissance et votre quête en source d'inspiration pour autrui.»
`;

      const messages: ChatGPTMessage[] = [
        { role: 'user', content: userPrompt }
      ];

      console.log('📤 [ChatGPT] Sending profile analysis request...');
      console.log('🔍 [ChatGPT] Messages:', JSON.stringify(messages, null, 2));

      const requestBody = {
        model: this.MODEL,
        messages,
        max_tokens: 300,
        temperature: 0.8,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      };

      console.log('📋 [ChatGPT] Request body:', JSON.stringify(requestBody, null, 2));

      const cleanRequestBody = {
        ...requestBody,
        messages: requestBody.messages.map(msg => ({
          ...msg,
          content: msg.content.replace(/[^\x00-\x7F]/g, '')
        }))
      };

      const cleanApiKey = this.API_KEY.replace(/[^\x00-\x7F]/g, '');
      
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${cleanApiKey}`);

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(cleanRequestBody)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || 'No response received';
      
      console.log('✅ [ChatGPT] Profile analysis completed successfully');

      return { content };

    } catch (error) {
      console.error('💥 [ChatGPT] Error during profile analysis:', error);
      return {
        content: '',
        error: `Error during profile analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}
