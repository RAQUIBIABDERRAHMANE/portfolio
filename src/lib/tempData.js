// Temporary blog data for fallback when database is not available
export const tempBlogs = [
  {
    id: 1,
    title: "Building Modern Web Applications with Next.js",
    slug: "building-modern-web-applications-nextjs",
    excerpt: "Discover how to create fast, scalable web applications using Next.js with server-side rendering and modern React features.",
    content: `
# Building Modern Web Applications with Next.js

Next.js has revolutionized the way we build React applications by providing a powerful framework that combines the best of server-side rendering, static site generation, and client-side rendering.

## Why Choose Next.js?

- **Performance**: Built-in optimizations for images, fonts, and scripts
- **SEO-friendly**: Server-side rendering for better search engine visibility
- **Developer Experience**: Hot reloading, TypeScript support, and more
- **Deployment**: Easy deployment with Vercel or any hosting platform

## Key Features

### 1. File-based Routing
Next.js uses a file-based routing system that makes creating pages intuitive and straightforward.

### 2. API Routes
Build your backend API alongside your frontend application.

### 3. Image Optimization
Automatic image optimization for better performance.

## Getting Started

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This creates a new Next.js application with all the necessary configurations and dependencies.

## Conclusion

Next.js provides an excellent foundation for building modern web applications with React. Its combination of performance, developer experience, and deployment simplicity makes it an ideal choice for projects of any size.
    `,
    category: "Web Development",
    author: "Abderrahmane Raquibi",
    read_time: "8 min read",
    tags: "Next.js, React, Web Development, JavaScript",
    is_published: true,
    is_featured: true,
    date: "2024-12-15",
    view_count: 245
  },
  {
    id: 2,
    title: "Mastering Laravel for Backend Development",
    slug: "mastering-laravel-backend-development",
    excerpt: "Learn how to build robust backend applications using Laravel's elegant syntax and powerful features.",
    content: `
# Mastering Laravel for Backend Development

Laravel is one of the most popular PHP frameworks, known for its elegant syntax and powerful features that make backend development a pleasure.

## Why Laravel?

- **Eloquent ORM**: Beautiful database abstraction
- **Artisan CLI**: Powerful command-line interface
- **Blade Templates**: Elegant templating engine
- **Built-in Authentication**: Ready-to-use authentication system

## Core Concepts

### 1. MVC Architecture
Laravel follows the Model-View-Controller pattern for organized code structure.

### 2. Routing
Define your application routes with ease using Laravel's routing system.

### 3. Middleware
Filter HTTP requests entering your application.

## Getting Started

\`\`\`bash
composer create-project laravel/laravel my-project
cd my-project
php artisan serve
\`\`\`

## Best Practices

- Use Eloquent relationships effectively
- Implement proper validation
- Utilize Laravel's caching mechanisms
- Follow PSR standards

Laravel provides everything you need to build modern, maintainable web applications.
    `,
    category: "Backend Development",
    author: "Abderrahmane Raquibi",
    read_time: "10 min read",
    tags: "Laravel, PHP, Backend, API Development",
    is_published: true,
    is_featured: false,
    date: "2024-12-10",
    view_count: 189
  },
  {
    id: 3,
    title: "React Best Practices for 2024",
    slug: "react-best-practices-2024",
    excerpt: "Essential React patterns and practices to write cleaner, more maintainable code in 2024.",
    content: `
# React Best Practices for 2024

As React continues to evolve, staying up-to-date with best practices is crucial for building maintainable applications.

## Modern React Patterns

### 1. Functional Components with Hooks
Use functional components with hooks instead of class components.

### 2. Custom Hooks
Extract reusable logic into custom hooks.

### 3. Context API
Use Context API for state management in smaller applications.

## Performance Optimization

- Use React.memo for component memoization
- Implement lazy loading with React.lazy()
- Optimize re-renders with useCallback and useMemo

## Code Organization

- Group related components together
- Use absolute imports with path mapping
- Implement proper error boundaries

## Testing

- Write unit tests with Jest and React Testing Library
- Test user interactions, not implementation details
- Maintain good test coverage

Following these practices will help you write better React applications that are easier to maintain and scale.
    `,
    category: "Frontend Development",
    author: "Abderrahmane Raquibi",
    read_time: "6 min read",
    tags: "React, JavaScript, Frontend, Best Practices",
    is_published: true,
    is_featured: true,
    date: "2024-12-05",
    view_count: 312
  }
];

// Function to get the next available ID
export function getNextId() {
  if (tempBlogs.length === 0) {
    return 1;
  }
  return Math.max(...tempBlogs.map(blog => blog.id)) + 1;
}

// Function to get blog by slug
export function getBlogBySlug(slug) {
  return tempBlogs.find(blog => blog.slug === slug);
}

// Function to get featured blogs
export function getFeaturedBlogs() {
  return tempBlogs.filter(blog => blog.is_featured && blog.is_published);
}

// Function to get published blogs
export function getPublishedBlogs() {
  return tempBlogs.filter(blog => blog.is_published);
}
