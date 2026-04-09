import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { link } = await request.json();

    if (!link || !link.includes('github.com')) {
      return NextResponse.json(
        { error: 'A valid GitHub repository link is required.' },
        { status: 400 }
      );
    }

    // Extract owner and repo
    const match = link.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      return NextResponse.json(
        { error: 'Could not parse GitHub link.' },
        { status: 400 }
      );
    }

    const owner = match[1];
    let repo = match[2];
    
    // Remove .git if present
    repo = repo.replace(/\.git$/, '');

    // Fetch README from GitHub API
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
    if (!readmeRes.ok) {
      return NextResponse.json(
        { error: 'Could not fetch README from GitHub.' },
        { status: 404 }
      );
    }

    const readmeData = await readmeRes.json();
    const readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8');

    // Call Groq API
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'Groq API key is not configured.' },
        { status: 500 }
      );
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a technical assistant. Summarize the provided GitHub README into a clear, concise, and engaging description of the project (maximum 2-3 sentences). Focus on what the project does and its main value.'
          },
          {
            role: 'user',
            content: `Here is the README content:\n\n${readmeContent.substring(0, 4000)}` // Limit content length
          }
        ],
        temperature: 0.5,
        max_tokens: 150
      })
    });

    if (!groqRes.ok) {
      const errorData = await groqRes.text();
      console.error('Groq API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate description from AI.' },
        { status: 500 }
      );
    }

    const groqData = await groqRes.json();
    const description = groqData.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ description });

  } catch (error: any) {
    console.error('AI Description Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
