import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { AvatarFallback, Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { FaShareAlt } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FiMessageCircle } from "react-icons/fi";
import { useState } from "react";
// Utilise l'import shadcn si tu l'as installé
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface PageData {
  id: string;
  auteur: string;
  role: string;
  description: string;
  datePublication: string;
  contenu: string;
  likes: number;
  comments: number;
  image?: null | string;
}

const DoPosts: PageData[] = [
  {
    id: "1",
    auteur: "freeze",
    role: "chef de clubs",
    description: "L2 génie logiciel.",
    datePublication: "il y a 4 jours",
    contenu: "J'arrive lourd comme trois planètes",
    likes: 667,
    comments: 669,
    image: null,
  },
  {
    id: "2",
    auteur: "freeze",
    role: "chef de clubs",
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
    description: "L3 génie logiciel.",
    datePublication: "il y a 3 min",
    contenu: "J'arrive lourd comme trois planètes",
    likes: 1000,
    comments: 60,
    image: "https://i.pinimg.com/736x/99/3e/5f/993e5fef5b7fdd0913c58775099bb3f1.jpg",
  },
];

function LikePosts({ post }: { post: PageData }) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikes = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Card className="border-border shadow-sm overflow-hidden rounded-lg bg-card">
      <CardHeader className="flex flex-row items-start gap-3 p-4">
        <Avatar className="h-10 w-10 rounded-full overflow-hidden border border-border flex-shrink-0">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.auteur}`} alt={post.auteur} />
          <AvatarFallback className="bg-muted flex h-full w-full items-center justify-center text-xs font-bold text-neutral-text-muted">
            {post.auteur[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-neutral-text tracking-tight">{post.auteur}</span>
            <span className="bg-[#9333ea] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">{post.role}</span>
          </div>
          <p className="text-[11px] text-neutral-text-muted">{post.description} • {post.datePublication}</p>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <p className="text-sm text-neutral-text leading-relaxed mb-4">{post.contenu}</p>
        {post.image && (
          <div className="rounded-md overflow-hidden border border-border mt-2">
            <img src={post.image} alt="post content" className="w-full object-cover max-h-[450px]" />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center p-2 px-4 border-t bg-muted/30">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLikes}
            className={`flex items-center gap-1.5 transition-colors group ${isLiked ? 'text-red-500' : 'text-neutral-text-muted hover:text-danger'}`}
          >
            <CiHeart className={`w-5 h-5 ${isLiked ? 'fill-current stroke-[2px]' : ''}`} />
            <span className="text-xs font-bold text-neutral-text">{likes}</span>
          </button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-8 p-0 flex items-center gap-1.5 text-neutral-text-muted hover:bg-transparent hover:text-info">
                <FiMessageCircle className="w-4 h-4" />
                <span className="text-xs font-bold text-neutral-text">{post.comments}</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-5xl p-0 overflow-hidden border-none bg-card rounded-xl">
              <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
                {/* coté droit image unique  */}
                <div className="md:w-3/5 bg-black flex items-center justify-center overflow-hidden">
                  {post.image ? (
                    <img src={post.image} alt="image post" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-white/50 text-sm italic">Aucun média sur ce post de {post.auteur}</div>
                  )}
                </div>

                {/* coté droit commentaires et description et profil etc */}
                <div className="md:w-2/5 flex flex-col border-l border-border bg-card">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-full overflow-hidden border">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.auteur}`} />
                        <AvatarFallback>{post.auteur[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{post.auteur}</span>
                        <span className="text-[10px] text-neutral-text-muted">{post.role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto border-b border-border">
                    <p className="text-sm text-neutral-text mb-4">
                      <span className="font-bold mr-2">{post.auteur}</span>
                      {post.contenu}
                    </p>
                    <div className="space-y-4 mt-8">
                      <p className="text-[11px] text-neutral-text-muted text-center italic">Les commentaires apparaîtront ici...</p>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-3 mt-auto">
                    <div className="flex items-center gap-4">
                      <CiHeart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                      <FiMessageCircle className="w-5 h-5" />
                      <FaShareAlt className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold">{likes} J'aime</p>
                    <input
                      type="text"
                      placeholder="Ajouter un commentaire..."
                      className="w-full text-xs mt-2 p-2 bg-muted/50 rounded-md outline-none focus:ring-1 focus:ring-primary-light"
                    />
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