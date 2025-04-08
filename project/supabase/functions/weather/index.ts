const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');
if (!OPENWEATHER_API_KEY) {
  throw new Error('Missing OpenWeather API Key');
}

Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { city } = await req.json();

    if (!city) {
      return new Response(
        JSON.stringify({ error: 'City parameter is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const response = await fetch(weatherUrl);
    let data;
    
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse weather API response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid response from weather service' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    if (!response.ok) {
      console.error(`Weather API fetch failed with status ${response.status}:`, data);
      return new Response(
        JSON.stringify({ 
          error: data.message || 'Failed to fetch weather data',
          code: data.cod || response.status
        }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Weather function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});