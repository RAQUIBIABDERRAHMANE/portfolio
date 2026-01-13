import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const blogs = [
  {
    title: 'Next.js 15: Le Guide Complet du Framework React',
    slug: 'nextjs-15-guide-complet-framework-react',
    excerpt: 'Découvrez toutes les nouveautés de Next.js 15 : App Router amélioré, Server Actions, Turbopack stable, et bien plus encore.',
    content: `# Next.js 15: Le Guide Complet

Next.js 15 apporte des améliorations majeures qui transforment le développement web moderne.

## Nouveautés Principales

### 1. Turbopack Stable

Turbopack est maintenant stable en production :

\`\`\`bash
next dev --turbo
\`\`\`

- **10x plus rapide** que Webpack
- Hot Module Replacement instantané
- Meilleure gestion de la mémoire

### 2. Server Actions Améliorés

\`\`\`typescript
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.insert(posts).values({ title });
  revalidatePath('/posts');
}
\`\`\`

### 3. Partial Prerendering

Combinez rendu statique et dynamique :

\`\`\`tsx
export default async function Page() {
  return (
    <main>
      <StaticHeader />
      <Suspense fallback={<Loading />}>
        <DynamicContent />
      </Suspense>
    </main>
  );
}
\`\`\`

## Performance

- **Time to First Byte** réduit de 40%
- **Largest Contentful Paint** optimisé
- Cache intelligent des requêtes

## Conclusion

Next.js 15 établit un nouveau standard pour les applications React en production.`,
    author: 'Admin',
    date: '2026-01-12',
    read_time: '10 min read',
    category: 'Framework',
    tags: 'Next.js, React, JavaScript, Web Development, SSR',
    image: '/images/nextjs-blog.jpg',
    meta_description: 'Guide complet Next.js 15 avec Turbopack, Server Actions et Partial Prerendering',
    meta_keywords: 'Next.js 15, React, Turbopack, Server Actions',
    is_published: 1,
    is_featured: 1
  },
  {
    title: 'TypeScript 5.5: Types Avancés et Nouvelles Fonctionnalités',
    slug: 'typescript-55-types-avances-nouvelles-fonctionnalites',
    excerpt: 'Maîtrisez les nouvelles fonctionnalités de TypeScript 5.5 : inferred type predicates, const type parameters, et plus.',
    content: `# TypeScript 5.5: Types Avancés

TypeScript 5.5 introduit des fonctionnalités puissantes pour un code plus sûr et expressif.

## Inferred Type Predicates

TypeScript infère automatiquement les type guards :

\`\`\`typescript
function isString(value: unknown) {
  return typeof value === 'string';
}

// TypeScript infère: value is string
const items = [1, 'hello', 2, 'world'];
const strings = items.filter(isString);
// strings: string[]
\`\`\`

## Const Type Parameters

\`\`\`typescript
function createTuple<const T extends readonly unknown[]>(items: T): T {
  return items;
}

const tuple = createTuple(['a', 1, true]);
// Type: readonly ["a", 1, true]
\`\`\`

## Regular Expression Syntax Checking

\`\`\`typescript
// TypeScript détecte les erreurs regex à la compilation
const regex = /hello(world/; // Error: Missing closing parenthesis
\`\`\`

## Isolated Declarations

Accélérez les builds avec des déclarations isolées :

\`\`\`json
{
  "compilerOptions": {
    "isolatedDeclarations": true
  }
}
\`\`\`

## Bonnes Pratiques

1. **Strict mode toujours activé**
2. **Éviter any**, préférer unknown
3. **Utiliser satisfies** pour la validation
4. **Types utilitaires** : Partial, Required, Pick, Omit

## Conclusion

TypeScript 5.5 rend le typage statique encore plus puissant et intuitif.`,
    author: 'Admin',
    date: '2026-01-11',
    read_time: '7 min read',
    category: 'Programming',
    tags: 'TypeScript, JavaScript, Types, Development',
    image: '/images/typescript-blog.jpg',
    meta_description: 'Découvrez les nouvelles fonctionnalités de TypeScript 5.5',
    meta_keywords: 'TypeScript 5.5, Types, JavaScript, Programming',
    is_published: 1,
    is_featured: 0
  },
  {
    title: 'Tailwind CSS 4.0: La Révolution du Styling',
    slug: 'tailwind-css-4-revolution-styling',
    excerpt: 'Explorez Tailwind CSS 4.0 avec son nouveau moteur Oxide, les CSS variables natives, et une performance 10x supérieure.',
    content: `# Tailwind CSS 4.0: La Révolution

Tailwind CSS 4.0 représente une réécriture complète avec des performances exceptionnelles.

## Nouveau Moteur Oxide

Écrit en Rust pour une vitesse maximale :

- **10x plus rapide** que v3
- Builds instantanés
- Hot reload ultra-rapide

## CSS Variables Natives

\`\`\`css
@theme {
  --color-primary: oklch(0.7 0.15 200);
  --spacing-lg: 2rem;
}
\`\`\`

\`\`\`html
<div class="bg-primary p-lg">
  Styling moderne
</div>
\`\`\`

## Container Queries Natifs

\`\`\`html
<div class="@container">
  <div class="@lg:flex @lg:gap-4">
    <!-- Responsive au conteneur -->
  </div>
</div>
\`\`\`

## Nouvelles Utilities

### 3D Transforms

\`\`\`html
<div class="rotate-x-45 perspective-500">
  Effet 3D
</div>
\`\`\`

### Gradients Améliorés

\`\`\`html
<div class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
            bg-gradient-conic from-red-500">
  Dégradés avancés
</div>
\`\`\`

## Migration

\`\`\`bash
npx @tailwindcss/upgrade
\`\`\`

## Conclusion

Tailwind CSS 4.0 redéfinit le utility-first CSS avec puissance et élégance.`,
    author: 'Admin',
    date: '2026-01-10',
    read_time: '6 min read',
    category: 'CSS',
    tags: 'Tailwind CSS, CSS, Styling, Frontend, Design',
    image: '/images/tailwind-blog.jpg',
    meta_description: 'Guide Tailwind CSS 4.0 avec moteur Oxide et nouvelles fonctionnalités',
    meta_keywords: 'Tailwind CSS 4, CSS, Styling, Oxide',
    is_published: 1,
    is_featured: 1
  },
  {
    title: 'Node.js 22: Performance et Nouvelles APIs',
    slug: 'nodejs-22-performance-nouvelles-apis',
    excerpt: 'Découvrez Node.js 22 LTS avec son nouveau moteur V8, le support natif de TypeScript, et les améliorations de performance.',
    content: `# Node.js 22: Performance et Nouvelles APIs

Node.js 22 LTS apporte des améliorations significatives pour le développement backend.

## Support TypeScript Natif

Exécutez TypeScript sans transpilation :

\`\`\`bash
node --experimental-strip-types app.ts
\`\`\`

## Nouveau V8 Engine

- **20% plus rapide** sur les opérations courantes
- Meilleure gestion mémoire
- Garbage collection optimisé

## Permission Model

Contrôlez finement les accès :

\`\`\`bash
node --experimental-permission \\
     --allow-fs-read=/app \\
     --allow-net=api.example.com \\
     app.js
\`\`\`

## WebSocket Client Natif

\`\`\`javascript
const ws = new WebSocket('wss://api.example.com');

ws.addEventListener('message', (event) => {
  console.log(event.data);
});
\`\`\`

## Test Runner Amélioré

\`\`\`javascript
import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Math', () => {
  test('addition', () => {
    assert.strictEqual(1 + 1, 2);
  });
});
\`\`\`

## SQLite Intégré

\`\`\`javascript
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');
db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');
\`\`\`

## Conclusion

Node.js 22 établit de nouvelles normes pour le runtime JavaScript côté serveur.`,
    author: 'Admin',
    date: '2026-01-09',
    read_time: '8 min read',
    category: 'Backend',
    tags: 'Node.js, JavaScript, Backend, Runtime, Server',
    image: '/images/nodejs-blog.jpg',
    meta_description: 'Guide Node.js 22 LTS avec TypeScript natif et nouvelles APIs',
    meta_keywords: 'Node.js 22, JavaScript, Backend, TypeScript',
    is_published: 1,
    is_featured: 0
  },
  {
    title: 'PostgreSQL vs MongoDB: Quel Choix en 2026?',
    slug: 'postgresql-vs-mongodb-quel-choix-2026',
    excerpt: 'Comparaison approfondie entre PostgreSQL et MongoDB pour vous aider à choisir la base de données adaptée à votre projet.',
    content: `# PostgreSQL vs MongoDB en 2026

Le choix de la base de données est crucial pour la réussite de votre projet.

## PostgreSQL: La Puissance Relationnelle

### Avantages

- **ACID garantis** : Transactions fiables
- **SQL standard** : Requêtes complexes
- **Extensions** : PostGIS, TimescaleDB
- **JSON support** : jsonb performant

\`\`\`sql
SELECT users.name, 
       json_agg(orders.*) as orders
FROM users
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.id;
\`\`\`

## MongoDB: La Flexibilité NoSQL

### Avantages

- **Schema flexible** : Évolution facile
- **Horizontal scaling** : Sharding natif
- **Documents riches** : Données imbriquées
- **Atlas** : Cloud-native

\`\`\`javascript
db.users.aggregate([
  { $lookup: {
      from: 'orders',
      localField: '_id',
      foreignField: 'userId',
      as: 'orders'
  }}
]);
\`\`\`

## Quand choisir PostgreSQL?

1. Relations complexes entre données
2. Transactions ACID critiques
3. Requêtes analytiques complexes
4. Données géospatiales

## Quand choisir MongoDB?

1. Schéma évolutif fréquemment
2. Documents avec structures variées
3. Scaling horizontal nécessaire
4. Prototypage rapide

## Performances 2026

| Critère | PostgreSQL | MongoDB |
|---------|------------|---------|
| Lectures | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Écritures | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Joins | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Scaling | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## Conclusion

Pas de gagnant absolu : choisissez selon vos besoins spécifiques.`,
    author: 'Admin',
    date: '2026-01-08',
    read_time: '9 min read',
    category: 'Database',
    tags: 'PostgreSQL, MongoDB, Database, SQL, NoSQL',
    image: '/images/database-blog.jpg',
    meta_description: 'Comparaison PostgreSQL vs MongoDB en 2026',
    meta_keywords: 'PostgreSQL, MongoDB, Database, SQL, NoSQL',
    is_published: 1,
    is_featured: 0
  },
  {
    title: 'Docker et Kubernetes: Guide DevOps Moderne',
    slug: 'docker-kubernetes-guide-devops-moderne',
    excerpt: 'Maîtrisez la containerisation avec Docker et l orchestration avec Kubernetes pour des déploiements robustes.',
    content: `# Docker et Kubernetes: Guide DevOps

La containerisation est devenue essentielle pour les applications modernes.

## Docker: Les Fondamentaux

### Dockerfile Optimisé

\`\`\`dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

### Multi-stage Builds

- Images plus légères
- Sécurité améliorée
- Build cache optimisé

## Kubernetes: Orchestration

### Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    spec:
      containers:
      - name: web
        image: myapp:latest
        ports:
        - containerPort: 3000
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
\`\`\`

### Auto-scaling

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageUtilization: 70
\`\`\`

## Bonnes Pratiques

1. **Images minimales** : Alpine ou Distroless
2. **Health checks** : Liveness et Readiness probes
3. **Secrets management** : Vault ou Sealed Secrets
4. **GitOps** : ArgoCD ou Flux

## Conclusion

Docker + Kubernetes = Infrastructure scalable et résiliente.`,
    author: 'Admin',
    date: '2026-01-07',
    read_time: '11 min read',
    category: 'DevOps',
    tags: 'Docker, Kubernetes, DevOps, Containers, Cloud',
    image: '/images/devops-blog.jpg',
    meta_description: 'Guide complet Docker et Kubernetes pour DevOps',
    meta_keywords: 'Docker, Kubernetes, DevOps, Containers',
    is_published: 1,
    is_featured: 1
  },
  {
    title: 'Sécurité Web en 2026: Protégez Vos Applications',
    slug: 'securite-web-2026-protegez-applications',
    excerpt: 'Guide complet sur la sécurité web moderne: OWASP Top 10, authentification, chiffrement, et bonnes pratiques.',
    content: `# Sécurité Web en 2026

La sécurité n'est plus optionnelle. Voici comment protéger vos applications.

## OWASP Top 10 - 2026

### 1. Injection

\`\`\`typescript
// ❌ Vulnérable
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// ✅ Sécurisé - Prepared statements
const result = await db.execute({
  sql: 'SELECT * FROM users WHERE id = ?',
  args: [userId]
});
\`\`\`

### 2. Broken Authentication

\`\`\`typescript
// Utilisez des librairies éprouvées
import { hash, verify } from '@node-rs/argon2';

const hashedPassword = await hash(password, {
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4
});
\`\`\`

## Headers de Sécurité

\`\`\`typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }
];
\`\`\`

## JWT Best Practices

\`\`\`typescript
import { SignJWT, jwtVerify } from 'jose';

const token = await new SignJWT({ userId })
  .setProtectedHeader({ alg: 'ES256' })
  .setExpirationTime('1h')
  .setIssuedAt()
  .sign(privateKey);
\`\`\`

## Rate Limiting

\`\`\`typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

const { success } = await ratelimit.limit(ip);
\`\`\`

## Checklist Sécurité

- [ ] HTTPS obligatoire
- [ ] CSP configuré
- [ ] Rate limiting actif
- [ ] Input validation
- [ ] Audit régulier des dépendances

## Conclusion

La sécurité est un processus continu, pas une destination.`,
    author: 'Admin',
    date: '2026-01-06',
    read_time: '12 min read',
    category: 'Security',
    tags: 'Security, Web Security, OWASP, Authentication, Encryption',
    image: '/images/security-blog.jpg',
    meta_description: 'Guide sécurité web 2026 avec OWASP et bonnes pratiques',
    meta_keywords: 'Security, Web Security, OWASP, Authentication',
    is_published: 1,
    is_featured: 0
  },
  {
    title: 'Intelligence Artificielle pour Développeurs',
    slug: 'intelligence-artificielle-pour-developpeurs',
    excerpt: 'Intégrez l IA dans vos applications: APIs OpenAI, modèles locaux, RAG, et assistants de code intelligents.',
    content: `# Intelligence Artificielle pour Développeurs

L'IA transforme le développement logiciel. Voici comment l'intégrer.

## APIs OpenAI

### Chat Completions

\`\`\`typescript
import OpenAI from 'openai';

const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'system', content: 'Tu es un assistant de code.' },
    { role: 'user', content: 'Explique les closures en JavaScript' }
  ],
  temperature: 0.7
});
\`\`\`

### Embeddings pour RAG

\`\`\`typescript
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-large',
  input: 'Comment fonctionne React?'
});

// Recherche vectorielle
const similar = await vectorDB.search(embedding.data[0].embedding);
\`\`\`

## Modèles Locaux avec Ollama

\`\`\`typescript
import { Ollama } from 'ollama';

const ollama = new Ollama();

const response = await ollama.chat({
  model: 'llama3.2',
  messages: [
    { role: 'user', content: 'Génère une fonction de tri' }
  ]
});
\`\`\`

## RAG (Retrieval Augmented Generation)

\`\`\`typescript
// 1. Indexer les documents
const chunks = splitDocument(document);
const embeddings = await embed(chunks);
await vectorStore.upsert(embeddings);

// 2. Rechercher et générer
const context = await vectorStore.search(query);
const answer = await llm.generate(query, context);
\`\`\`

## Assistants de Code

- **GitHub Copilot** : Autocomplétion intelligente
- **Cursor** : IDE avec IA intégrée
- **Continue** : Open source, multi-modèle

## Bonnes Pratiques

1. **Prompt engineering** : Soyez précis
2. **Caching** : Réduisez les coûts
3. **Fallbacks** : Gérez les erreurs
4. **Monitoring** : Suivez l'usage

## Conclusion

L'IA est un outil puissant qui amplifie les capacités des développeurs.`,
    author: 'Admin',
    date: '2026-01-05',
    read_time: '10 min read',
    category: 'AI',
    tags: 'AI, Machine Learning, OpenAI, LLM, Development',
    image: '/images/ai-blog.jpg',
    meta_description: 'Guide IA pour développeurs avec OpenAI et modèles locaux',
    meta_keywords: 'AI, Machine Learning, OpenAI, LLM, RAG',
    is_published: 1,
    is_featured: 1
  }
];

async function seedBlogs() {
  try {
    // Ensure table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        date TEXT,
        read_time TEXT DEFAULT '5 min read',
        category TEXT NOT NULL,
        tags TEXT,
        image TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        is_published INTEGER DEFAULT 0,
        is_featured INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add missing columns
    const columnsToAdd = [
      { name: 'date', type: 'TEXT' },
      { name: 'read_time', type: 'TEXT DEFAULT "5 min read"' },
      { name: 'category', type: 'TEXT' },
      { name: 'tags', type: 'TEXT' },
      { name: 'image', type: 'TEXT' },
      { name: 'meta_description', type: 'TEXT' },
      { name: 'meta_keywords', type: 'TEXT' },
      { name: 'is_published', type: 'INTEGER DEFAULT 0' },
      { name: 'is_featured', type: 'INTEGER DEFAULT 0' },
      { name: 'view_count', type: 'INTEGER DEFAULT 0' },
    ];

    for (const col of columnsToAdd) {
      try {
        await db.execute(`ALTER TABLE blogs ADD COLUMN ${col.name} ${col.type}`);
        console.log(`✓ Added column: ${col.name}`);
      } catch (e) {
        // Column exists
      }
    }

    // Insert blogs
    for (const blog of blogs) {
      try {
        await db.execute({
          sql: `INSERT INTO blogs (title, slug, excerpt, content, author, date, read_time, category, tags, image, meta_description, meta_keywords, is_published, is_featured, view_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            blog.title,
            blog.slug,
            blog.excerpt,
            blog.content,
            blog.author,
            blog.date,
            blog.read_time,
            blog.category,
            blog.tags,
            blog.image,
            blog.meta_description,
            blog.meta_keywords,
            blog.is_published,
            blog.is_featured,
            0
          ]
        });
        console.log(`✅ Added: ${blog.title}`);
      } catch (e) {
        if (e.message.includes('UNIQUE constraint')) {
          console.log(`⏭️  Skipped (exists): ${blog.title}`);
        } else {
          console.error(`❌ Error adding ${blog.title}:`, e.message);
        }
      }
    }

    console.log('\n🎉 Blog seeding complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

seedBlogs();
