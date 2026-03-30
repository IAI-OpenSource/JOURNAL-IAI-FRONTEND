import { useState, useMemo, useRef } from "react";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import GlassIcons from "@/components/ReactsLibsComponents/GlassIcons";
import { CiHeart } from "react-icons/ci";
import { FiMessageCircle } from "react-icons/fi";
import { IoIosSend } from "react-icons/io";
import { Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";


//les donnees d'un post
export interface PostData {
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

export default function OnePost({ post, avatarUrl, allowImageUpload = false }: { post: PostData; avatarUrl?: string | null; allowImageUpload?: boolean }) {
  // pour gere les likes , l'eclatement du like  
  const [likes, setLikes] = useState(post?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [uploadedBanner, setUploadedBanner] = useState<string | null>(post?.image || null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
//memo des couleurs
  const userColor = useMemo(() => {
    const colors = ['blue', 'purple', 'red', 'indigo', 'orange', 'green', 'violet'];
    const hash = post?.auteur?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  }, [post?.auteur]);

  //icone avatar de l'utilisateur
  const AuteurAvatar = [
    {
      icon: avatarUrl ? (
        <img
          src={avatarUrl}
          alt={post?.auteur}
          className="w-full h-full object-cover rounded-[0.4em]"
        />
      ) : (
        <span className="text-[10px] font-bold text-white">{post?.auteur?.[0]?.toUpperCase()}</span>
      ),
      color: avatarUrl ? 'transparent' : userColor,
      label: post?.auteur || "User"
    }
  ];

  if (!post) return null;

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedBanner(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLikes = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 800);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Card className="relative border-border shadow-sm overflow-hidden rounded-lg bg-card mb-4">
      <AnimatePresence>
        {showBurst && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1.2, 1], opacity: [0, 1, 1, 0] }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <FaHeart className="text-red-500 text-8xl drop-shadow-xl" />
          </motion.div>
        )}
      </AnimatePresence>

     
      <CardHeader className="flex flex-row items-start gap-3 p-4 text-left">
        <div className="flex-shrink-0 pt-1">
          <GlassIcons items={AuteurAvatar} isMini={true} />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm">{post.auteur}</span>
            <Badge className="text-[10px] bg-yellow-600 text-white border-none">{post.role}</Badge>
            <Badge variant="outline" className="text-[10px] text-green-600 border-green-600">
              {post.nameClubs}
            </Badge>
          </div>
          <p className="text-[11px] text-neutral-text-muted">
            {post.description} • {post.datePublication}
          </p>
        </div>
      </CardHeader>

  
      <CardContent className="px-4 pb-4 pt-0 text-left">
        <p className="text-sm leading-relaxed mb-4">{post.contenu}</p>
        {uploadedBanner && (
          <div
            className="rounded-md overflow-hidden border border-border mt-2 cursor-pointer"
            onDoubleClick={handleLikes}
          >
            <img src={uploadedBanner} alt="content" className="w-full object-cover max-h-[400px]" />
          </div>
        )}
      </CardContent>

    
      <CardFooter className="flex justify-between items-center p-2 px-4 border-t bg-muted/30">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLikes}
            className={`flex items-center gap-1.5 transition-colors ${isLiked ? "text-red-500" : "text-neutral-text-muted"
              }`}
          >
            {isLiked ? (
              <FaHeart className="w-5 h-5 animate-in zoom-in" />
            ) : (
              <CiHeart className="w-5 h-5" />
            )}
            <span className="text-xs font-bold text-neutral-text">{likes}</span>
          </button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 p-0 flex items-center gap-1.5 text-neutral-text-muted hover:bg-transparent hover:text-info"
              >
                <FiMessageCircle className="w-4 h-4" />
                <span className="text-xs font-bold text-neutral-text">{post.comments}</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-5xl p-0 overflow-hidden border-none bg-card rounded-xl">
              <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">

                {/* partie gauche */}
                <div className="md:w-3/5 bg-black flex items-center justify-center overflow-hidden relative group/banner">
                  {uploadedBanner ? (
                    <img src={uploadedBanner} alt="image post" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-white/50 text-sm italic text-center px-4">
                      Aucun média sur ce post de {post.auteur}
                    </div>
                  )} 
                  {allowImageUpload && (
                    <div
                      className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover/banner:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => bannerInputRef.current?.click()}
                    >
                      <div className="flex items-center gap-1.5 bg-black/60 text-white text-[11px] font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                        <Camera className="w-3.5 h-3.5" />
                        <span>{uploadedBanner ? "Changer la photo" : "Ajouter une photo"}</span>
                      </div>
                    </div>
                  )}

                 
                  {allowImageUpload && (
                    <input
                      type="file"
                      ref={bannerInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleBannerUpload}
                    />
                  )}
                </div>

                {/* partie droite */}
                <div className="md:w-2/5 flex flex-col border-l border-border bg-card">
                  
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <GlassIcons items={AuteurAvatar} isMini={true} />
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold">{post.auteur}</span>
                        <span className="text-[10px] text-neutral-text-muted">{post.role}</span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-text mt-4 leading-relaxed text-left">
                      {post.contenu}
                    </p>
                  </div>

                 
                  <div className="flex-1 p-4 overflow-y-auto border-b border-border bg-muted/5">
                    <div className="space-y-4 mt-2 text-center">
                      <p className="text-[11px] text-neutral-text-muted italic">
                        Les commentaires  
                      </p>
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
                      <FaShareAlt className="w-5 h-5 text-neutral-text-muted cursor-pointer hover:text-primary transition-colors" />
                    </div>
                    <p className="text-xs font-bold text-left">{likes} J'aime</p>

                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Ajouter un commentaire..."
                        className="flex-1 text-xs p-2 bg-muted/50 rounded-md outline-none border border-transparent focus:border-primary/30"
                      />
                      <button className="p-2 bg-primary/10 rounded-md text-primary hover:bg-primary hover:text-white transition-all">
                        <IoIosSend size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <FaShareAlt className="w-4 h-4 text-neutral-text-muted cursor-pointer hover:text-primary transition-colors" />
      </CardFooter>
    </Card>
  );
}