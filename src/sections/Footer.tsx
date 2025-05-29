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
      <div className="absolute h-[400px] w-[1600px] bottom-0 left-1/2 -translate-x-1/2 bg-emerald-300/30 [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] -z-10"></div>
      <div className="container">
        <div className="border-t border-white/15 py-6 text-sm flex flex-col md:flex-row md:justify-between items-center gap-8">
          <div className="text-white/40">
            &copy; {currentYear}. All rights reserved.
          </div>
          <nav className="flex flex-col md:flex-row items-center gap-8 z-20">
            {links.map((lk) => (
              <a
                href={lk.link}
                key={lk.name}
                className="inline-flex items-center gap-1.5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="font-semibold">{lk.name}</span>
                <ArrowUpRight className="size-4" />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
