import { useState } from "react";
import { Play, X } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    type: "image",
    title: "Nuntă de Vis",
    category: "Nunți",
  },
  {
    id: 2,
    type: "image",
    title: "Club Night",
    category: "Club Shows",
  },
  {
    id: 3,
    type: "image",
    title: "Corporate Gala",
    category: "Corporate",
  },
  {
    id: 4,
    type: "image",
    title: "Majorat Epic",
    category: "Majorate",
  },
  {
    id: 5,
    type: "image",
    title: "Festival Stage",
    category: "Festivaluri",
  },
  {
    id: 6,
    type: "image",
    title: "Private Party",
    category: "Petreceri Private",
  },
];

const categories = ["Toate", "Nunți", "Club Shows", "Corporate", "Majorate", "Festivaluri", "Petreceri Private"];

const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState("Toate");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const filteredItems = activeCategory === "Toate" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="font-display text-sm tracking-widest text-neon-magenta uppercase">
            Portofoliu
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            <span className="text-foreground">Galerie</span>{" "}
            <span className="gradient-text">Evenimente</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fiecare eveniment spune o poveste. Descoperă momentele memorabile pe care le-am creat împreună cu clienții noștri.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full font-display text-sm tracking-wider transition-all duration-300 ${
                activeCategory === category
                  ? "bg-neon-cyan text-background shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedItem(item.id)}
            >
              {/* Placeholder Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 via-neon-purple/20 to-neon-magenta/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl opacity-30">🎵</div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="font-display text-xs tracking-widest text-neon-cyan uppercase mb-2">
                  {item.category}
                </span>
                <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-neon-cyan transition-colors duration-300">
                  {item.title}
                </h3>
              </div>

              {/* Play Button for Videos */}
              {item.type === "video" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-neon-cyan/20 backdrop-blur-sm border border-neon-cyan/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 text-neon-cyan ml-1" />
                </div>
              )}

              {/* Hover Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-neon-cyan/50 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-neon-magenta/30 text-neon-magenta font-display text-sm tracking-wider hover:bg-neon-magenta/10 hover:border-neon-magenta/50 transition-all duration-300">
            Vezi Mai Multe
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl"
          onClick={() => setSelectedItem(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-neon-cyan/20 transition-colors"
            onClick={() => setSelectedItem(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full mx-4 aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-neon-cyan/20 via-neon-purple/20 to-neon-magenta/20 flex items-center justify-center">
            <div className="text-8xl opacity-30">🎵</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
