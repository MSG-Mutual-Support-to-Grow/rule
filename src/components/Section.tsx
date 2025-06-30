type SectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

const Section = ({ id, title, children }: SectionProps) => {
  return (
    <section id={id}>
    <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">{title}</h2>
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-md">{children}</div>
    </section>
  );
};

export default Section;
