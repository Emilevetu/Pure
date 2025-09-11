import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const JPL_HORIZONS_BASE_URL = "https://ssd.jpl.nasa.gov/api/horizons.api";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📡 JPL Horizons Proxy - Request received');
    
    // Get query parameters from the request URL
    const url = new URL(req.url);
    const queryParams = url.searchParams;
    
    console.log('🔍 Query parameters:', Object.fromEntries(queryParams.entries()));
    
    // Build the JPL Horizons API URL
    const jplUrl = new URL(JPL_HORIZONS_BASE_URL);
    
    // Copy all query parameters to the JPL URL
    for (const [key, value] of queryParams.entries()) {
      jplUrl.searchParams.set(key, value);
    }
    
    console.log('🚀 Making request to JPL Horizons:', jplUrl.toString());
    
    // Make the request to JPL Horizons API
    const response = await fetch(jplUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Astro-Alignement/1.0 (https://github.com/user/astro-alignement)',
        'Accept': 'application/json'
      }
    });
    
    console.log('📊 JPL Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ JPL API Error:', errorText);
      throw new Error(`JPL API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ JPL Response received successfully');
    
    return new Response(JSON.stringify(data), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
    
  } catch (error) {
    console.error('💥 Error in JPL Horizons proxy:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      result: null 
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});