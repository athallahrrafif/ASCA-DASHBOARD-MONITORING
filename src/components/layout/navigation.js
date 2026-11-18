import {
  LayoutDashboard,
  MessageSquareText,
  BarChart3,
  ThumbsUp,
  Bot,
  BookOpen,
  GraduationCap,
  FileText,
  Database,
  UserRound,
} from "lucide-react";

/**
 * Menu sengaja dikelompokkan: monitoring (apa yang terjadi) dipisahkan dari
 * katalog informasi (apa yang ASCA ketahui). Tanpa pengelompokan, sepuluh
 * menu datar membuat dashboard terbaca seperti template admin.
 *
 * Tidak ada menu chat/chatbot: interaksi AI berada di Telegram.
 */
export const navGroups = [
  {
    id: "monitoring",
    label: "Monitoring",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      // { to: "/interactions", label: "Data Interaksi", icon: MessageSquareText },
      // // { to: '/analytics', label: 'Analitik', icon: BarChart3 },
      // { to: "/feedback", label: "Umpan Balik", icon: ThumbsUp },
      // { to: "/bot-monitoring", label: "Status Bot", icon: Bot },
    ],
  },
  {
    // id: "knowledge",
    // label: "Informasi akademik",
    // items: [
    //   { to: "/academic-info", label: "Katalog Informasi", icon: BookOpen },
    //   { to: "/courses", label: "Mata Kuliah", icon: GraduationCap },
    //   { to: "/documents", label: "Dokumen", icon: FileText },
    //   { to: "/knowledge-base", label: "Knowledge Base", icon: Database },
    //   ],
    // },
    // {
    id: "account",
    label: "Akun",
    items: [{ to: "/profile", label: "Profil", icon: UserRound }],
  },
];

export const flatNav = navGroups.flatMap((group) => group.items);
