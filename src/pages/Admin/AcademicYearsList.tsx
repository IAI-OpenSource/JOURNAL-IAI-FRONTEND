import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, AlertCircle, Calendar, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Admin } from "../../services/Admin";
import type { AcademicYearResponse } from "../../types/adminTypes";

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

export function AcademicYearsList() {
  const [years, setYears] = useState<AcademicYearResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [newYear, setNewYear] = useState({
    libelle: "",
    start_date: "",
    end_date: "",
  });

  const fetchYears = async () => {
    setLoading(true);
    try {
      const response = await Admin.getAllAcademicYears();
      if (response && response.ok) {
        setYears(response.result.years || []);
      }
    } catch (error) {
      console.error("Erreur fetch :", error);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newYear.libelle.length < 5) {
      toast.error("Le libellé doit contenir au moins 5 caractères (ex: 2025-2026)");
      return;
    }

    if (!newYear.start_date || !newYear.end_date) {
      toast.error("Veuillez sélectionner les dates de début et de fin");
      return;
    }

    setCreating(true);
    try {
      const formattedData = {
        libelle: newYear.libelle,
        start_date: new Date(newYear.start_date).toISOString(),
        end_date: new Date(newYear.end_date).toISOString(),
      };

      const response = await Admin.createAcademicYear(formattedData);
      
      if (response && response.ok) {
        toast.success("Année académique créée avec succès !");
        setIsModalOpen(false);
        setNewYear({ libelle: "", start_date: "", end_date: "" });
        fetchYears(); 
      } else {
        toast.error(response.error || "Erreur lors de la création");
      }
    } catch (error: any) {
      console.error("ERREUR CRÉATION ANNÉE :", error);
      const backendErrorMessage = error.response?.data?.error || error.response?.data?.detail;
      toast.error(backendErrorMessage || "Erreur lors de la création");
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      const res = await Admin.deleteAcademicYear(id);
      if (res.ok) {
        toast.success("Année académique supprimée avec succès");
        fetchYears();
      } else {
        toast.error(res.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error("Impossible de supprimer l'année académique");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Années Académiques</h2>
          <p className="text-muted-foreground text-sm">JOURNAL-IAI - Gestion des années</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-5 shadow-lg transition-all flex items-center gap-2">
              <Plus className="h-5 w-5" /> Nouvelle Année
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Créer une Année Académique</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle année académique.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateYear} className="space-y-6 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="libelle">Libellé (ex: 2025-2026)</Label>
                <Input 
                  id="libelle"
                  placeholder="2025-2026" 
                  minLength={5}
                  required 
                  className="h-11"
                  value={newYear.libelle}
                  onChange={(e) => setNewYear({...newYear, libelle: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start_date">Date de Début</Label>
                <Input 
                  id="start_date"
                  type="date"
                  required 
                  className="h-11"
                  value={newYear.start_date}
                  onChange={(e) => setNewYear({...newYear, start_date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">Date de Fin</Label>
                <Input 
                  id="end_date"
                  type="date"
                  required 
                  className="h-11"
                  value={newYear.end_date}
                  onChange={(e) => setNewYear({...newYear, end_date: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full h-11 bg-yellow-500 hover:bg-yellow-600 text-black font-bold" disabled={creating}>
                {creating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" /> En cours...
                  </div>
                ) : "Confirmer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-yellow-600 mb-4" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(!years || years.length === 0) ? (
            <div className="col-span-full bg-white p-10 text-center border-2 border-dashed rounded-xl">
              <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-500 font-medium">Aucune année académique enregistrée.</p>
            </div>
          ) : (
            years.map((y) => (
              <Card 
                key={y.id} 
                className={`group transition-all overflow-hidden border-2 rounded-none relative ${y.active ? 'border-green-500 bg-green-50/30' : 'border-black'}`}
              >
                <CardHeader className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-black text-gray-800">
                        {y.libelle}
                      </CardTitle>
                      {y.active && (
                        <div className="flex items-center text-green-600 text-xs font-bold gap-1 bg-green-50 px-2 py-1 rounded inline-flex">
                          <CheckCircle2 className="w-4 h-4" /> Active
                        </div>
                      )}
                    </div>
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
                            Êtes-vous sûr de vouloir supprimer l'année académique <span className="font-bold">{y.libelle}</span> ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => confirmDelete(y.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex flex-col gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> 
                      <span className="font-semibold text-gray-700">Début:</span> {new Date(y.start_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> 
                      <span className="font-semibold text-gray-700">Fin:</span> {new Date(y.end_date).toLocaleDateString()}
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
