import OnePost, { type PostData } from "@/components/OnePost";

//donnes statiques pour tester

const DoPosts: PostData[] = [
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

export function LandingPage() {
  return (
    <div className="max-w-3xl mx-auto bg-background min-h-screen border-x border-border font-sans pb-10 flex flex-col gap-6 p-4 md:p-8">
      {DoPosts.map((post) => (
        <OnePost key={post.id} post={post} allowImageUpload={false} />
      ))}
    </div>
  );
}

export default LandingPage;