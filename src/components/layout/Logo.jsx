import { Link } from "react-router-dom";

/**
 * Lambang ASCA: sudut toga akademik yang sekaligus membentuk ujung
 * gelembung percakapan — akademik bertemu kanal pesan.
 */
export function LogoMark({ size = 36, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label="ASCA"
      className={className}
    >
      <defs>
        <linearGradient
          id="asca-mark"
          x1="4"
          y1="4"
          x2="36"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6D4AFF" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#asca-mark)" />
      <path
        d="M20 10.5 30 15.4 20 20.3 10 15.4Z"
        fill="#fff"
        fillOpacity="0.96"
      />
      <path
        d="M13.6 18v5.6c0 2.6 2.9 4.3 6.4 4.3s6.4-1.7 6.4-4.3V18"
        stroke="#fff"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M29.6 16.4v5.1l2.6 2.1"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ to = "/", compact = false, className = "" }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 ${className}`}
      aria-label="ASCA — beranda"
    >
      <LogoMark size={compact ? 30 : 36} />
      {!compact ? (
        <span className="leading-tight">
          <span className="block font-display text-[19px] font-semibold tracking-tight text-ink">
            ASCA
          </span>
          <span className="block text-[11px] text-muted">
            Academic Assistant
          </span>
        </span>
      ) : null}
    </Link>
  );
}
