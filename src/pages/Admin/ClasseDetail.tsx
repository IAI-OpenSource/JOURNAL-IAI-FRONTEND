import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Admin } from "@/services/Admin";
import type { ReadRegistration, ReadUser, ClasseResponse, UserRole, SexeType } from "../../types/adminTypes";
import { 
  ArrowLeft, 
  Users2, 
  Plus, 
  FileSpreadsheet, 
  Loader2, 
  Search,
  FileDown,
  FileJson,
  Mail,
  Send,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const ClasseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
 
  const [loading, setLoading] = useState(true); 
  const [classe, setClasse] = useState<ClasseResponse | null>(null); 
  const [jetons, setJetons] = useState<ReadRegistration[]>([]); 
  const [users, setUsers] = useState<ReadUser[]>([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isJetonModalOpen, setIsJetonModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false); 
  const [creatingJeton, setCreatingJeton] = useState(false); 
  const [exporting, setExporting] = useState<"PDF" | "JSON" | null>(null); 
  const [sendingEmails, setSendingEmails] = useState(false); 
  const [deleting, setDeleting] = useState(false); 
  
  
  const [newJeton, setNewJeton] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "STUDENT" as UserRole,
    sexe: "M" as SexeType,
  });

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false); 
  const [importTaskId, setImportTaskId] = useState<string | null>(null); 

  const fetchData = async () => {
    if (!id) return;
    try {
      const [classeRes, jetonsRes, usersRes] = await Promise.all([
        Admin.getClasseById(id),
        Admin.getJetonsByClasse(id),
        Admin.getUsersByClasse(id)
      ]);

      if (classeRes.ok) setClasse(classeRes.result);
      if (jetonsRes.ok) setJetons(jetonsRes.result);
      if (usersRes.ok) setUsers(usersRes.result);
      
    } catch (error) {
      console.error("Erreur chargement données classe:", error);
      toast.error("Impossible de charger les données de la classe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  //cration d'un jetons
  const handleCreateJeton = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setCreatingJeton(true);
    try {
      const response = await Admin.createJeton({
        ...newJeton,
        classe_id: id
      });
      
      if (response.ok) {
        toast.success("Jeton généré avec succès !");
        setIsJetonModalOpen(false);
        setNewJeton({
          first_name: "",
          last_name: "",
          email: "",
          role: "STUDENT",
          sexe: "M",
        });
        fetchData();
      } else {
        toast.error(response.error || "Erreur lors de la création du jeton");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setCreatingJeton(false);
    }
  };

  //export des donnees via pdf ou json
  const handleExport = async (format: "PDF" | "JSON") => {
    if (!id) return;
    setExporting(format);
    try {
      const blob = await Admin.exportJetons(id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jetons_${classe?.classe_prefix}_${classe?.classe_suffix}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Fichier ${format} exporté avec succès`);
    } catch (error) {
      toast.error(`Erreur lors de l'export ${format}`);
    } finally {
      setExporting(null);
    }
  };

  //envoie des invitations par mail
  const handleSendEmails = async () => {
    if (!id) return;
    setSendingEmails(true);
    try {
      const res = await Admin.sendJetonsEmail(id);
      if (res.ok) {
        toast.success("Invitations envoyées par mail avec succès !");
      } else {
        toast.error(res.error || "Erreur lors de l'envoi des invitations");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi des mails");
    } finally {
      setSendingEmails(false);
    }
  };

  //importation via excel 
  const handleImportExcel = async () => {
    if (!id || !excelFile) return;
    setImporting(true);
    try {
      //  envoie du fichier au serveur
      const res = await Admin.importStudents(id, excelFile);
      if (res.ok) {
        // Le serveur nous donne un task_id, on va maintenant le surveiller
        setImportTaskId(res.result.task_id);
        toast.info("Importation lancée. Analyse du fichier en cours...");
      } else {
        toast.error(res.error || "Erreur lors de l'import");
        setImporting(false);
      }
    } catch (error) {
      toast.error("Erreur de connexion");
      setImporting(false);
    }
  };

  //pour supprimer une classe
  const confirmDeleteClasse = async () => {
    if (!id || !classe) return;
    setDeleting(true);
    try {
      const res = await Admin.deleteClasse(id);
      if (res.ok) {
        toast.success("Classe supprimée avec succès");
        navigate("/admin/classes/");
      } else {
        toast.error(res.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error("Impossible de supprimer la classe");
    } finally {
      setDeleting(false);
    }
  };
//supression d'une invitations
  const handleDeleteJeton = async (jetonId: string) => {
    try {
      const res = await Admin.deleteJeton(jetonId);
      if (res.ok) {
        toast.success("Invitation supprimée avec succès");
        fetchData();
      } else {
        toast.error(res.error || "Erreur lors de la suppression de l'invitation");
      }
    } catch (error) {
      toast.error("Impossible de supprimer l'invitation");
    }
  };
//supprimer un etudiant
  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await Admin.deleteUser(userId);
      if (res.ok) {
        toast.success("Etudiant supprimé avec succès");
        fetchData();
      } else {
        toast.error(res.error || "Erreur lors de la suppression de l'etudiant");
      }
    } catch (error) {
      toast.error("Impossible de supprimer l'étudiant");
    }
  };

  //  verifie si l'importation est terminer
  useEffect(() => {
    let interval: any;
    if (importTaskId) {
      // On lance une vérification toutes les 2 secondes
      interval = setInterval(async () => {
        try {
          const res = await Admin.checkImportStatus(importTaskId);
          
          //  importation réussie 
          if (res.ok && res.result.status === "SUCCESS") {
            toast.success("Importation terminée avec succès !");
            setImportTaskId(null); 
            setImporting(false);
            setIsImportModalOpen(false);
            fetchData();
            clearInterval(interval);
          } 
          // ça a échoué 
          else if (res.ok && res.result?.status === "FAILURE") {
            toast.error("L'importation a échoué : " + (res.result?.message || "Erreur inconnue"));
            setImportTaskId(null);
            setImporting(false);
            clearInterval(interval);
          } 
          //  erreur directe de la requête 
          else if (!res.ok) {
            const errorMsg = res.error || res.detail || res.message || "Erreur serveur";
            toast.error("Erreur : " + errorMsg);
            setImportTaskId(null);
            setImporting(false);
            clearInterval(interval);
          }
        } catch (e: any) {
          //  gérer les erreurs réseau ou 400 Bad Request d'Axios 
          //couche de sécurité supplementaire a enlever plus tard 
          const backendData = e.response?.data;
          const statusCode = e.response?.status;
          console.error("[Import Status Error] HTTP", statusCode, backendData);
          const errorMessage = backendData?.error || backendData?.detail || backendData?.message || "Erreur réseau";
          toast.error(`[${statusCode}] ${errorMessage}`);
          setImportTaskId(null);
          setImporting(false);
          clearInterval(interval);
        }
      }, 2000);
    }
    return () => clearInterval(interval); // nettoie l'intervalle si on quitte la page
  }, [importTaskId]);

  if (loading || !classe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-yellow-600" />
        <p className="text-gray-500 font-medium">Chargement de la classe...</p>
      </div>
    );
  }
//pour la recherche
  const filteredJetons = jetons.filter(j => 
    `${j.first_name} ${j.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.jeton.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/admin/classes/")}
            className="rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
              {classe.classe_prefix} {classe.classe_suffix}
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                disabled={deleting}
                className="font-bold"
              >
                {deleting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Trash2 className="h-5 w-5 mr-2" />}
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer la classe <span className="font-bold text-gray-900">{classe.classe_prefix} {classe.classe_suffix}</span> ? Cette action est irréversible et supprimera toutes les données associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteClasse} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog open={isJetonModalOpen} onOpenChange={setIsJetonModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800 text-white font-bold px-6">
                <Plus className="mr-2 h-5 w-5" /> Générer un Jeton
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Générer des invitations</DialogTitle>
                <DialogDescription>
                  Créez un jeton individuel ou importez une liste Excel.
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="manuel" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manuel">Ajout manuel</TabsTrigger>
                  <TabsTrigger value="excel">Import Excel</TabsTrigger>
                </TabsList>
                
                <TabsContent value="manuel">
                  <form onSubmit={handleCreateJeton} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input 
                          id="firstName" 
                          placeholder="Ex: TOGO" 
                          required 
                          value={newJeton.first_name}
                          onChange={(e) => setNewJeton({...newJeton, first_name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Ex: IAI" 
                          required 
                          value={newJeton.last_name}
                          onChange={(e) => setNewJeton({...newJeton, last_name: e.target.value.toUpperCase()})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newEmail">Email</Label>
                      <Input 
                        id="newEmail" 
                        type="email"
                        placeholder="Ex:iaitogo@gmail.com" 
                        required 
                        value={newJeton.email}
                        onChange={(e) => setNewJeton({...newJeton, email: e.target.value.toLowerCase()})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sexe">Sexe</Label>
                        <Select 
                          value={newJeton.sexe} 
                          onValueChange={(val) => setNewJeton({...newJeton, sexe: val as SexeType})}
                        >
                          <SelectTrigger id="sexe" className="w-full h-10 border-input focus:ring-2 focus:ring-black">
                            <SelectValue placeholder="Sélectionnez le sexe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Masculin</SelectItem>
                            <SelectItem value="F">Féminin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Rôle</Label>
                        <Select 
                          value={newJeton.role} 
                          onValueChange={(val) => setNewJeton({...newJeton, role: val as UserRole})}
                        >
                          <SelectTrigger id="role" className="w-full h-10 border-input focus:ring-2 focus:ring-black">
                            <SelectValue placeholder="Sélectionnez le rôle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="STUDENT">Etudiant standard</SelectItem>
                            <SelectItem value="DELEGATE">Délégué</SelectItem>
                            <SelectItem value="CLUB_LEADER">Responsable Club</SelectItem>
                            <SelectItem value="EXECUTIVE_MEMBER">Membre Bureau</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="submit" className="w-full mt-4 bg-black" disabled={creatingJeton}>
                      {creatingJeton ? <Loader2 className="animate-spin mr-2" /> : "Générer le code"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="excel">
                  <div className="space-y-4 py-4 flex flex-col items-center border-2 border-dashed rounded-xl p-6">
                    <FileSpreadsheet className="h-12 w-12 text-green-600 mb-2" />
                    <div className="text-center space-y-1">
                      <p className="font-bold">Importer un fichier Excel</p>
                      <p className="text-xs text-gray-400">Le fichier doit suivre le format requis(Nom,prenom,sexe,email).</p>
                    </div>
                    <Input 
                      type="file" 
                      accept=".xlsx,.xls" 
                      onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                      className="cursor-pointer"
                    />
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      disabled={!excelFile || importing}
                      onClick={handleImportExcel}
                    >
                      {importing ? <Loader2 className="animate-spin mr-2" /> : "Lancer l'importation"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-start">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher..." 
              className="pl-10 h-10 border-gray-200 focus:ring-black rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="jetons" className="w-full">
          <TabsList className="flex justify-center bg-transparent border-b rounded-none h-auto p-0 gap-8 mb-6">
            <TabsTrigger 
              value="jetons" 
              className="data-[state=active]:border-black data-[state=active]:bg-gray-100 border-b-2 border-transparent rounded-none px-4 py-3 flex items-center gap-2 font-bold"
            >
              <Mail className="h-4 w-4" /> Invitations ({jetons.length})
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:border-black data-[state=active]:bg-gray-100 border-b-2 border-transparent rounded-none px-4 py-3 flex items-center gap-2 font-bold"
            >
              <Users2 className="h-4 w-4" /> Utilisateurs Inscrits ({users.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jetons">
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="w-full text-left">
                  <TableHeader className="bg-gray-50 border-b">
                    <TableRow>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 h-auto">Élève</TableHead>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 h-auto">Code Jeton</TableHead>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 h-auto">Email</TableHead>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 h-auto text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y">
                    {filteredJetons.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="px-6 py-10 text-center text-gray-500 border-none">
                           Aucune invitation trouvée.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredJetons.map((j) => (
                        <TableRow key={j.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="px-6 py-4 border-none">
                            <p className="font-bold text-gray-900">{j.first_name} {j.last_name}</p>
                          </TableCell>
                          <TableCell className="px-6 py-4 border-none">
                             <code className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md font-mono font-bold text-sm tracking-widest border border-indigo-200">
                              {j.jeton}
                            </code>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-sm text-gray-600 border-none">
                            {j.email}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right border-none">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto rounded-lg transition-colors">
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Voulez-vous vraiment supprimer l'invitation de <span className="font-bold">{j.first_name} {j.last_name}</span> ? Cette action désactivera le jeton.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteJeton(j.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {filteredJetons.length > 0 && (
                <div className="p-6 bg-gray-50 border-t flex justify-end">
                  <Button 
                    onClick={handleSendEmails} 
                    disabled={sendingEmails}
                    className="bg-yellow-500 hover:bg-yellow-600 font-bold text-white px-6 shadow-md transition-transform active:scale-95"
                  >
                    {sendingEmails ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <Send className="h-5 w-5 mr-2" />
                    )}
                    Envoyer les invitations par mail
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="w-full text-left">
                  <TableHeader className="bg-gray-50 border-b">
                    <TableRow>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 h-auto">Utilisateur</TableHead>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 h-auto">Email</TableHead>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 h-auto">Rôle</TableHead>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 h-auto">Date Inscription</TableHead>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 h-auto text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y">
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="px-6 py-10 text-center text-gray-500 border-none">
                          Aucun utilisateur inscrit.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((u) => (
                        <TableRow key={u.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="px-6 py-4 flex items-center gap-3 border-none">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gray-100 font-bold text-gray-600">
                                {u.first_name[0]}{u.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-gray-900">{u.first_name} {u.last_name}</p>
                              <p className="text-xs text-gray-500">@{u.username}</p>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-sm text-gray-600 border-none">{u.email}</TableCell>
                          <TableCell className="px-6 py-4 border-none">
                            <Badge variant="outline" className="text-[10px] font-bold border-indigo-200 text-indigo-700">
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-sm text-gray-500 border-none">
                            {new Date(u.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right border-none">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto rounded-lg transition-colors">
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Voulez-vous vraiment supprimer l'utilisateur <span className="font-bold">{u.first_name} {u.last_name}</span> ? Cette action est irréversible et supprimera le compte.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(u.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-8 right-8 z-50 flex flex-col-reverse items-center gap-3">
        <Button 
          onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
          className="h-14 w-14 rounded-full shadow-2xl bg-red-600 hover:bg-red-700 text-white p-0 flex items-center justify-center transition-transform active:scale-95 relative"
          title="Options d'exportation"
        >
          {(exporting === "PDF" || exporting === "JSON") ? <Loader2 className="h-6 w-6 animate-spin" /> : <FileDown className="h-6 w-6" />}
        </Button>

        {isExportMenuOpen && (
          <div className="absolute bottom-[4.5rem] flex flex-col gap-3 transition-opacity animate-in fade-in slide-in-from-bottom-2">
            <Button
              onClick={() => {
                handleExport("JSON");
                setIsExportMenuOpen(false);
              }}
              disabled={!!exporting}
              variant="outline"
              className="flex items-center gap-2 rounded-full px-5 py-6 bg-white shadow-xl hover:bg-gray-50 border-gray-200 text-gray-700 font-bold w-44 justify-start"
            >
              <FileJson className="h-5 w-5 text-blue-600" />
              <span>Format JSON</span>
            </Button>

            <Button
              onClick={() => {
                handleExport("PDF");
                setIsExportMenuOpen(false);
              }}
              disabled={!!exporting}
              variant="outline"
              className="flex items-center gap-2 rounded-full px-5 py-6 bg-white shadow-xl hover:bg-gray-50 border-gray-200 text-gray-700 font-bold w-44 justify-start"
            >
              <FileDown className="h-5 w-5 text-red-600" />
              <span>Format PDF</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ClasseDetail;
