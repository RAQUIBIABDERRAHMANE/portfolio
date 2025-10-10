import ArrowUpRight from "@/assets/icons/arrow-up-right.svg";

const links = [
//   { name: "Buy me a Coffee", link: "https://buymeacoffee.com/" },
//   { name: "LinkdeIn", link: "https://www.linkedin.com/in/" },
  { name: "Instagram", link: "https://www.instagram.com/abderrahmaneraquibi1" },
//   { name: "Facebook", link: "https://www.facebook.com/" },
//   { name: "X", link: "https://x.com/" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative overflow-x-clip">
      {/* AI-themed glow effect */}
      <div 
        className="absolute h-[400px] w-[1600px] bottom-0 left-1/2 -translate-x-1/2 -z-10"
        style={{
          background: 'radial-gradient(50% 50% at bottom center, rgba(0, 255, 249, 0.15), transparent)',
          filter: 'blur(40px)',
        }}
      />
      
      {/* Animated grid lines */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
      
      <div className="container relative z-10">
        <div 
          className="py-6 text-sm flex flex-col md:flex-row md:justify-between items-center gap-8"
          style={{
            borderTop: '1px solid rgba(0, 255, 249, 0.3)',
          }}
        >
          <div className="text-gray-400 font-mono">
            <span className="text-neon-cyan">&gt;</span> &copy; {currentYear}. All rights reserved.
          </div>
          <nav className="flex flex-col md:flex-row items-center gap-8 z-20">
            {links.map((lk) => (
              <a
                href={lk.link}
                key={lk.name}
                className="inline-flex items-center gap-1.5 text-neon-cyan hover:text-neon-blue transition-colors duration-300 group"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textShadow: '0 0 10px rgba(0, 255, 249, 0.3)',
                }}
              >
                <span className="font-semibold">{lk.name}</span>
                <ArrowUpRight 
                  className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" 
                  style={{ color: '#00fff9' }}
                />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
