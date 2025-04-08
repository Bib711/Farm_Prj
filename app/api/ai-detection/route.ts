import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY || '';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Enable mock response when the real API hits rate limits
const USE_MOCK_FALLBACK = true;

// Define a sleep function for the retry mechanism
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock response for development/testing when API is rate-limited
const getMockAnalysis = () => {
  return `
Plant Identification: Tomato plant (Solanum lycopersicum)

Health Assessment: The plant shows signs of disease affecting the leaves.

Specific Condition: Early Blight (Alternaria solani) - This fungal disease is characterized by the brown/black spots with concentric rings visible on the lower and middle leaves. The yellow areas surrounding the lesions (chlorosis) are also typical of this condition.

Severity Level: Moderate

Recommended Treatments:
1. Remove and destroy affected leaves immediately to prevent spread.
2. Apply a copper-based fungicide like Bonide Copper Fungicide, following package instructions for application rates.
3. Consider organic options such as neem oil spray (2 tablespoons per gallon of water) applied weekly.
4. For severe cases, commercial fungicides containing chlorothalonil (like Daconil) can be effective.
5. Improve air circulation by properly spacing and pruning plants.

Prevention Tips:
1. Practice crop rotation - don't plant tomatoes or related plants (potatoes, peppers) in the same spot for 2-3 years.
2. Water at the base of plants rather than overhead to keep foliage dry.
3. Apply a layer of mulch to prevent soil-borne spores from splashing onto lower leaves.

Nutritional Recommendations: A balanced tomato fertilizer with a ratio like 5-10-10 or 5-10-5 would be beneficial. Higher phosphorus and potassium levels (middle and last numbers) support disease resistance and fruit production, while limiting nitrogen can help prevent excessive foliage growth.

Expected Recovery Time: With proper treatment, new growth should be healthy within 2-3 weeks, though affected leaves won't recover and should be removed. Complete recovery and normal fruit production may take 4-6 weeks with consistent treatment.
`;
};

// Function to make API request with retry logic
async function makeApiRequestWithRetry(requestBody: any, maxRetries = 3) {
  let retries = 0;
  let lastError: Error | null = null;

  while (retries < maxRetries) {
    try {
      // Exponential backoff: 1s, 2s, 4s, ...
      if (retries > 0) {
        const backoffTime = Math.pow(2, retries - 1) * 1000;
        console.log(`Retry attempt ${retries}. Waiting ${backoffTime}ms before retrying...`);
        await sleep(backoffTime);
      }

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      // If we hit a rate limit error, throw it to be caught and retried
      if (response.status === 429 || 
          (data.error && data.error.message && data.error.message.includes('Quota exceeded'))) {
        throw new Error(`Rate limit exceeded: ${data.error?.message || 'Too many requests'}`);
      }
      
      // For any other error, return the error response without retrying
      if (!response.ok) {
        return { success: false, data, status: response.status };
      }
      
      // Success case
      return { success: true, data, status: response.status };
    } catch (error: any) {
      lastError = error;
      
      // Only retry for rate limit errors
      if (error.message && error.message.includes('Rate limit exceeded')) {
        retries++;
        console.log(`Rate limit error. Retry ${retries}/${maxRetries}`);
      } else {
        // For other errors, don't retry
        break;
      }
    }
  }

  // If we've exhausted all retries or hit a non-retryable error
  return { 
    success: false, 
    data: { error: { message: lastError?.message || 'Failed after multiple retry attempts' } },
    status: 500
  };
}

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data (base64) is required.' },
        { status: 400 }
      );
    }

    console.log("Preparing request to Gemini API...");
    
    // Prepare the Gemini API request body
    const requestBody = {
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            }
          },
          {
            text: `You are an expert agricultural advisor specializing in plant health diagnostics. Please analyze this image in detail and respond with the following structured information:

1. Plant Identification: Identify the type of plant or seed shown in the image.
2. Health Assessment: Determine if the plant is healthy or shows signs of disease or pest infestation.
3. Specific Condition: If you detect any issues, name and describe the specific disease, pest, or condition affecting the plant.
4. Severity Level: Estimate the severity of the condition (Mild, Moderate, Severe).
5. Recommended Treatments: Provide 3-5 specific treatment options, including both organic/natural remedies and commercial products.
6. Prevention Tips: Suggest 3 preventative measures to avoid this issue in the future.
7. Nutritional Recommendations: If relevant, suggest appropriate fertilizers or nutrient supplements.
8. Expected Recovery Time: Provide an estimated timeline for recovery if treatment recommendations are followed.

Format your response with clear headings for each section.`
          }
        ]
      }]
    };

    // Use our retry function instead of directly making the API call
    console.log("Sending request to Gemini API with retry mechanism...");
    const result = await makeApiRequestWithRetry(requestBody);
    
    if (!result.success) {
      console.error("API error:", result.data?.error?.message || "Unknown error");
      
      // If it's a rate limit error and fallback is enabled, return mock data
      if ((result.data?.error?.message?.includes('Quota exceeded') || 
          result.data?.error?.message?.includes('Rate limit')) && 
          USE_MOCK_FALLBACK) {
        console.log("Using mock response due to API rate limit");
        return NextResponse.json({ 
          analysis: getMockAnalysis(),
          isMockResponse: true 
        });
      }
      
      // Otherwise return the error
      return NextResponse.json(
        { error: `Gemini API error: ${result.data?.error?.message || "Unknown error"}` },
        { status: result.status || 500 }
      );
    }

    const data = result.data;
    
    // Extract the analysis text from the response
    const analysis = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysis) {
      console.error("No analysis text found in response:", data);
      
      // If no analysis is found and fallback is enabled, return mock data
      if (USE_MOCK_FALLBACK) {
        console.log("Using mock response due to missing analysis");
        return NextResponse.json({ 
          analysis: getMockAnalysis(),
          isMockResponse: true 
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to get analysis from API. No text content in response.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Plant analysis error:', error);
    
    // If there's an exception and fallback is enabled, return mock data
    if (USE_MOCK_FALLBACK) {
      console.log("Using mock response due to exception");
      return NextResponse.json({ 
        analysis: getMockAnalysis(),
        isMockResponse: true 
      });
    }
    
    return NextResponse.json(
      { error: `Server error: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
