import { NextResponse } from 'next/server';
import { validateMcpKey } from '@/lib/mcpKeysUtils';
import { getAllBlogs, getBlogBySlug, addBlog } from '@/lib/blogUtils';
import { getAllProjects, getProjectById } from '@/lib/projectUtils';
import { getAllContributions, getContributionById } from '@/lib/contributionUtils';

/**
 * Ce endpoint sert de passerelle pour la librairie NPX.
 * Il valide la clé API fournie par l'utilisateur et exécute l'action demandée.
 */
export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('X-MCP-API-KEY');
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API Key' }, { status: 401 });
    }

    const auth = await validateMcpKey(apiKey);
    if (!auth.isValid) {
      return NextResponse.json({ error: 'Invalid or inactive API Key' }, { status: 403 });
    }

    const body = await req.json();
    const { action, name, arguments: args, uri } = body;
    const permissions = auth.permissions || [];
    const isAdmin = permissions.includes('admin');

    // Helper pour verifier les permissions
    const hasPermission = (scope: string) => isAdmin || permissions.includes(scope);

    switch (action) {
      case 'tools':
        return NextResponse.json({
          tools: [
            { name: 'list_blogs', description: 'List all blog posts', inputSchema: { type: 'object' } },
            { name: 'add_blog', description: 'Create a new blog post', inputSchema: { type: 'object', required: ['title', 'slug', 'content'] } },
            // Ajoutez d'autres outils ici...
          ]
        });

      case 'resources':
        if (!hasPermission('read_only')) throw new Error('Permission denied');
        const blogs = await getAllBlogs();
        const projects = await getAllProjects();
        const resources = [
          ...blogs.map(b => ({ uri: `blog:///${b.slug}`, name: `Blog: ${b.title}` })),
          ...projects.map(p => ({ uri: `project:///${p.id}`, name: `Project: ${p.title}` }))
        ];
        return NextResponse.json({ resources });

      case 'call-tool':
        if (name === 'list_blogs') {
          if (!hasPermission('read_only')) throw new Error('Permission denied');
          const data = await getAllBlogs();
          return NextResponse.json({ result: data });
        }
        if (name === 'add_blog') {
          if (!hasPermission('write_blogs')) throw new Error('Permission denied');
          const newBlog = await addBlog(args);
          return NextResponse.json({ result: newBlog });
        }
        return NextResponse.json({ error: 'Unknown tool' }, { status: 404 });

      case 'read-resource':
        if (!hasPermission('read_only')) throw new Error('Permission denied');
        if (uri.startsWith('blog:///')) {
           const slug = uri.replace('blog:///', '');
           const content = await getBlogBySlug(slug);
           return NextResponse.json({ content });
        }
        return NextResponse.json({ error: 'Resource not found' }, { status: 404 });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Bridge API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Support simple GET for resource listing
export async function GET(req: Request) {
    return NextResponse.json({ status: 'MCP Bridge Active' });
}
