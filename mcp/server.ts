import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListResourcesRequestSchema, 
  ListToolsRequestSchema, 
  ReadResourceRequestSchema, 
  ErrorCode, 
  McpError 
} from '@modelcontextprotocol/sdk/types.js';

// Import database utilities
import { getAllBlogs, getBlogBySlug, addBlog, updateBlog, deleteBlog, Blog } from '../src/lib/blogUtils';
import { getAllProjects, getProjectById, addProject, updateProject, deleteProject, Project } from '../src/lib/projectUtils';
import { getAllContributions, getContributionById, addContribution, updateContribution, deleteContribution, Contribution } from '../src/lib/contributionUtils';
import db from '../src/lib/sqlite';

export const createServer = (user?: any) => {
  console.log('createServer called with user:', user);
  const server = new Server({
    name: 'portfolio-mcp-server',
    version: '1.0.0',
  }, {
    capabilities: {
      resources: {},
      tools: {}
    }
  });

  // Resources implementation
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const blogs = await getAllBlogs();
  const projects = await getAllProjects();
  const contributions = await getAllContributions();

  const resources: any[] = [];

  for (const blog of blogs) {
    resources.push({
      uri: `blog:///${blog.slug}`,
      name: `Blog: ${blog.title}`,
      description: `Read blog post: ${blog.title}`
    });
  }

  for (const project of projects) {
    resources.push({
      uri: `project:///${project.id}`,
      name: `Project: ${project.title}`,
      description: `View project: ${project.title}`
    });
  }

  for (const contribution of contributions) {
    resources.push({
      uri: `contribution:///${contribution.id}`,
      name: `Contribution: ${contribution.title}`,
      description: `View contribution: ${contribution.title}`
    });
  }

  return { resources };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  
  if (uri.startsWith('blog:///')) {
    const slug = uri.replace('blog:///', '');
    const blog = await getBlogBySlug(slug);
    if (!blog) throw new McpError(ErrorCode.InvalidRequest, `Blog not found: ${slug}`);
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(blog, null, 2)
      }]
    };
  }
  
  if (uri.startsWith('project:///')) {
    const id = parseInt(uri.replace('project:///', ''), 10);
    const project = await getProjectById(id);
    if (!project) throw new McpError(ErrorCode.InvalidRequest, `Project not found: ${id}`);
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(project, null, 2)
      }]
    };
  }

  if (uri.startsWith('contribution:///')) {
    const id = parseInt(uri.replace('contribution:///', ''), 10);
    const contribution = await getContributionById(id);
    if (!contribution) throw new McpError(ErrorCode.InvalidRequest, `Contribution not found: ${id}`);
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(contribution, null, 2)
      }]
    };
  }

  throw new McpError(ErrorCode.MethodNotFound, `Unsupported resource URI: ${uri}`);
});

// Tools implementation
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools: any[] = [
    {
      name: 'get_my_profile',
      description: 'Get current user profile',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'update_my_profile',
      description: 'Update current user profile',
      inputSchema: {
        type: 'object',
        properties: {
          fullName: { type: 'string' },
          phone: { type: 'string' }
        }
      }
    }
  ];

  if (user?.role === 'admin') {
    tools.push(
      {
        name: 'list_blogs',
        description: 'List all blog posts',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'add_blog',
        description: 'Create a new blog post',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            slug: { type: 'string' },
            content: { type: 'string' },
            excerpt: { type: 'string' },
            author: { type: 'string' },
            published: { type: 'boolean' }
          },
          required: ['title', 'slug', 'content']
        }
      },
      {
        name: 'update_blog',
        description: 'Update an existing blog post',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'ID of the blog to update' },
            title: { type: 'string' },
            slug: { type: 'string' },
            content: { type: 'string' },
            excerpt: { type: 'string' },
            author: { type: 'string' },
            published: { type: 'boolean' }
          },
          required: ['id']
        }
      },
      {
        name: 'delete_blog',
        description: 'Delete a blog post',
        inputSchema: {
          type: 'object',
          properties: { id: { type: 'number' } },
          required: ['id']
        }
      },
      {
        name: 'list_projects',
        description: 'List all projects',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'add_project',
        description: 'Create a new project',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            company: { type: 'string' },
            year: { type: 'string' },
            description: { type: 'string' },
            results: { type: 'string', description: 'JSON array of objects with title property' },
            link: { type: 'string' },
            is_published: { type: 'boolean' }
          },
          required: ['title', 'company', 'year', 'description']
        }
      },
      {
        name: 'update_project',
        description: 'Update an existing project',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            company: { type: 'string' },
            year: { type: 'string' },
            description: { type: 'string' },
            results: { type: 'string' },
            link: { type: 'string' },
            is_published: { type: 'boolean' }
          },
          required: ['id']
        }
      },
      {
        name: 'delete_project',
        description: 'Delete a project',
        inputSchema: {
          type: 'object',
          properties: { id: { type: 'number' } },
          required: ['id']
        }
      },
      {
        name: 'list_contributions',
        description: 'List all contributions',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'add_contribution',
        description: 'Create a new contribution',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            techStack: { type: 'string', description: 'JSON array of tech stack' },
            stars: { type: 'number' },
            forks: { type: 'number' },
            link: { type: 'string' },
            color: { type: 'string' },
            is_active: { type: 'boolean' },
            sort_order: { type: 'number' }
          },
          required: ['title', 'description', 'link', 'color']
        }
      },
      {
        name: 'update_contribution',
        description: 'Update a contribution',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            description: { type: 'string' },
            techStack: { type: 'string' },
            stars: { type: 'number' },
            forks: { type: 'number' },
            link: { type: 'string' },
            color: { type: 'string' },
            is_active: { type: 'boolean' },
            sort_order: { type: 'number' }
          },
          required: ['id']
        }
      },
      {
        name: 'delete_contribution',
        description: 'Delete a contribution',
        inputSchema: {
          type: 'object',
          properties: { id: { type: 'number' } },
          required: ['id']
        }
      }
    );
  }

  return { tools };
});

// Call Tool implementation
server.setRequestHandler(CallToolRequestSchema, async (request): Promise<any> => {
  const { name, arguments: args } = request.params;

  try {
    // Non-admin tools
    if (name === 'get_my_profile') {
      if (!user?.email) throw new McpError(ErrorCode.InvalidRequest, 'User not authenticated');
      const [rows]: any = await db.execute('SELECT id, fullName, email, phone FROM users WHERE email = ?', [user.email]);
      if (rows.length === 0) throw new McpError(ErrorCode.InvalidRequest, 'User profile not found');
      return { content: [{ type: 'text', text: JSON.stringify(rows[0], null, 2) }] };
    }

    if (name === 'update_my_profile') {
      if (!user?.email) throw new McpError(ErrorCode.InvalidRequest, 'User not authenticated');
      const { fullName, phone } = args as any;
      
      const updates = [];
      const values = [];
      if (fullName !== undefined) { updates.push('fullName = ?'); values.push(fullName); }
      if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
      
      if (updates.length > 0) {
        values.push(user.email);
        await db.execute(`UPDATE users SET ${updates.join(', ')} WHERE email = ?`, values);
      }
      
      const [rows]: any = await db.execute('SELECT id, fullName, email, phone FROM users WHERE email = ?', [user.email]);
      return { content: [{ type: 'text', text: JSON.stringify(rows[0], null, 2) }] };
    }

    // Admin tools check
    const adminTools = [
      'list_blogs', 'add_blog', 'update_blog', 'delete_blog',
      'list_projects', 'add_project', 'update_project', 'delete_project',
      'list_contributions', 'add_contribution', 'update_contribution', 'delete_contribution'
    ];

    if (adminTools.includes(name) && user?.role !== 'admin') {
      throw new McpError(ErrorCode.InvalidRequest, `Access denied: Admin role required for ${name}`);
    }

    switch (name) {
      // Blogs
      case 'list_blogs': {
        const blogs = await getAllBlogs();
        return { content: [{ type: 'text', text: JSON.stringify(blogs, null, 2) }] };
      }
      case 'add_blog': {
        const blogData = args as { title: string, slug: string, content: string, excerpt?: string, author?: string, published?: boolean };
        const newBlog = await addBlog({
          title: blogData.title,
          slug: blogData.slug,
          content: blogData.content,
          excerpt: blogData.excerpt || '',
          author: blogData.author || 'Admin',
          is_published: blogData.published || false,
          date: new Date().toISOString(),
          read_time: '5 min',
          category: 'Uncategorized',
          tags: '[]',
          image: '',
          meta_description: '',
          meta_keywords: '',
          is_featured: false
        });
        return { content: [{ type: 'text', text: JSON.stringify(newBlog, null, 2) }] };
      }
      case 'update_blog': {
        const { id, ...updates } = args as any;
        const updatedBlog = await updateBlog(id, updates);
        return { content: [{ type: 'text', text: JSON.stringify(updatedBlog, null, 2) }] };
      }
      case 'delete_blog': {
        const { id } = args as { id: number };
        const success = await deleteBlog(id);
        return { content: [{ type: 'text', text: `Deleted blog ${id}: ${success}` }] };
      }

      // Projects
      case 'list_projects': {
        const projects = await getAllProjects();
        return { content: [{ type: 'text', text: JSON.stringify(projects, null, 2) }] };
      }
      case 'add_project': {
        const projectData = args as { title: string, company: string, year: string, description: string, results?: string, link?: string, is_published?: boolean };
        const newProject = await addProject({
          title: projectData.title,
          company: projectData.company,
          year: projectData.year,
          description: projectData.description,
          results: projectData.results || '[]',
          link: projectData.link || '',
          is_published: projectData.is_published ?? true,
          download_files: "[]",
          color: "#ffffff",
          sort_order: 0,
          is_featured: false,
          link_text: "Visit Site",
          image_url: ""
        });
        return { content: [{ type: 'text', text: JSON.stringify(newProject, null, 2) }] };
      }
      case 'update_project': {
        const { id, ...updates } = args as any;
        const updatedProject = await updateProject(id, updates);
        return { content: [{ type: 'text', text: JSON.stringify(updatedProject, null, 2) }] };
      }
      case 'delete_project': {
        const { id } = args as { id: number };
        const success = await deleteProject(id);
        return { content: [{ type: 'text', text: `Deleted project ${id}: ${success}` }] };
      }

      // Contributions
      case 'list_contributions': {
        const contributions = await getAllContributions();
        return { content: [{ type: 'text', text: JSON.stringify(contributions, null, 2) }] };
      }
      case 'add_contribution': {
        const contribData = args as { title: string, description: string, techStack?: string, stars?: number, forks?: number, link: string, color: string, is_active?: boolean, sort_order?: number };
        const newContrib = await addContribution({
          title: contribData.title,
          description: contribData.description,
          techStack: contribData.techStack || '[]',
          stars: contribData.stars || 0,
          forks: contribData.forks || 0,
          link: contribData.link,
          color: contribData.color,
          is_active: contribData.is_active ?? true,
          sort_order: contribData.sort_order || 0
        });
        return { content: [{ type: 'text', text: JSON.stringify(newContrib, null, 2) }] };
      }
      case 'update_contribution': {
        const { id, ...updates } = args as any;
        const updatedContrib = await updateContribution(id, updates);
        return { content: [{ type: 'text', text: JSON.stringify(updatedContrib, null, 2) }] };
      }
      case 'delete_contribution': {
        const { id } = args as { id: number };
        const success = await deleteContribution(id);
        return { content: [{ type: 'text', text: `Deleted contribution ${id}: ${success}` }] };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

  return server;
};

// Run the server ONLY if executed directly, not imported
const run = async () => {
  let user = undefined;

  if (process.env.MCP_API_KEY) {
    try {
      const result = await db.execute({
        sql: 'SELECT * FROM users WHERE api_key = ?',
        args: [process.env.MCP_API_KEY]
      });
      const rows = Array.isArray(result) ? result[0] : (result as any).rows;

      if (rows && rows.length > 0) {
        user = rows[0];
      } else {
        // Try admin_settings
        try {
          const adminResult = await db.execute({
            sql: "SELECT value FROM admin_settings WHERE key = 'api_key'",
            args: []
          });
          const adminRows = Array.isArray(adminResult) ? adminResult[0] : (adminResult as any).rows;
          if (adminRows && adminRows.length > 0 && adminRows[0].value === process.env.MCP_API_KEY) {
            user = { id: 0, email: process.env.ADMIN_EMAIL ?? 'admin', role: 'admin', api_key: process.env.MCP_API_KEY };
          }
        } catch (e) {
          // ignore
        }

        if (!user) {
          console.error("Invalid MCP_API_KEY.");
          process.exit(1);
        }
      }
    } catch (e) {
      console.error("Error validating MCP_API_KEY:", e);
      process.exit(1);
    }
  }

  const transport = new StdioServerTransport();
  const server = createServer(user);
  await server.connect(transport);
  console.error("Portfolio MCP Server running on stdio");
};

// Simple check to run only when invoked from CLI
if (process.argv[1] && (process.argv[1].endsWith("server.ts") || process.argv[1].endsWith("mcp.js"))) {
  run().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
  });
}

