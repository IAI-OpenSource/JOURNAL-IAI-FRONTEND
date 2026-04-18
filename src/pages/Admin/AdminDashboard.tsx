import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Ticket,
  School,
  Loader2,
  UserCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Admin } from "../../services/Admin";
import { registrationService } from "../../services/Registration";
import { toast } from "sonner";

interface DashboardStats {
  totalTokens: number;
  registeredStudents: number;
  totalStudents: number;
  totalClasses: number;
  activeYear: string | null;
}

import logo from "../../assets/logo.jpeg";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [classRes, usersRes, regRes, activeYearRes] = await Promise.all([
        Admin.getAllClasses(),
        Admin.getAllUsers(),
        registrationService.getAll(),
        Admin.getActiveAcademicYear()
      ]);

      if (classRes.ok && usersRes.ok && regRes.ok) {
        const classes = classRes.result.classes;
        const users = usersRes.result;
        const registrations = regRes.result;

        const studentRoles = ["STUDENT", "DELEGATE", "CLUB_LEADER", "EXECUTIVE_MEMBER"];

        const registeredStudentsCount = users.filter(u => studentRoles.includes(u.role)).length;
        const unusedTokensCount = registrations.filter(r => !r.used_at && studentRoles.includes(r.role)).length;

        setStats({
          totalTokens: registrations.length,
          registeredStudents: registeredStudentsCount,
          totalStudents: registeredStudentsCount + unusedTokensCount,
          totalClasses: classes.length,
          activeYear: activeYearRes?.ok ? activeYearRes.result.libelle : "N/A"
        });
      }
    } catch (error) {
      console.error("Erreur Dashboard:", error);
      toast.error("Impossible de charger les statistiques");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Chargement des données...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Jetons Générés",
      value: stats?.totalTokens || 0,
      description: "Invitations créées",
      icon: Ticket,
      link: "/classeListe",
      color: "text-blue-600"
    },
    {
      title: "Élèves Inscrits",
      value: stats?.registeredStudents || 0,
      description: "Comptes activés",
      icon: UserCheck,
      link: "/admin",
      color: "text-green-600"
    },
    {
      title: "Total Élèves",
      value: stats?.totalStudents || 0,
      description: "Effectif prévisionnel",
      icon: Users,
      link: "/classeListe",
      color: "text-purple-600"
    },
    {
      title: "Classes Créées",
      value: stats?.totalClasses || 0,
      description: "Nombre de classes",
      icon: School,
      link: "/classeListe",
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto relative min-h-screen">
      {/* Logo en arrière-plan */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <img
          src={logo}
          alt="Watermark"
          className="w-[600px] h-[600px] object-contain grayscale"
        />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
          <p className="text-muted-foreground">
            Année Académique : <span className="font-semibold text-foreground text-green-600">{stats?.activeYear}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:bg-muted/50 transition-colors shadow-sm"
              onClick={() => navigate(stat.link)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
