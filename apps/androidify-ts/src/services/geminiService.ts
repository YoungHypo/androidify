import * as FileSystem from 'expo-file-system';
export type BotColor = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
};

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export interface GenerationOptions {
  prompt: string;
  botColor: BotColor;
}

export interface GenerationResult {
  imageUri: string;
  prompt: string;
  timestamp: number;
}

class GeminiService {
  constructor() {}

  private getMimeTypeFromUri(uri: string): string {
    const lower = (uri || '').toLowerCase();
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.heic')) return 'image/heic';
    if (lower.endsWith('.webp')) return 'image/webp';
    return 'image/jpeg';
  }

  // Step 1: validate image is appropriate
  async validateImageForPolicy(imageUri: string): Promise<{ success: boolean; error?: string }> {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-api-key-here') {
      throw new Error('Missing Gemini API key');
    }

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const model = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const mimeType = this.getMimeTypeFromUri(imageUri);

    const instruction = `You are to analyze the provided image and determine if it is acceptable and appropriate based on specific criteria.
            In the JSON response, respond with the result 'success' as set to true or false based on results.
            If the image is considered invalid, include the relevant reason as to why it is invalid in the 'error' property. A photo is only valid if:
            - it is a photo of a person, at least showing their shoulders and head, it can be a full body photo
            - it must be a photo of a person
            - the photo has a clear main person in it, if there are people in the background ignore them
            - it cannot contain nudity or explicit content
            - it cannot contain illegal weapons or violent references
            - it cannot contain references to drugs or other illicit substances
            - it cannot contain  hate speech or other offensive language
            -it cannot contain blood or gore or violence.`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inline_data: { mime_type: mimeType, data: base64 } },
              { text: instruction + '\nReturn strictly a minified JSON like {"success":true,"error":""} with no extra commentary.' },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`validateImage failed ${res.status}: ${txt}`);
    }

    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    try {
      const parsed = JSON.parse(text);
      const success = Boolean(parsed?.success);
      const error = typeof parsed?.error === 'string' ? parsed.error : undefined;
      return { success, error };
    } catch (e) {
      const lowered = String(text).toLowerCase();
      const success = lowered.includes('"success":true') || lowered.includes('success:true');
      return { success, error: success ? undefined : 'Image validation response unparsable' };
    }
  }

  // Step 2: extract human subject description
  async extractHumanSubjectDescription(imageUri: string): Promise<string> {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-api-key-here') {
      throw new Error('Missing Gemini API key');
    }

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const model = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const mimeType = this.getMimeTypeFromUri(imageUri);

    const instruction = `Extract detailed information about the human subject included in the provided image. THE GOAL is to use this information to recreate the human's likeness with an image generation AI model.

            * Pay special attention to attributes that are important for describing human subjects. Provide rich visual detail for attributes such as:
            - Hair: Describe the hair in detail, including its style (e.g., layered bob, loose waves, tight curls), length (e.g., chin-length, shoulder-length, cascading), and color. For hair color, be specific about the particular shade of hair (e.g. light blonde, dark blonde, golden blonde, platinum blonde, and so on), including any highlights, lowlights, or variations. If applicable, meticulously describe any bangs (e.g., blunt, side-swept, wispy), braids (e.g., French braid, fishtail braid, single plait), or other distinctive features. Explicitly name the hairstyle if known (e.g., pixie cut, updo, ponytail). If the subject does not have hair, describe it as bald.
            - Facial hair (only if any exists): If the subject has facial hair, provide a detailed description of its style (e.g., goatee, full beard, mustache), length (e.g., stubble, short, long), texture (e.g., coarse, fine, wiry), and color (including any variations). Explicitly name the facial hair style if known. If the subject does not have facial hair, describe it as no facial hair.
            - Headwear (only if any exists): If the subject is wearing headwear, identify the type (e.g., baseball cap, fedora, beanie), color, and material. Describe any visually distinct details such as patterns (e.g., plaid, stripes, floral), textures (e.g., knit, leather, straw), or embellishments (e.g., embroidery, sequins, ribbons). Specify its position on the head (e.g., tilted back, covering the ears). Include the name of the headwear if possible.
            - Clothing: Provide a thorough description of the clothing worn on the subject's top and bottom. For each garment, detail the style (e.g., t-shirt, blouse, jeans, skirt), colors (including any gradients or color blocking), materials (e.g., cotton, silk, denim), patterns (e.g., polka dots, floral, paisley, geometric), embellishments (e.g., buttons, zippers, lace), and fit (e.g., tight, loose, tailored). Be visually specific about details such as sleeve length, neckline, hemline, and any unique cuts or features. Include the name of the clothing items if known (e.g., A-line skirt, Henley shirt). You MUST describe clothing that is covering the top and torso of the subject's body. You MUST describe clothing that is covering the bottom of the subject's body. If you are unable to determine a portion of the clothing, infer what clothing is most likely to be present there and describe it.
            - Footwear (only if they exist): If the subject is wearing footwear, identify the type (e.g., sneakers, boots, sandals), color, and style (e.g., running shoes, ankle boots, flip-flops). Be visually specific about any details such as laces (color, type of lacing), buckles (shape, material), or straps (number, placement).
            - Accessories: Describe any accessories worn by the subject, including jewelry (e.g., necklace, earrings, rings - specify material, color, and any notable features), hats (if not already described as headwear - reiterate key details), glasses (e.g., frame shape, color, lens type), watches (e.g., strap material, face color), and any other visible adornments (e.g., scarves, belts - describe color, material, and how they are worn). Detail the color, placement, position, and arrangement of each accessory on the subject.
            - Props or items: Describe any props or items the subject is holding or interacting with. This includes electronic devices (e.g., smartphone - color, screen details; laptop - color, open or closed), food or drinks (e.g., coffee cup - color, material; apple - color, size), sporting equipment (e.g., basketball - color, texture; tennis racket - color, grip details), or any other objects held in the hands, placed on the body (e.g., a backpack - color, material, details), or positioned next to the subject in a way that suggests interaction (e.g., a book lying open). For each item, describe its color, material, and any significant details. Prefer to be held on the hand if possible. Do not include furniture. Furniture is not considered a prop or item.
            - Any other special attributes or characteristics of the subject's body and style that provide further detail

            * If the person's clothing, accessories or items include photorealistic depictions of humans or animals, describe them as having a cartoon style.
            * If the person's clothing, accessories or items include artistic renderings, graphical depictions, or elaborate pictures describe them as having a cartoon style, portrayed in a simple manner.
            * Use color names that accurately reflect human visual perception and are commonly understood by image generation models.
            * DO NOT describe the background or setting that is behind or around the subject. Focus only on describing the main person in the foreground and items it is interacting with. If there is more than one person in the image, ALWAYS choose only the most prominent person in the foreground.
            * Do not describe the skin color of the subject in the image.
            * Do not infer ethnicity.
            * Do not infer gender. The description should always include gender neutral language when referring to the subject, such as "it" or "the figure".
            * Do not describe any permanent markings on the skin such as tattoos, scars, birthmarks, skin discolorations, or notable moles. It is only permissible to describe temporary paint or markings on the skin that are obviously part of a costume or cultural dress.
            * Do not describe any facial expressions. However, describing the subject's general mood is helpful.
            * DO NOT describe parts of the face such as the nose, mouth, lips, teeth, or tongue. The final rendered figure should not have these body parts.
            * Do not describe any body piercings such as nose piercings or naval piercings. Only describing earrings is permissible.
            * Do not describe nails, nail polish, or rings if present on the subject's fingers or toes. Avoid including the words "fingers" or "toes" in your description.
            * Do not describe any branded logos or icons or emblems that may be included in the image or as part of the subject.
            * DO NOT describe any text, slogans, typography or items that depict alphanumeric symbols that may be found in the image. Instead, describe it as a generic placeholder and blur it.
            * Do not describe any blood or gore or open wounds, if they are present on the subject.
            * Do not describe the pose that the subject is in, such as sitting, standing, dancing, or waving. Only describe what the subject looks like. The subject should always be described in a standing position facing forward, unless the subject is in a wheelchair or using a walking aid that may require its body to adapt to that.
            * Do not include any adult substances inappropriate for children, nor any actions directly related to their use. Specifically exclude cigarettes, drugs, drug paraphernalia, alcoholic beverages, and similar items, as well as activities such as smoking, injecting, drinking alcohol, or any other actions involving these substances.
            * If the subject is holding any weapon that suggests violence, only describe it if it is obviously a toy, a fake prop that won't actually cause harm, or is used in common sports. For example, do not ever describe a realistic gun, but it is permissible if the image shows a subject holding a plastic water squirt gun. Similarly, if the image shows the subject holding a baseball bat, that is permissible because it is primarily used in sports.
            * ID badges or any accessories or items that include a person's face MUST be stated together with the phrase "that has no image." For example, "ID badge that has no image," etc.


            * Your description should start with a high level overview of the new image starting with style. Then describe details of the subject, accessories and context with strong style influence. Then finish with details about the style.
            * Do not use the word "Subject" in description.
            * Never say "the image".
            * Never use the suffix "-esque" or "-style".
            * Do not say rendered, rendering, or digital.
            * Only respond with new image description as a paragraph.`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inline_data: { mime_type: mimeType, data: base64 } },
              { text: instruction },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`extractHumanSubjectDescription failed ${res.status}: ${txt}`);
    }

    const json = await res.json();
    const text =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ||
      json?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join(' ').trim();

    if (!text) {
      throw new Error('Empty description from Gemini');
    }
    return text.trim();
  }

  async generateAndroidBotFromImage(imageUri: string, botColor: BotColor): Promise<GenerationResult> {
    const validation = await this.validateImageForPolicy(imageUri);
    if (!validation.success) {
      throw new Error(validation.error || 'Selected image is not valid.');
    }
    const description = await this.extractHumanSubjectDescription(imageUri);
    return this.generateAndroidBot({ prompt: description, botColor });
  }

  async generateAndroidBot(options: GenerationOptions): Promise<GenerationResult> {
    try {
      const enhancedPrompt = this.buildAndroidBotPrompt(options);

      if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-api-key-here') {
        throw new Error('Missing Gemini API key');
      }

      // Use REST Imagen predict endpoint per latest spec
      const model = 'imagen-4.0-generate-preview-06-06';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          instances: [
            { prompt: enhancedPrompt },
          ],
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Imagen predict failed ${res.status}: ${txt}`);
      }

      const json = await res.json();

      const base64 =
        json?.predictions?.[0]?.bytesBase64Encoded ||
        json?.generatedImages?.[0]?.data ||
        json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ||
        json?.generated_images?.[0];

      if (base64 && typeof base64 === 'string') {
        const uri = await this.saveImageToDevice(base64);
        return { imageUri: uri, prompt: options.prompt, timestamp: Date.now() };
      }
    } catch (error) {
      console.warn('Image generation failed, falling back to placeholder:', error);
    }

    // Fallback to placeholder SVG if anything fails
    const placeholder = await this.createPlaceholderImage(options.prompt, options.botColor);
    return { imageUri: placeholder, prompt: options.prompt, timestamp: Date.now() };
  }

  private async createPlaceholderImage(prompt: string, botColor: BotColor): Promise<string> {
    // Create a simple SVG placeholder image
    const svgContent = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${botColor.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${botColor.secondary};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" fill="#f0f0f0"/>
        
        <!-- Android Robot Body -->
        <rect x="156" y="200" width="200" height="180" rx="20" ry="20" fill="url(#grad1)"/>
        
        <!-- Android Robot Head -->
        <rect x="176" y="120" width="160" height="100" rx="50" ry="50" fill="url(#grad1)"/>
        
        <!-- Antennas -->
        <circle cx="206" cy="110" r="3" fill="${botColor.accent}"/>
        <circle cx="306" cy="110" r="3" fill="${botColor.accent}"/>
        <line x1="206" y1="110" x2="196" y2="90" stroke="${botColor.accent}" stroke-width="3"/>
        <line x1="306" y1="110" x2="316" y2="90" stroke="${botColor.accent}" stroke-width="3"/>
        
        <!-- Eyes -->
        <circle cx="216" cy="150" r="8" fill="white"/>
        <circle cx="296" cy="150" r="8" fill="white"/>
        <circle cx="216" cy="150" r="4" fill="black"/>
        <circle cx="296" cy="150" r="4" fill="black"/>
        
        <!-- Arms -->
        <rect x="120" y="220" width="30" height="100" rx="15" ry="15" fill="url(#grad1)"/>
        <rect x="362" y="220" width="30" height="100" rx="15" ry="15" fill="url(#grad1)"/>
        
        <!-- Legs -->
        <rect x="186" y="390" width="30" height="80" rx="15" ry="15" fill="url(#grad1)"/>
        <rect x="296" y="390" width="30" height="80" rx="15" ry="15" fill="url(#grad1)"/>
        
        <!-- Decorative elements based on prompt -->
        <text x="256" y="440" text-anchor="middle" font-family="Arial" font-size="16" fill="${botColor.accent}">
          ${prompt.slice(0, 20)}${prompt.length > 20 ? '...' : ''}
        </text>
      </svg>
    `;

    // Save SVG to cache and return uri
    const filename = `androidify_placeholder_${Date.now()}.svg`;
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;
    
    await FileSystem.writeAsStringAsync(fileUri, svgContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return fileUri;
  }

  private buildAndroidBotPrompt(options: GenerationOptions): string {
    const { prompt, botColor } = options;

    return `
        Create a 3D rendered, cartoonish Android mascot in a photorealistic style.
        The pose is relaxed and straightforward, facing directly forward with shoulders at ease,
        as if posing for a photo. The cartoonish exaggeration is subtle, lending a playful touch
        to the otherwise realistic rendering of the figure.
        
        The bot should take on the body shape of the newest Google Android Robot with distinctive
        rounded body, semi-circular head with two short, straight antennae, and simple cylindrical
        arms and legs.
        
        Description: ${prompt}
        Primary color: ${botColor.name}
        
        The figure is centered against a muted, neutral warm cream colored background (#F8F2E4)
        giving the figurine a unique and collectible appeal.
        `
  }

  private async saveImageToDevice(base64Data: string): Promise<string> {
    try {
      const filename = `androidify_${Date.now()}.png`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return fileUri;
    } catch (error) {
      console.error('Error saving image:', error);
      throw new Error('Failed to save generated image');
    }
  }
}

export const geminiService = new GeminiService();
