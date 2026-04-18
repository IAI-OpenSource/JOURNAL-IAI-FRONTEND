import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, Plus, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Admin } from "../../services/Admin";
import { registrationService } from "../../services/Registration";
import type { ClasseResponse } from "../../types/adminTypes";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!value) {
      setCount(0);
      return;
    }
    let start = 0;
    const duration = 1000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
}

export function ClasseListe() {
  const [classes, setClasses] = useState<ClasseResponse[]>([]);
  const [academicYears, setAcademicYears] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [newClasse, setNewClasse] = useState({
    classe_prefix: "TC1",
    classe_suffix: "",
  });

  const navigate = useNavigate();

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const [classResponse, yearResponse, usersResponse, registrationsResponse] = await Promise.all([
        Admin.getAllClasses(),
        Admin.getAllAcademicYears(),
        Admin.getAllUsers(),
        registrationService.getAll()
      ]);
      
      if (yearResponse && yearResponse.ok) {
        const yearsMap: Record<string, string> = {};
        const yearsList = yearResponse.result.years || yearResponse.result;
        if (Array.isArray(yearsList)) {
          yearsList.forEach((y: any) => {
            yearsMap[y.id] = y.libelle;
          });
        }
        setAcademicYears(yearsMap);
      }

      if (classResponse.ok && usersResponse.ok && registrationsResponse.ok) {
        const fetchedClasses = classResponse.result.classes;
        const allUsers = usersResponse.result;
        const allRegistrations = registrationsResponse.result;

        const classesWithRealEffectif = fetchedClasses.map(classe => {
          const registeredCount = allUsers.filter(u => u.classe?.id === classe.id).length;
          const unusedJetonsCount = allRegistrations.filter(r => r.classe?.id === classe.id && !r.used_at).length;
          
          return {
            ...classe,
            effectif: registeredCount + unusedJetonsCount
          };
        });

        setClasses(classesWithRealEffectif);
      } else if (classResponse.ok) {
        setClasses(classResponse.result.classes);
      }

    } catch (error) {
      console.error("Erreur fetch :", error);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateClasse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newClasse.classe_suffix.length !== 1) {
      toast.error("Le suffixe doit être une seule lettre (A, B, C...)");
      return;
    }

    setCreating(true);
    try {
      const response = await Admin.createClasse(newClasse);
      
      if (response.ok) {
        toast.success("Classe créée avec succès !");
        setIsModalOpen(false);
        setNewClasse({ classe_prefix: "TC1", classe_suffix: "" });
        fetchClasses(); 
      } else {
        toast.error(response.error || "Erreur lors de la création");
      }
    } catch (error: any) {
      console.error("ERREUR CRÉATION CLASSE :", error);
      const backendErrorMessage = error.response?.data?.error || error.response?.data?.detail;
      if (backendErrorMessage) {
        toast.error(backendErrorMessage);
      } else {
        toast.error("Erreur lors de la création");
      }
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      const res = await Admin.deleteClasse(id);
      if (res.ok) {
        toast.success("Classe supprimée avec succès");
        fetchClasses();
      } else {
        toast.error(res.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error("Impossible de supprimer la classe");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestion des Classes</h2>
          <p className="text-muted-foreground text-sm">IAI - Administration des promotions</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-5 shadow-lg transition-all flex items-center gap-2">
              <Plus className="h-5 w-5" /> Nouvelle Classe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Créer une Classe</DialogTitle>
              <DialogDescription>
                Ajoutez une promotion à la base de données (Année active requise).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateClasse} className="space-y-6 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="prefix">Niveau / Spécialité</Label>
                <select 
                  id="prefix"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                  value={newClasse.classe_prefix}
                  onChange={(e) => setNewClasse({...newClasse, classe_prefix: e.target.value})}
                >
                  <option value="TC1">TC1</option>
                  <option value="TC2">TC2</option>
                  <option value="GLSI_3">GLSI 3</option>
                  <option value="ASR_3">ASR 3</option>
                  <option value="MTWI_3">MTWI 3</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="suffix">Suffixe (Une lettre max)</Label>
                <Input 
                  id="suffix"
                  placeholder="Ex: A" 
                  maxLength={1}
                  required 
                  className="h-11 uppercase"
                  value={newClasse.classe_suffix}
                  onChange={(e) => setNewClasse({...newClasse, classe_suffix: e.target.value.toUpperCase()})}
                />
              </div>
              <Button type="submit" className="w-full h-11 bg-yellow-500 hover:bg-yellow-600 text-black font-bold" disabled={creating}>
                {creating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" /> En cours...
                  </div>
                ) : "Confirmer la création"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.length === 0 ? (
            <div className="col-span-full bg-white p-10 text-center border-2 border-dashed rounded-xl">
              <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-500 font-medium">Aucune classe enregistrée pour le moment.</p>
            </div>
          ) : (
            classes.map((c) => (
              <Card 
                key={c.id} 
                className="group cursor-pointer border-2 border-black transition-all overflow-hidden rounded-none relative"
                onClick={() => navigate(`/admin/classes/${c.id}`)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black transition-colors">
                      {c.classe_prefix} {c.classe_suffix}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <CardDescription className="bg-yellow-400 text-black px-2 py-0.5 rounded-none text-[10px] font-bold inline-block">
                        <AnimatedCounter value={c.effectif} /> élèves
                      </CardDescription>
                      <CardDescription className="text-[11px] font-bold text-green-600">
                        {academicYears[c.academic_year_id] || "Année inconnue"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer la classe <span className="font-bold">{c.classe_prefix} {c.classe_suffix}</span> ? Cette action est irréversible et supprimera toutes les données associées.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => confirmDelete(c.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <div className="p-2 bg-gray-50 rounded-lg transition-all">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}