import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10"></div>
      
      <div className="relative z-10 text-center px-4">
        <div className="mb-8">
          <Search className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Post Not Found
          </h1>
          <p className="text-xl text-gray-300 max-w-md mx-auto mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </Link>
          
          <div className="block">
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Return to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
