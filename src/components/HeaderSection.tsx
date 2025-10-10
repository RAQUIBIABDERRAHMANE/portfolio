export const HeaderSection = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => {
  return (
    <>
      <div className="flex justify-center">
        <p className="uppercase font-semibold tracking-widest text-center font-mono relative inline-block"
          style={{
            background: 'linear-gradient(90deg, #00fff9, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 20px rgba(0, 255, 249, 0.5)',
          }}
        >
          <span className="relative z-10">{eyebrow}</span>
          <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
        </p>
      </div>
      <h2 className="font-serif text-3xl md:text-5xl text-center mt-6 glow-text">
        {title}
      </h2>
      <p className="text-center text-gray-400 mt-4 md:text-lg lg:text-xl max-w-md mx-auto">
        {description}
      </p>
    </>
  );
};
