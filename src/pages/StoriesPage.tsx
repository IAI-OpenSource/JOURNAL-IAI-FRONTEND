import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { storyService } from "@/services/storyService";
import type {
  StoryGroupRead,
  StoryRead,
  StoryGroupListResult,
  CreateStoryUploadIntentPayload,
} from "@/types/story";
import { cn } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight, ImagePlus, Video, Plus } from "lucide-react";

const STORY_DURATION_MS = 6000;
const VIEWS_FLUSH_MS = 3000;

function getInitials(author: StoryGroupRead["author"]): string {
  if (!author) return "?";
  return `${author.first_name[0] ?? ""}${author.last_name[0] ?? ""}`.toUpperCase();
}

function getDisplayName(group: StoryGroupRead): string {
  if (group.group_type === "CLUB_GROUP") return group.club_info?.name ?? "Club";
  if (group.group_type === "CLASSE_GROUP") {
    const c = group.target_classe_info;
    if (!c) return "Classe";
    return c.classe_suffix ? `${c.classe_prefix}-${c.classe_suffix}` : c.classe_prefix;
  }
  return group.author?.username ?? "Utilisateur";
}

function getAvatarUrl(group: StoryGroupRead): string | undefined {
  if (group.group_type === "CLUB_GROUP") return group.club_info?.logo_url ?? undefined;
  return group.author?.avatar_url ?? undefined;
}

function hasAllViewed(group: StoryGroupRead): boolean {
  return group.viewed_index_in_group.length >= group.stories_count;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "À l'instant";
  if (h < 24) return `Il y a ${h}h`;
  return `Il y a ${Math.floor(h / 24)}j`;
}

function formatBytes(b: number): string {
  if (b >= 1_048_576) return `${(b / 1_048_576).toFixed(1)} Mo`;
  return `${(b / 1024).toFixed(0)} Ko`;
}


function StoryBubbleSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0 w-[76px]">
      <Skeleton className="w-[64px] h-[64px] rounded-full" />
      <Skeleton className="w-10 h-2 rounded-full" />
    </div>
  );
}


interface BubbleProps {
  group: StoryGroupRead;
  isOwn?: boolean;
  onOpen: () => void;
  onAddStory?: () => void;
}

function StoryBubble({ group, isOwn, onOpen, onAddStory }: BubbleProps) {
  const allViewed = hasAllViewed(group);
  const label = isOwn ? "Ma story" : getDisplayName(group);

  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[76px]">
      <div className="relative">
        <button
          onClick={onOpen}
          className={cn(
            "w-[64px] h-[64px] rounded-full transition-all duration-200 hover:scale-[1.06] active:scale-95 focus:outline-none",
            !allViewed
              ? "p-[2.5px] bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]"
              : "p-[2px] ring-[1.5px] ring-neutral-200 dark:ring-neutral-700"
          )}
          aria-label={`Ouvrir les stories de ${label}`}
        >
          <div className="w-full h-full rounded-full bg-white dark:bg-neutral-950 p-[2px]">
            <Avatar className="w-full h-full">
              <AvatarImage src={getAvatarUrl(group)} alt={label} className="object-cover rounded-full" />
              <AvatarFallback className="text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full">
                {getInitials(group.author)}
              </AvatarFallback>
            </Avatar>
          </div>
        </button>

        {isOwn && onAddStory && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddStory(); }}
            className="absolute -bottom-0.5 -right-0.5 w-[20px] h-[20px] rounded-full bg-blue-500 hover:bg-blue-600 active:scale-90 border-[2px] border-white dark:border-neutral-950 flex items-center justify-center text-white shadow-md transition-all duration-150"
            aria-label="Ajouter une story"
          >
            <Plus className="w-3 h-3 stroke-[3]" />
          </button>
        )}
      </div>

      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 leading-tight w-full truncate text-center">
        {isOwn ? "Votre story" : label}
      </span>
    </div>
  );
}

function AddStoryBubble({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[76px]">
      <button
        onClick={onClick}
        className="w-[64px] h-[64px] rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:scale-[1.06] active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Ajouter une story"
      >
        <Plus className="w-6 h-6 stroke-2" />
      </button>
      <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 text-center w-full">
        Ajouter
      </span>
    </div>
  );
}

//Progress bars

function ProgressBars({ count, current, progress }: { count: number; current: number; progress: number }) {
  return (
    <div className="flex gap-[3px] w-full px-3 pt-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden bg-white/30">
          <div
            className="h-full bg-white rounded-full"
            style={{
              width: i < current ? "100%" : i === current ? `${progress}%` : "0%",
              transition: i === current ? "width 60ms linear" : "none",
            }}
          />
        </div>
      ))}
    </div>
  );
}


function StoryPlayer({
  story,
  group,
  onNext,
  onPrev,
  onClose,
  onProgress,
}: {
  story: StoryRead;
  group: StoryGroupRead;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onProgress?: (pct: number) => void;
}) {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const startRef = useRef(0);

  const isVideo = story.media_type === "VIDEO";
  const mediaSrc = isVideo ? story.hls_master_url : (story.image_high_url ?? story.image_medium_url);

  const goNext = useCallback(() => { elapsedRef.current = 0; onNext(); }, [onNext]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startRef.current = Date.now() - elapsedRef.current;
    const duration = story?.media_type === "VIDEO" && story.duration_seconds
      ? story.duration_seconds * 1000 : STORY_DURATION_MS;
    intervalRef.current = setInterval(() => {
      const pct = Math.min(((Date.now() - startRef.current) / duration) * 100, 100);
      setProgress(pct);
      onProgress?.(pct);
      if (pct >= 100) { elapsedRef.current = 0; goNext(); }
    }, 50);
  }, [story, goNext]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    elapsedRef.current = Date.now() - startRef.current;
  }, []);

  useEffect(() => {
    if (mediaReady && !paused) startTimer();
    else stopTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [mediaReady, paused, startTimer, stopTimer]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
    elapsedRef.current = 0;
    if (x < e.currentTarget.offsetWidth * 0.35) onPrev();
    else onNext();
  };

  return (
    <div
      className="absolute inset-0 cursor-pointer select-none"
      onClick={handleTap}
      onMouseDown={() => { setPaused(true); stopTimer(); }}
      onMouseUp={() => setPaused(false)}
      onTouchStart={() => { setPaused(true); stopTimer(); }}
      onTouchEnd={() => setPaused(false)}
    >
      {!isVideo ? (
        <img
          src={mediaSrc ?? undefined}
          alt="story"
          onLoad={() => setMediaReady(true)}
          onError={() => setMediaReady(true)}
          className={cn("w-full h-full object-cover transition-opacity duration-300", mediaReady ? "opacity-100" : "opacity-0")}
        />
      ) : (
        <video
          src={mediaSrc ?? undefined}
          autoPlay muted playsInline
          onCanPlay={() => setMediaReady(true)}
          onEnded={goNext}
          className="w-full h-full object-cover"
        />
      )}
      {!mediaReady && (
        <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}

//Story Viewer 

interface ViewerProps {
  groups: StoryGroupRead[];
  initialGroupIndex: number;
  onClose: () => void;
  onViewStory: (storyId: string) => void;
}

function StoryViewer({ groups, initialGroupIndex, onClose, onViewStory }: ViewerProps) {
  const [groupIdx, setGroupIdx] = useState(initialGroupIndex);
  const [storyIdx, setStoryIdx] = useState(0);
  const [playerProgress, setPlayerProgress] = useState(0);

  const group = groups[groupIdx];
  const story = group?.stories[storyIdx];

  useEffect(() => { if (story) onViewStory(story.id); }, [story?.id]);

  const goNext = useCallback(() => {
    setPlayerProgress(0);
    if (group && storyIdx < group.stories.length - 1) setStoryIdx((i) => i + 1);
    else if (groupIdx < groups.length - 1) { setGroupIdx((i) => i + 1); setStoryIdx(0); }
    else onClose();
  }, [group, storyIdx, groupIdx, groups.length, onClose]);

  const goPrev = useCallback(() => {
    setPlayerProgress(0);
    if (storyIdx > 0) setStoryIdx((i) => i - 1);
    else if (groupIdx > 0) { setGroupIdx((i) => i - 1); setStoryIdx(0); }
  }, [storyIdx, groupIdx]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose, goNext, goPrev]);

  if (!group || !story) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      style={{ backdropFilter: "blur(20px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {groupIdx > 0 && (
        <button
          onClick={() => { setGroupIdx((i) => i - 1); setStoryIdx(0); }}
          className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 group"
          aria-label="Groupe précédent"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20 group-hover:ring-white/60 transition-all">
            <Avatar className="w-full h-full">
              <AvatarImage src={getAvatarUrl(groups[groupIdx - 1])} className="object-cover" />
              <AvatarFallback className="text-xs bg-neutral-800 text-neutral-300">{getInitials(groups[groupIdx - 1].author)}</AvatarFallback>
            </Avatar>
          </div>
          <ChevronLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
        </button>
      )}

      <div
        className="relative bg-black overflow-hidden shadow-2xl"
        style={{
          width: "min(390px, 100vw)",
          height: "min(844px, 100svh)",
          borderRadius: "clamp(0px, calc((100vw - 390px) * 99), 24px)",
        }}
      >
        <StoryPlayer key={story.id} story={story} group={group} onNext={goNext} onPrev={goPrev} onClose={onClose} onProgress={setPlayerProgress} />

        <div className="relative z-10 pointer-events-none">
          <ProgressBars count={group.stories.length} current={storyIdx} progress={playerProgress} />
          <div className="flex items-center justify-between px-4 pt-3 pb-2 pointer-events-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-[1.5px] ring-white/50 shadow">
                <Avatar className="w-full h-full">
                  <AvatarImage src={getAvatarUrl(group)} />
                  <AvatarFallback className="text-xs bg-neutral-700 text-white">{getInitials(group.author)}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-white text-[13px] font-semibold leading-tight" style={{ textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>
                  {getDisplayName(group)}
                </p>
                <p className="text-white/50 text-[11px] mt-0.5">{timeAgo(story.created_at)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
              aria-label="Fermer"
            >
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {story.legend && (
          <div className="absolute bottom-8 left-0 right-0 z-10 px-5 pointer-events-none">
            <p className="text-white text-[13px] text-center leading-relaxed"
              style={{
                textShadow: "0 1px 8px rgba(0,0,0,.8)",
                background: "linear-gradient(to top, rgba(0,0,0,.45), transparent)",
                borderRadius: 12,
                padding: "8px 14px",
              }}>
              {story.legend}
            </p>
          </div>
        )}
      </div>

      {groupIdx < groups.length - 1 && (
        <button
          onClick={() => { setGroupIdx((i) => i + 1); setStoryIdx(0); }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 group"
          aria-label="Groupe suivant"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20 group-hover:ring-white/60 transition-all">
            <Avatar className="w-full h-full">
              <AvatarImage src={getAvatarUrl(groups[groupIdx + 1])} className="object-cover" />
              <AvatarFallback className="text-xs bg-neutral-800 text-neutral-300">{getInitials(groups[groupIdx + 1].author)}</AvatarFallback>
            </Avatar>
          </div>
          <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
        </button>
      )}
    </div>
  );
}

//j'i fais du instagram style hein 
type UploadStep =
  | { type: "idle" }
  | { type: "selected"; file: File; preview: string }
  | { type: "uploading"; progress: number }
  | { type: "processing"; jobId: string; message: string }
  | { type: "done" }
  | { type: "error"; message: string };

function UploadSheet({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<UploadStep>({ type: "idle" });
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const canClose = step.type !== "uploading" && step.type !== "processing";

  const handleClose = () => {
    if (!canClose) return;
    setVisible(false);
    wsRef.current?.close();
    setTimeout(onClose, 320);
  };

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) {
      setStep({ type: "error", message: "Seules les images et vidéos sont acceptées." });
      return;
    }
    if (f.size > 100 * 1024 * 1024) {
      setStep({ type: "error", message: "Le fichier dépasse 100 Mo." });
      return;
    }
    setStep({ type: "selected", file: f, preview: URL.createObjectURL(f) });
  };

  const handlePublish = async () => {
    if (step.type !== "selected") return;
    const { file } = step;
    const payload: CreateStoryUploadIntentPayload = {
      file: {
        file_name: file.name,
        file_size: file.size,
        media_type: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
      },
    };
    try {
      setStep({ type: "uploading", progress: 0 });
      const intent = await storyService.uploadIntent(payload);
      await storyService.uploadFileDirect(intent.file.upload_url, file, (pct) =>
        setStep({ type: "uploading", progress: pct })
      );
      const complete = await storyService.completeUpload(intent.intent_id);
      setStep({ type: "processing", jobId: complete.job_id, message: "Traitement en cours…" });

      const ws = storyService.connectProcessingWS(complete.job_id);
      wsRef.current = ws;
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          const isDone = data?.status === "done" || data?.status === "completed" || data?.progress === 100;
          if (isDone) { ws.close(); setStep({ type: "done" }); setTimeout(onSuccess, 800); }
          else setStep({ type: "processing", jobId: complete.job_id, message: data?.message ?? data?.step ?? "Traitement en cours…" });
        } catch { /* non-JSON */ }
      };
      ws.onerror = () => { setStep({ type: "done" }); setTimeout(onSuccess, 800); };
      ws.onclose = () => { setStep((s) => s.type === "processing" ? { type: "done" } : s); setTimeout(onSuccess, 800); };
    } catch (e: unknown) {
      setStep({ type: "error", message: e instanceof Error ? e.message : "Une erreur est survenue." });
    }
  };

  const isVideo = step.type === "selected" && step.file.type.startsWith("video/");
  const isImage = step.type === "selected" && step.file.type.startsWith("image/");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,.55)", opacity: visible ? 1 : 0 }}
        onClick={canClose ? handleClose : undefined}
      />

      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-white dark:bg-neutral-900 rounded-t-[28px] shadow-2xl transition-transform duration-[320ms] ease-out overflow-hidden"
        style={{
          transform: visible ? "translateY(0)" : "translateY(100%)",
          maxHeight: "92svh",
        }}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-[4px] rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <button
            onClick={handleClose}
            className={cn(
              "text-[15px] font-medium transition-colors",
              canClose ? "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200" : "text-neutral-300 dark:text-neutral-700"
            )}
          >
            Annuler
          </button>
          <h2 className="text-[16px] font-semibold text-neutral-900 dark:text-white tracking-tight">
            Nouvelle story
          </h2>
          <button
            onClick={handlePublish}
            disabled={step.type !== "selected"}
            className={cn(
              "text-[15px] font-semibold transition-colors",
              step.type === "selected"
                ? "text-blue-500 hover:text-blue-600"
                : "text-neutral-300 dark:text-neutral-700"
            )}
          >
            Publier
          </button>
        </div>

        <div className="h-px bg-neutral-100 dark:bg-neutral-800 flex-shrink-0" />

        <div className="flex-1 overflow-y-auto">

          {step.type === "idle" && (
            <div className="px-5 py-5 space-y-3">
              <p className="text-[13px] text-neutral-400 dark:text-neutral-500 text-center mb-4">
                Choisissez un média à partager
              </p>

              <div className="grid grid-cols-2 gap-3">
                {/* Photo tile */}
                <button
                  onClick={() => { if (inputRef.current) { inputRef.current.accept = "image/*"; inputRef.current.click(); } }}
                  className="aspect-square rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex flex-col items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <ImagePlus className="w-7 h-7 text-white stroke-[1.5]" />
                  </div>
                  <span className="text-white text-[15px] font-semibold">Photo</span>
                </button>

              
                <button
                  onClick={() => { if (inputRef.current) { inputRef.current.accept = "video/*"; inputRef.current.click(); } }}
                  className="aspect-square rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex flex-col items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Video className="w-7 h-7 text-white stroke-[1.5]" />
                  </div>
                  <span className="text-white text-[15px] font-semibold">Vidéo</span>
                </button>
              </div>

              
              <div
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => inputRef.current?.click()}
                className="mt-2 border border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl py-5 flex items-center justify-center gap-2 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
              >
                <span className="text-[13px] text-neutral-400 dark:text-neutral-500">
                  ou glisse un fichier ici
                </span>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          )}

          
          {step.type === "selected" && (
            <div className="relative">
            
              <div
                className="relative w-full bg-black overflow-hidden"
                style={{ aspectRatio: "9/16", maxHeight: "65svh" }}
              >
                {isVideo && (
                  <video src={step.preview} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                )}
                {isImage && (
                  <img src={step.preview} alt="preview" className="w-full h-full object-cover" />
                )}
            
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                  {isVideo
                    ? <Video className="w-3 h-3 text-white" />
                    : <ImagePlus className="w-3 h-3 text-white" />
                  }
                  <span className="text-white text-[11px] font-medium">{formatBytes(step.file.size)}</span>
                </div>
               
                <button
                  onClick={() => setStep({ type: "idle" })}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/70 active:scale-90 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              
              <div className="px-5 py-4 flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-800">
                  {isImage && <img src={step.preview} className="w-full h-full object-cover" />}
                  {isVideo && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-neutral-400" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200 truncate">{step.file.name}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{formatBytes(step.file.size)}</p>
                </div>
                <button
                  onClick={() => setStep({ type: "idle" })}
                  className="ml-auto text-[13px] text-red-500 font-medium hover:text-red-600 flex-shrink-0"
                >
                  Retirer
                </button>
              </div>
            </div>
          )}

          
          {step.type === "uploading" && (
            <div className="px-5 py-10 flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="w-full space-y-2.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-neutral-500 dark:text-neutral-400">Publication…</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{step.progress}%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-150"
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

         
          {step.type === "processing" && (
            <div className="px-5 py-10 flex flex-col items-center gap-4">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-[3px] border-neutral-100 dark:border-neutral-800" />
                <div
                  className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-500 animate-spin"
                  style={{ animationDuration: "800ms" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
              </div>
              <p className="text-[14px] text-neutral-500 dark:text-neutral-400 text-center">{step.message}</p>
            </div>
          )}

          
          {step.type === "done" && (
            <div className="px-5 py-10 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #34d399, #10b981)" }}>
                <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-[16px] font-semibold text-neutral-900 dark:text-white">Story publiée !</p>
                <p className="text-[13px] text-neutral-400 dark:text-neutral-500 mt-1">Visible pendant 24 heures</p>
              </div>
            </div>
          )}

          
          {step.type === "error" && (
            <div className="px-5 py-8 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <X className="w-9 h-9 text-red-500" />
              </div>
              <div className="text-center">
                <p className="text-[14px] text-red-500 font-medium">{step.message}</p>
                <button
                  onClick={() => setStep({ type: "idle" })}
                  className="mt-3 text-[14px] text-blue-500 font-semibold hover:text-blue-600 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          
          <div className="h-6" />
        </div>
      </div>
    </>
  );
}

// stories Rail 

interface RailProps {
  groups: StoryGroupRead[];
  myGroup: StoryGroupRead | null;
  loading: boolean;
  onOpen: (groupIdx: number) => void;
  onAddStory: () => void;
}

function StoriesRail({ groups, myGroup, loading, onOpen, onAddStory }: RailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") =>
    railRef.current?.scrollBy({ left: dir === "right" ? 240 : -240, behavior: "smooth" });

  return (
    <div className="relative w-full">
      <button
        onClick={() => scroll("left")}
        aria-label="Défiler à gauche"
        className="absolute left-0 top-[32px] -translate-x-3 z-10 w-7 h-7 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm flex items-center justify-center text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition hidden sm:flex"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => scroll("right")}
        aria-label="Défiler à droite"
        className="absolute right-0 top-[32px] translate-x-3 z-10 w-7 h-7 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm flex items-center justify-center text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition hidden sm:flex"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div
        ref={railRef}
        className="flex gap-4 overflow-x-auto pb-1 px-0.5 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <StoryBubbleSkeleton key={i} />)
        ) : (
          <>
            {myGroup ? (
              <StoryBubble
                group={myGroup}
                isOwn
                onOpen={() => onOpen(groups.findIndex((g) => g.id === myGroup.id))}
                onAddStory={onAddStory}
              />
            ) : (
              <AddStoryBubble onClick={onAddStory} />
            )}

            {groups
              .filter((g) => g.id !== myGroup?.id)
              .map((group) => (
                <StoryBubble
                  key={group.id}
                  group={group}
                  onOpen={() => onOpen(groups.findIndex((g) => g.id === group.id))}
                />
              ))}
          </>
        )}
      </div>
    </div>
  );
}


export function StoriesSection() {
  const { user } = useAuth();

  const [result, setResult] = useState<StoryGroupListResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerGroupIdx, setViewerGroupIdx] = useState(0);
  const [showUpload, setShowUpload] = useState(false);

  const pendingViews = useRef<Set<string>>(new Set());
  const flushTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const flushViews = useCallback(async () => {
    const ids = [...pendingViews.current];
    if (!ids.length) return;
    pendingViews.current.clear();
    try { await storyService.recordViews({ story_ids: ids }); } catch { /* silent */ }
  }, []);

  useEffect(() => {
    flushTimer.current = setInterval(flushViews, VIEWS_FLUSH_MS);
    return () => { if (flushTimer.current) clearInterval(flushTimer.current); flushViews(); };
  }, [flushViews]);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storyService.getFeed();
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Impossible de charger les stories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFeed(); }, [loadFeed]);

  const myGroup = useMemo(
    () => result?.items.find((g) => g.author_id === user?.id) ?? null,
    [result, user?.id]
  );

  const openViewer = (idx: number) => { setViewerGroupIdx(idx); setViewerOpen(true); };
  const closeViewer = () => { setViewerOpen(false); flushViews(); };

  if (error) {
    return (
      <div className="flex items-center gap-3 py-2 text-sm text-neutral-400">
        <span>{error}</span>
        <button onClick={loadFeed} className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <>
      <StoriesRail
        groups={result?.items ?? []}
        myGroup={myGroup}
        loading={loading}
        onOpen={openViewer}
        onAddStory={() => setShowUpload(true)}
      />

      {viewerOpen && result && (
        <StoryViewer
          groups={result.items}
          initialGroupIndex={viewerGroupIdx}
          onClose={closeViewer}
          onViewStory={(id) => pendingViews.current.add(id)}
        />
      )}

      {showUpload && (
        <UploadSheet
          onClose={() => setShowUpload(false)}
          onSuccess={() => { setShowUpload(false); loadFeed(); }}
        />
      )}
    </>
  );
}

export default function StoriesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-12">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-[15px] font-semibold text-neutral-900 dark:text-white tracking-tight">Stories</h1>
        <span className="text-[11px] text-neutral-400 dark:text-neutral-500">Expirent dans 24h</span>
      </div>
      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl px-4 py-4 shadow-sm">
        <StoriesSection />
      </div>
    </div>
  );
}