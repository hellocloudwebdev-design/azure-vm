import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { BookmarkIcon, Clock, Newspaper, TrendingUp, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  timeAgo: string;
  location: string;
  image: string;
  gradientColors?: string[];
  content?: string[];
  source: string;
  trending?: boolean;
}

export interface NewsComponentProps {
  title?: string;
  subtitle?: string;
  articles?: NewsArticle[];
  enableAnimations?: boolean;
  showSearch?: boolean;
}

export const defaultArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Breaking: Major Tech Company Announces Revolutionary AI Platform",
    category: "Technology",
    subcategory: "Artificial Intelligence",
    timeAgo: "15 min ago",
    location: "San Francisco",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&h=900&fit=crop&q=80",
    gradientColors: ["from-blue-500/20", "to-purple-500/20"],
    source: "Tech News Daily",
    trending: true,
    content: [
      "In a groundbreaking announcement today, a leading technology company unveiled its latest artificial intelligence platform that promises to revolutionize how businesses interact with machine learning systems.",
      "The new platform integrates advanced natural language processing with real-time data analysis, enabling companies to make faster, more informed decisions based on AI-driven insights.",
      "Industry experts are calling this development a significant leap forward in accessible AI technology, potentially democratizing advanced machine learning capabilities for businesses of all sizes.",
      "The platform will be available in beta testing next month, with full commercial release planned for the end of the year."
    ]
  },
  {
    id: "2",
    title: "Global Markets Rally on Positive Economic Indicators",
    category: "Business",
    subcategory: "Markets",
    timeAgo: "1 hour ago",
    location: "New York",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&h=900&fit=crop&q=80",
    gradientColors: ["from-green-500/20", "to-emerald-500/20"],
    source: "Financial Times",
    trending: true,
    content: [
      "Stock markets around the world experienced significant gains today following the release of encouraging economic data from major economies.",
      "The positive momentum was driven by better-than-expected employment figures and consumer confidence indices, suggesting robust economic recovery.",
      "Analysts predict continued market strength in the coming weeks, though they caution investors to remain vigilant about potential volatility."
    ]
  },
  {
    id: "3",
    title: "Climate Summit Reaches Historic Agreement on Carbon Reduction",
    category: "Environment",
    subcategory: "Climate Change",
    timeAgo: "2 hours ago",
    location: "Geneva",
    image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1600&h=900&fit=crop&q=80",
    gradientColors: ["from-green-500/20", "to-teal-500/20"],
    source: "Global News Network",
    content: [
      "World leaders at the International Climate Summit have reached a landmark agreement committing to aggressive carbon reduction targets over the next decade.",
      "The accord includes binding commitments from 150 nations to reduce greenhouse gas emissions by 50% by 2035, marking the most ambitious climate action plan to date.",
      "Environmental organizations have praised the agreement while emphasizing the critical importance of implementation and enforcement."
    ]
  },
  {
    id: "4",
    title: "Medical Breakthrough: New Treatment Shows Promise for Rare Disease",
    category: "Health",
    subcategory: "Medical Research",
    timeAgo: "3 hours ago",
    location: "Boston",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=900&fit=crop&q=80",
    gradientColors: ["from-red-500/20", "to-pink-500/20"],
    source: "Medical Journal Today",
    content: [
      "Researchers at a leading medical institution have announced a significant breakthrough in treating a rare genetic disorder that affects thousands worldwide.",
      "The new treatment approach combines gene therapy with targeted medication, showing remarkable results in early clinical trials.",
      "Patients in the trial experienced substantial improvement in symptoms, offering hope to families affected by this previously untreatable condition."
    ]
  },
  {
    id: "5",
    title: "Space Agency Announces Plans for Mars Colony by 2040",
    category: "Science",
    subcategory: "Space Exploration",
    timeAgo: "4 hours ago",
    location: "Houston",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1600&h=900&fit=crop&q=80",
    gradientColors: ["from-purple-500/20", "to-indigo-500/20"],
    source: "Space News",
    content: [
      "The national space agency has unveiled ambitious plans to establish a permanent human settlement on Mars within the next two decades.",
      "The multi-phase project will begin with robotic missions to prepare infrastructure, followed by crewed missions to establish the initial colony.",
      "Scientists and engineers are working on revolutionary life support systems and sustainable resource utilization technologies to make the Mars colony viable."
    ]
  },
  {
    id: "6",
    title: "Education Reform: New Initiative Aims to Transform Learning",
    category: "Education",
    subcategory: "Policy",
    timeAgo: "5 hours ago",
    location: "Washington",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&h=900&fit=crop&q=80",
    gradientColors: ["from-yellow-500/20", "to-orange-500/20"],
    source: "Education Weekly",
    content: [
      "A comprehensive education reform initiative has been announced, focusing on personalized learning and technology integration in classrooms.",
      "The program will provide funding for schools to adopt innovative teaching methods and digital learning platforms.",
      "Educators and parents have expressed optimism about the potential impact on student engagement and academic outcomes."
    ]
  }
];

export function NewsComponent({
  title = "Latest News",
  subtitle = "Stay informed with breaking stories from around the world",
  articles = defaultArticles,
  enableAnimations = true,
  showSearch = true
}: NewsComponentProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  const filteredArticles = useMemo(
    () =>
      articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [articles, searchQuery]
  );

  const toggleBookmark = (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(articleId)) {
        next.delete(articleId);
      } else {
        next.add(articleId);
      }
      return next;
    });
  };

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }

    setIsLoaded(true);
    return undefined;
  }, [shouldAnimate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 28
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 28
      }
    }
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto p-6 bg-background text-foreground"
      initial={shouldAnimate ? "hidden" : "visible"}
      animate={isLoaded ? "visible" : "hidden"}
      variants={shouldAnimate ? containerVariants : undefined}
    >
      <motion.div className="mb-8" variants={shouldAnimate ? headerVariants : undefined}>
        <div className="flex items-center gap-3 mb-2">
          <Newspaper className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">{title}</h1>
        </div>
        <p className="text-muted-foreground text-lg mb-6">{subtitle}</p>

        {showSearch && (
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </motion.div>

      <LayoutGroup>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={shouldAnimate ? containerVariants : undefined}
        >
          {filteredArticles.map((article) => {
            if (selectedArticle?.id === article.id) {
              return null;
            }

            return (
              <motion.article
                key={article.id}
                layoutId={`article-${article.id}`}
                className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 cursor-pointer group hover:shadow-lg"
                variants={shouldAnimate ? cardVariants : undefined}
                whileHover={
                  shouldAnimate
                    ? {
                        y: -4,
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 400, damping: 25 }
                      }
                    : undefined
                }
                onClick={() => setSelectedArticle(article)}
              >
                <motion.div
                  layoutId={`article-image-${article.id}`}
                  className="relative h-48 overflow-hidden bg-muted"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  {article.gradientColors && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${article.gradientColors[0]} ${article.gradientColors[1]} to-transparent`}
                    />
                  )}

                  <motion.button
                    type="button"
                    className="absolute top-3 right-3"
                    whileHover={shouldAnimate ? { scale: 1.1 } : undefined}
                    whileTap={shouldAnimate ? { scale: 0.9 } : undefined}
                    onClick={(e) => toggleBookmark(article.id, e)}
                  >
                    <BookmarkIcon
                      className={`w-5 h-5 transition-colors cursor-pointer ${
                        bookmarkedArticles.has(article.id)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white/80 hover:text-white"
                      }`}
                    />
                  </motion.button>

                  {article.trending && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </Badge>
                    </div>
                  )}

                  <motion.div className="absolute bottom-3 left-3 text-white">
                    <div className="text-xs mb-1 opacity-90 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.timeAgo}
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div layoutId={`article-content-${article.id}`} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">{article.location}</span>
                  </div>
                  <motion.h3
                    layoutId={`article-title-${article.id}`}
                    className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors"
                  >
                    {article.title}
                  </motion.h3>
                  <p className="text-sm text-muted-foreground mt-2">{article.source}</p>
                </motion.div>
              </motion.article>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {selectedArticle && (
            <>
              <motion.div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedArticle(null)}
              />

              <motion.div
                layoutId={`article-${selectedArticle.id}`}
                className="fixed inset-4 md:inset-8 lg:inset-16 bg-card border border-border rounded-xl overflow-hidden z-50"
              >
                <motion.button
                  type="button"
                  className="absolute top-4 right-4 w-10 h-10 bg-background/80 hover:bg-background rounded-full flex items-center justify-center z-10 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={shouldAnimate ? { scale: 1.1 } : undefined}
                  whileTap={shouldAnimate ? { scale: 0.9 } : undefined}
                  onClick={() => setSelectedArticle(null)}
                >
                  <X className="w-5 h-5" />
                </motion.button>

                <div className="h-full overflow-y-auto">
                  <motion.div
                    layoutId={`article-image-${selectedArticle.id}`}
                    className="relative h-64 md:h-80"
                  >
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    {selectedArticle.gradientColors && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${selectedArticle.gradientColors[0]} ${selectedArticle.gradientColors[1]} to-transparent`}
                      />
                    )}

                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{selectedArticle.category}</Badge>
                        <Badge variant="outline">{selectedArticle.subcategory}</Badge>
                      </div>
                      <div className="text-sm opacity-90 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedArticle.timeAgo} • {selectedArticle.location}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div layoutId={`article-content-${selectedArticle.id}`} className="p-6 md:p-8">
                    <motion.h1
                      layoutId={`article-title-${selectedArticle.id}`}
                      className="text-2xl md:text-3xl font-bold mb-4"
                    >
                      {selectedArticle.title}
                    </motion.h1>

                    <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                      <span>{selectedArticle.source}</span>
                      <span>•</span>
                      <span>{selectedArticle.timeAgo}</span>
                    </div>

                    <motion.div
                      className="prose prose-lg max-w-none text-muted-foreground"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      {selectedArticle.content ? (
                        selectedArticle.content.map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))
                      ) : (
                        <p className="mb-4">
                          Full article content would appear here. This is a placeholder for the complete
                          story.
                        </p>
                      )}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </motion.div>
  );
}
