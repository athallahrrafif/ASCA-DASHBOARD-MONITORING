import {
  ArrowDown,
  BarChart3,
  Bot,
  Database,
  GraduationCap,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";

const STEPS = [
  {
    id: "student",
    label: "Mahasiswa",
    detail: "Mengajukan pertanyaan akademik.",
    icon: GraduationCap,
    tone: "purple",
  },
  {
    id: "telegram",
    label: "Telegram",
    detail: "Kanal percakapan yang sudah dipakai sehari-hari.",
    icon: Send,
    tone: "blue",
  },
  {
    id: "bot",
    label: "ASCA AI Chatbot",
    detail: "Memahami pertanyaan dan menyusun jawaban.",
    icon: Bot,
    tone: "purple",
  },
  {
    id: "kb",
    label: "Knowledge Base",
    detail: "Panduan akademik dan data mata kuliah sebagai sumber.",
    icon: Database,
    tone: "blue",
  },
  {
    id: "answer",
    label: "Jawaban akademik",
    detail: "Dikirim kembali ke Telegram beserta rujukan dokumen.",
    icon: MessageCircle,
    tone: "purple",
  },
  {
    id: "log",
    label: "Data interaksi",
    detail: "Pertanyaan tercatat dalam bentuk anonim.",
    icon: Sparkles,
    tone: "blue",
  },
  {
    id: "dashboard",
    label: "Dashboard & analitik",
    detail: "Halaman yang sedang Anda buka.",
    icon: BarChart3,
    tone: "purple",
  },
];

export default function FlowDiagram() {
  return (
    <ol className="relative mx-auto max-w-2xl">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === STEPS.length - 1;
        return (
          <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast ? (
              <span
                aria-hidden
                className="absolute left-[23px] top-12 h-[calc(100%-2.5rem)] w-px bg-line"
              />
            ) : null}

            <span
              className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line
              ${step.tone === "purple" ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"}`}
            >
              <Icon size={20} strokeWidth={1.9} aria-hidden />
            </span>

            <div
              className={`min-w-0 flex-1 rounded-card border border-line bg-surface px-5 py-4
              ${isLast ? "ring-1 ring-purple-500/20" : ""}`}
            >
              <p className="font-display text-[17px] leading-snug text-ink">
                {step.label}
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
                {step.detail}
              </p>
            </div>

            {!isLast ? (
              <ArrowDown
                aria-hidden
                size={14}
                className="absolute left-[16px] top-[56px] z-20 rounded-full bg-canvas text-muted"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
