import {Calendar, MapPin, Users, CheckCircle2} from 'lucide-react'

interface EventCardProps {
    title: string;
    organizer: string;
    description: string;
    date: string;
    location: string;
    participants: number;
    image: string;
    isFollowed?: boolean;
}

export function EventCard({
    title, organizer, description, date, location, participants, image, isFollowed
}: EventCardProps) {
    return (<div className="bg-white rounded-xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image de l'événement */}
      <div className="relative aspect-video w-full">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="p-5 space-y-4">
        {/* En-tête : Titre + Badge */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="font-bold text-lg text-zinc-900 leading-tight">{title}</h4>
            <p className="text-sm text-zinc-500">Par {organizer}</p>
          </div>
          <button className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            isFollowed 
            ? "bg-zinc-900 text-white" 
            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}>
            {isFollowed && <CheckCircle2 size={12} />}
            {isFollowed ? "Suivi" : "Suivre"}
          </button>
        </div>

        {/* Description courte */}
        <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Infos pratiques (Icônes) */}
        <div className="pt-2 space-y-2 border-t border-zinc-50">
          <div className="flex items-center gap-2 text-zinc-500 text-xs">
            <Calendar size={14} /> <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs">
            <MapPin size={14} /> <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs">
            <Users size={14} /> <span>{participants} personnes intéressées</span>
          </div>
        </div>
      </div>
    </div>);
}