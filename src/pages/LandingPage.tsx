import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaShareAlt, FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FiMessageCircle } from "react-icons/fi";
import { useState, useMemo } from "react"; 
import { IoIosSend } from "react-icons/io";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import GlassIcons from "@/components/GlassIcons";
import { motion, AnimatePresence } from "framer-motion"; 

//interface qui sera adapter en fonction de ce que le backend va renvoyer
interface PageData {
  id: string;
  auteur: string;
  role: string;
  nameClubs: string;
  description: string;
  datePublication: string;
  contenu: string;
  likes: number;
  comments: number;
  image?: null | string;
}


//donnes statiques pour tester

const DoPosts: PageData[] = [
  {
    id: "1",
    auteur: "freeze",
    role: "chef de clubs",
    nameClubs: "Programtion It",
    description: "L2 génie logiciel.",
    datePublication: "il y a 4 jours",
    contenu: "J'arrive lourd comme trois planètes",
    likes: 667,
    comments: 669,
    image: null,
  },
  {
    id: "2",
    auteur: "Roy",
    role: "chef de clubs",
    nameClubs: "TCC IAI-TOGO",
    description: "L2 génie logiciel.",
    datePublication: "il y a 667 jours",
    contenu: "J'arrive lourd comme trois planètes",
    likes: 667,
    comments: 669,
    image: "https://tse1.explicit.bing.net/th/id/OIP.bsqemwJ5507OTo2AkRGlUAHaEo?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: "3",
    auteur: "Corleonne",
    role: "moderateur",
    nameClubs: " Clubs Anglais",
    description: "L3 génie logiciel.",
    datePublication: "il y a 3 min",
    contenu: "J'arrive lourd comme trois planètes",
    likes: 1000,
    comments: 60,
    image: "https://i.pinimg.com/736x/99/3e/5f/993e5fef5b7fdd0913c58775099bb3f1.jpg",
  },
  {
    id: "4",
    auteur: "Tezz",
    role: "chef de clubs",
    nameClubs: "Programtion It",
    description: "L2 génie logiciel.",
    datePublication: "il y a 4 jours",
    contenu: "J'arrive lourd comme trois planètes",
    likes: 667,
    comments: 669,
    image: null,
  },
  {
    id: "5",
    auteur: "IAI",
    role: "moderateur",
    nameClubs: " Clubs Anglais",
    description: "L3 génie logiciel.",
    datePublication: "il y a 3 min",
    contenu: "J'arrive lourd comme trois planètes",
    likes: 100,
    comments: 50,
    image: "https://nationalinterest.org/wp-content/uploads/2025/10/iai-uae-booth-103125-SS.jpg",
  },
];

function LikePosts({ post }: { post: PageData }) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  //etat pour l'eclatement 
  const [showBurst, setShowBurst] = useState(false);

  // logique de couleur aléatoire basée sur  le commencement du nom
  const userColor = useMemo(() => {
    const colors = ['blue', 'purple', 'red', 'indigo', 'orange', 'green', 'violet'];
    const hash = post.auteur.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }, [post.auteur]);

  const AuteurAvatar = [
    {
      icon: <span className="text-[10px] font-bold text-white">{post.auteur[0].toUpperCase()}</span>,
      color: userColor, 
      label: post.auteur
    }
  ];
  //logique de like et de dislikes

  const handleLikes = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
      setShowBurst(true); 
      setTimeout(() => setShowBurst(false), 800); 
    }
    setIsLiked(!isLiked);
  };

  return (
    <Card className="relative border-border shadow-sm overflow-hidden rounded-lg bg-card">
      {/* animation du gros coeur central */}
      <AnimatePresence>
        {showBurst && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1.2, 1], opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, times: [0, 0.4, 0.6, 1] }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <FaHeart className="text-red-500 text-8xl drop-shadow-xl" />
          </motion.div>
        )}
      </AnimatePresence>

      <CardHeader className="flex flex-row items-start gap-3 p-4">
        <div className="flex-shrink-0 pt-1">
          <GlassIcons items={AuteurAvatar} isMini={true} />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-neutral-text tracking-tight">{post.auteur}</span>
            <span className="bg-[#9333ea] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">{post.role}</span>
            <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">{post.nameClubs}</span>
          </div>
          <p className="text-[11px] text-neutral-text-muted">{post.description} • {post.datePublication}</p>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <p className="text-sm text-neutral-text leading-relaxed mb-4">{post.contenu}</p>
        {post.image && (
          <div 
            className="rounded-md overflow-hidden border border-border mt-2 cursor-pointer"
            onDoubleClick={handleLikes} 
          >
            <img src={post.image} alt="post content" className="w-full object-cover max-h-[450px]" />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center p-2 px-4 border-t bg-muted/30">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleLikes}
            className={`flex items-center gap-1.5 transition-colors group ${isLiked ? 'text-red-500' : 'text-neutral-text-muted hover:text-danger'}`}
          >
            {isLiked ? (
              <FaHeart className="w-5 h-5 animate-in zoom-in duration-200" />
            ) : (
              <CiHeart className={`w-5 h-5 ${isLiked ? 'fill-current stroke-[2px]' : ''}`} />
            )}
            <span className="text-xs font-bold text-neutral-text">{likes}</span>
          </motion.button>
          {/*Le dialog pour lorsque on appuie sur commenter ça s'ouvre */}

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-8 p-0 flex items-center gap-1.5 text-neutral-text-muted hover:bg-transparent hover:text-info">
                <FiMessageCircle className="w-4 h-4" />
                <span className="text-xs font-bold text-neutral-text">{post.comments}</span>
              </Button>
            </DialogTrigger>
            {/*Partie gauche image ou non s'il n'ya que les écrits sur le post */}

            <DialogContent className="max-w-5xl p-0 overflow-hidden border-none bg-card rounded-xl">
              <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
                <div className="md:w-3/5 bg-black flex items-center justify-center overflow-hidden">
                  {post.image ? (
                    <img src={post.image} alt="image post" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-white/50 text-sm italic">Aucun média sur ce post de {post.auteur}</div>
                  )}
                </div>
                {/*Parite droite */}

                <div className="md:w-2/5 flex flex-col border-l border-border bg-card">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <GlassIcons items={AuteurAvatar} isMini={true} />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{post.auteur}</span>
                        <span className="text-[10px] text-neutral-text-muted">{post.role}</span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-text mt-4 leading-relaxed">
                      {post.contenu}
                    </p>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto border-b border-border">
                    <div className="space-y-4 mt-8">
                      <p className="text-[11px] text-neutral-text-muted text-center italic">Les commentaires </p>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-3 mt-auto">
                    <div className="flex items-center gap-4">
                      <motion.button whileTap={{ scale: 0.8 }} onClick={handleLikes}>
                        {isLiked ? (
                          <FaHeart className="w-6 h-6 text-red-500" />
                        ) : (
                          <CiHeart className="w-6 h-6 text-neutral-text-muted" />
                        )}
                      </motion.button>
                      <FaShareAlt className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold">{likes} J'aime</p>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Ajouter un commentaire..."
                        className="flex-1 text-xs p-2 bg-muted/50 rounded-md outline-none focus:ring-1 focus:ring-primary-light"
                      />
                      <button className="p-2 bg-muted/50 rounded-md text-primary flex items-center"> 
                        <IoIosSend size={20}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <button className="p-2 text-neutral-text-muted hover:text-neutral-text transition-colors">
          <FaShareAlt className="w-4 h-4" />
        </button>
      </CardFooter>
    </Card>
  );
}

export function LandingPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-3xl mx-auto font-sans">
      {DoPosts.map((post) => (
        <LikePosts key={post.id} post={post} />
      ))}
    </div>
  );
}

export default LandingPage;