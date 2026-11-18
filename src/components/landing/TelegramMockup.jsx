import { Check, MoreVertical, Paperclip, Phone, Smile } from "lucide-react";
import { LogoMark } from "../layout/Logo";

/**
 * ILUSTRASI STATIS. Bukan chatbot yang berfungsi.
 * Tidak ada input, tidak ada state, tidak ada pemanggilan AI di halaman ini.
 */
const THREAD = [
  {
    from: "user",
    text: "Halo, apa saja persyaratan Capstone Project?",
    time: "09:24",
  },
  {
    from: "bot",
    time: "09:24",
    text: "Untuk mengambil Capstone Project, mahasiswa perlu memenuhi:",
    bullets: [
      "Minimal 110 SKS lulus",
      "Sudah menempuh Rekayasa Perangkat Lunak",
      "Terdaftar dalam kelompok 3–4 orang",
    ],
    source: "Panduan Capstone Project 2026, hal. 7",
  },
  { from: "user", text: "Kalau SKS saya baru 104 bagaimana?", time: "09:25" },
];

export default function TelegramMockup() {
  return (
    <figure className="w-full max-w-[380px]">
      <div className="overflow-hidden rounded-xl2 border border-line bg-surface shadow-lift">
        {/* Header percakapan */}
        <div className="flex items-center gap-3 border-b border-line bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur">
            <LogoMark size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14.5px] font-semibold text-white">
              ASCA
            </p>
            <p className="text-[11.5px] text-white/75">
              bot · membalas otomatis
            </p>
          </div>
          <Phone size={15} className="text-white/70" aria-hidden />
          <MoreVertical size={15} className="text-white/70" aria-hidden />
        </div>

        {/* Isi percakapan */}
        <div className="space-y-2.5 bg-canvas px-3.5 py-4">
          {THREAD.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm
                ${
                  message.from === "user"
                    ? "rounded-br-md bg-purple-500 text-white"
                    : "rounded-bl-md border border-line bg-surface text-ink"
                }`}
              >
                <p>{message.text}</p>

                {message.bullets ? (
                  <ul className="mt-2 space-y-1">
                    {message.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-1.5">
                        <span
                          className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-purple-500"
                          aria-hidden
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {message.source ? (
                  <p className="mt-2.5 border-t border-line pt-2 text-[11px] text-muted">
                    Sumber: {message.source}
                  </p>
                ) : null}

                <p
                  className={`mt-1.5 flex items-center justify-end gap-1 text-[10.5px]
                  ${message.from === "user" ? "text-white/70" : "text-muted"}`}
                >
                  {message.time}
                  {message.from === "user" ? (
                    <Check size={11} aria-hidden />
                  ) : null}
                </p>
              </div>
            </div>
          ))}

          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-surface px-3.5 py-3">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
                  style={{
                    animationDelay: `${dot * 140}ms`,
                    animationDuration: "1.1s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bilah input — sengaja tidak berfungsi, hanya bagian dari ilustrasi */}
        <div
          aria-hidden
          className="flex items-center gap-2.5 border-t border-line bg-surface px-3.5 py-3"
        >
          <Paperclip size={16} className="text-muted" />
          <span className="flex-1 select-none text-[13px] text-muted">
            Ketik pesan di Telegram…
          </span>
          <Smile size={16} className="text-muted" />
        </div>
      </div>

      <figcaption className="mt-3 text-center text-[12px] text-muted">
        Ilustrasi percakapan di Telegram. Situs ini tidak menjalankan chatbot.
      </figcaption>
    </figure>
  );
}
