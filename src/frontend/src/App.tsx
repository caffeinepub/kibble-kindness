import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// Keep actor + identity references alive (required by build)
void useActor;
void useInternetIdentity;

/* ============================================================
   HOOKS
   ============================================================ */

function useScrollSpy() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-hidden");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    for (const el of Array.from(els)) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
}

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target]);

  return count;
}

/* ============================================================
   SMALL COMPONENTS
   ============================================================ */

const SLIDE_IMAGES = [
  "/assets/generated/hero-dog.dim_1200x600.jpg",
  "/assets/generated/hero-cat.dim_1200x600.jpg",
  "/assets/generated/hero-community.dim_1200x600.jpg",
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Impact", href: "#impact" },
    { label: "Donate", href: "#donate" },
    { label: "Team", href: "#team" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-scrolled" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#home"
          className="font-display font-brand text-2xl gold-text font-bold tracking-wide"
          data-ocid="nav.link"
        >
          थाली Bharo
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-body text-gray-600 hover:text-green-700 transition-colors duration-200 tracking-wide"
              data-ocid="nav.link"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#donate"
            className="btn-gold px-5 py-2 text-sm"
            data-ocid="nav.primary_button"
          >
            Donate Now
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden text-green-700 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          <div className="space-y-1.5">
            <span
              className={`block w-6 h-0.5 bg-green-700 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-green-700 transition-all ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-green-700 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-green-200 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-gray-700 hover:text-green-700 transition-colors py-1"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.link"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((v) => (v + 1) % SLIDE_IMAGES.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {SLIDE_IMAGES.map((src, i) => (
        <div
          key={src}
          className={`hero-slide ${i === active ? "active" : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/70 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent z-10" />

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <p className="font-body text-green-700/80 tracking-[0.3em] uppercase text-sm mb-4">
          Pet Food Donation Platform
        </p>
        <h1 className="font-display font-brand text-6xl md:text-8xl font-bold gold-text leading-tight mb-6">
          थाली Bharo
        </h1>
        <p className="font-body text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
          Your kindness fills bowls for many pets, one meal at a time.
        </p>
        <a
          href="#donate"
          className="btn-gold inline-block px-10 py-4 text-lg"
          data-ocid="hero.primary_button"
        >
          Donate With Kindness
        </a>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {SLIDE_IMAGES.map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "w-8 h-2 bg-green-600"
                : "w-2 h-2 bg-gray-400 hover:bg-green-500/60"
            }`}
            aria-label={`Slide ${i + 1}`}
            data-ocid="hero.toggle"
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2 text-gray-400">
        <span className="text-xs tracking-widest rotate-90 origin-center">
          SCROLL
        </span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-green-500/50 to-transparent" />
      </div>
    </section>
  );
}

function CounterCard({
  label,
  target,
  suffix,
  active,
}: {
  label: string;
  target: number;
  suffix: string;
  active: boolean;
}) {
  const count = useCountUp(target, active);
  return (
    <div className="glass-card p-8 text-center flex flex-col items-center gap-3">
      <div className="counter-number">
        {count.toLocaleString()}
        {suffix}
      </div>
      <p className="font-body text-gray-500 text-sm tracking-wide uppercase">
        {label}
      </p>
    </div>
  );
}

function ImpactSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { label: "Pets Fed", target: 5000, suffix: "+" },
    { label: "Donors", target: 1200, suffix: "+" },
    { label: "Meals Served", target: 18000, suffix: "+" },
    { label: "Cities Reached", target: 12, suffix: "+" },
  ];

  return (
    <section id="impact" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 section-hidden">
          <p className="font-body text-green-600/80 tracking-[0.25em] uppercase text-sm mb-3">
            Numbers That Matter
          </p>
          <h2 className="font-display text-5xl font-bold text-gray-800">
            हमारा <span className="gold-text">असर</span>
          </h2>
        </div>
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 section-hidden"
        >
          {stats.map((s) => (
            <CounterCard key={s.label} {...s} active={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowToDonateSection() {
  const steps = [
    {
      num: "1",
      icon: "📱",
      title: "QR Code Scan करें",
      desc: "नीचे दिए गए Donate बटन पर click करें और PhonePe QR code scan करें।",
    },
    {
      num: "2",
      icon: "💰",
      title: "Amount डालें और Pay करें",
      desc: "अपनी इच्छा अनुसार कोई भी amount डालें। हर रुपया एक pet की थाली भरता है।",
    },
    {
      num: "3",
      icon: "✅",
      title: "Confirmation मिलने पर Done!",
      desc: "Payment confirmation मिलते ही आपका donation complete! आपकी kindness काम आई।",
    },
  ];

  return (
    <section className="py-24 px-6 bg-green-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 section-hidden">
          <p className="font-body text-green-600/80 tracking-[0.25em] uppercase text-sm mb-3">
            Simple Process
          </p>
          <h2 className="font-display text-5xl font-bold text-gray-800">
            कैसे <span className="gold-text">Donate</span> करें?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className="glass-card p-8 section-hidden"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="step-number">{s.num}</div>
                <span className="text-3xl">{s.icon}</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-green-700 mb-3">
                {s.title}
              </h3>
              <p className="font-body text-gray-500 leading-relaxed text-sm">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type DonateState = "idle" | "loading" | "qr";

const QR_TIMEOUT_SECONDS = 8 * 60; // 8 minutes

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function DonateSection() {
  const [state, setState] = useState<DonateState>("idle");
  const [timeLeft, setTimeLeft] = useState(QR_TIMEOUT_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleDonate = useCallback(() => {
    setState("loading");
    setTimeout(() => {
      setState("qr");
      setTimeLeft(QR_TIMEOUT_SECONDS);
    }, 2000);
  }, []);

  useEffect(() => {
    if (state === "qr") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setState("idle");
            return QR_TIMEOUT_SECONDS;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [state, clearTimer]);

  const handleBack = useCallback(() => {
    clearTimer();
    setState("idle");
    setTimeLeft(QR_TIMEOUT_SECONDS);
  }, [clearTimer]);

  // color: green when > 2min, amber when 1-2min, red when < 1min
  const timerColor =
    timeLeft > 120
      ? "text-green-600"
      : timeLeft > 60
        ? "text-amber-500"
        : "text-red-500";

  return (
    <section id="donate" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <div className="section-hidden">
          <p className="font-body text-green-600/80 tracking-[0.25em] uppercase text-sm mb-3">
            Make A Difference
          </p>
          <h2 className="font-display text-5xl font-bold text-gray-800 mb-6">
            <span className="gold-text">Donate</span> करें
          </h2>
          <p className="font-body text-gray-500 mb-10 text-lg">
            एक QR scan से आप किसी pet की जिंदगी बदल सकते हैं।
          </p>
        </div>

        {state === "idle" && (
          <div className="section-hidden">
            <button
              type="button"
              onClick={handleDonate}
              className="btn-gold px-14 py-5 text-xl"
              data-ocid="donate.primary_button"
            >
              Donate With Kindness 🐾
            </button>
          </div>
        )}

        {state === "loading" && (
          <div
            className="glass-card p-12 flex flex-col items-center gap-6"
            data-ocid="donate.loading_state"
          >
            <div className="text-5xl animate-pulse">🐾</div>
            <p className="font-display text-xl text-green-700">
              Processing your kindness...
            </p>
            <div className="flex gap-3">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          </div>
        )}

        {state === "qr" && (
          <div
            className="glass-card p-10 flex flex-col items-center gap-6"
            data-ocid="donate.success_state"
          >
            <div className="text-center mb-2">
              <p className="font-display text-2xl text-green-700 mb-2">
                Scan to Donate via PhonePe
              </p>
              <p className="font-body text-gray-500 text-sm">Satyam Kumar</p>
            </div>

            {/* Countdown Timer */}
            <div className="flex flex-col items-center gap-1">
              <p className="font-body text-xs text-gray-400 uppercase tracking-widest">
                QR बंद होने में
              </p>
              <span
                className={`font-display text-4xl font-bold tabular-nums ${timerColor}`}
              >
                {formatTime(timeLeft)}
              </span>
              {/* Progress bar */}
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(timeLeft / QR_TIMEOUT_SECONDS) * 100}%`,
                    backgroundColor:
                      timeLeft > 120
                        ? "#16a34a"
                        : timeLeft > 60
                          ? "#f59e0b"
                          : "#ef4444",
                  }}
                />
              </div>
            </div>

            <div className="qr-glow overflow-hidden">
              <img
                src="/assets/uploads/satyam_qr-019d2e67-fed3-749c-aff6-2a34a1a0e216-1.jpg"
                alt="PhonePe QR Code — Satyam Kumar"
                width={600}
                height={600}
                className="block max-w-full"
                style={{ width: "min(600px, 100%)", height: "auto" }}
              />
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="font-body text-sm text-gray-400 hover:text-green-600 transition-colors mt-2"
              data-ocid="donate.secondary_button"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function TeamSection() {
  const members = [
    {
      name: "Satyam Kumar",
      role: "Founder & Lead",
      initials: "SK",
    },
    {
      name: "Priya Sharma",
      role: "Volunteer Lead",
      initials: "PS",
    },
    {
      name: "Rahul Verma",
      role: "Community Outreach",
      initials: "RV",
    },
    {
      name: "Ankit Gupta",
      role: "Social Media",
      initials: "AG",
    },
    {
      name: "Neha Joshi",
      role: "Donations Manager",
      initials: "NJ",
    },
  ];

  const colors = [
    "linear-gradient(135deg, oklch(52% 0.17 145), oklch(44% 0.16 148))",
    "linear-gradient(135deg, oklch(55% 0.15 200), oklch(48% 0.17 210))",
    "linear-gradient(135deg, oklch(50% 0.18 160), oklch(43% 0.16 155))",
    "linear-gradient(135deg, oklch(54% 0.14 175), oklch(47% 0.16 180))",
    "linear-gradient(135deg, oklch(48% 0.19 135), oklch(42% 0.17 140))",
  ];

  return (
    <section id="team" className="py-24 px-6 bg-green-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 section-hidden">
          <p className="font-body text-green-600/80 tracking-[0.25em] uppercase text-sm mb-3">
            The People Behind
          </p>
          <h2 className="font-display text-5xl font-bold text-gray-800">
            हमारी <span className="gold-text">Team</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {members.map((m, i) => (
            <div
              key={m.name}
              className="glass-card p-6 flex flex-col items-center text-center section-hidden"
              style={{ transitionDelay: `${i * 0.1}s` }}
              data-ocid={`team.card.${i + 1}`}
            >
              <div className="relative mb-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: colors[i] }}
                >
                  {m.initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold text-white">
                  ✦
                </div>
              </div>
              <h3 className="font-display text-base font-semibold gold-text mb-1">
                {m.name}
              </h3>
              <p className="font-body text-gray-500 text-xs tracking-wide uppercase">
                {m.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const reviews = [
    {
      quote:
        "थाली Bharo ne mere aas-paas ke pets ki zindagi badal di. Itna aasan donate karna!",
      name: "Anita S.",
      city: "Delhi",
      initials: "AS",
    },
    {
      quote:
        "QR code se ek minute mein payment ho gayi. Bahut acha kaam kar rahe hain!",
      name: "Mohit R.",
      city: "Mumbai",
      initials: "MR",
    },
    {
      quote: "Sachchi pehel. Mere pet ko bhi khana milta hai inke zariye.",
      name: "Sunita K.",
      city: "Jaipur",
      initials: "SK",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 section-hidden">
          <p className="font-body text-green-600/80 tracking-[0.25em] uppercase text-sm mb-3">
            Real Stories
          </p>
          <h2 className="font-display text-5xl font-bold text-gray-800">
            Donors की <span className="gold-text">बात</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div
              key={r.name}
              className="glass-card p-8 flex flex-col gap-5 section-hidden"
              style={{ transitionDelay: `${i * 0.15}s` }}
              data-ocid={`testimonials.card.${i + 1}`}
            >
              <div className="star-rating">★★★★★</div>
              <p className="font-body text-gray-600 italic leading-relaxed text-sm flex-1">
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-green-100">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(52% 0.17 145), oklch(44% 0.16 148))",
                  }}
                >
                  {r.initials}
                </div>
                <div>
                  <p className="font-body text-green-700 text-sm font-semibold">
                    {r.name}
                  </p>
                  <p className="font-body text-gray-400 text-xs">{r.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const links = [
    { label: "Home", href: "#home" },
    { label: "Impact", href: "#impact" },
    { label: "Donate", href: "#donate" },
    { label: "Team", href: "#team" },
  ];

  return (
    <footer className="bg-green-700 pt-16 pb-8 px-6">
      <div
        className="mb-12"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-display font-brand text-3xl font-bold text-white mb-4">
              थाली Bharo
            </h3>
            <p className="font-body text-green-200 text-sm leading-relaxed italic">
              &ldquo;Ek thali se shuru hoti hai ummeed.&rdquo;
            </p>
            <p className="font-body text-green-300/60 text-xs mt-2">
              Hope begins with one plate.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-green-200 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-body text-green-100 hover:text-white transition-colors text-sm"
                    data-ocid="footer.link"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-green-200 mb-5">
              Our Mission
            </h4>
            <p className="font-body text-green-100 text-sm leading-relaxed">
              हर जानवर को प्यार और खाना मिलना चाहिए। थाली Bharo इसी सोच के साथ काम
              करता है।
            </p>
          </div>
        </div>
        <div
          className="mb-8"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          }}
        />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-green-200 text-xs">
            © {year} थाली Bharo. Sabhi adhikar surakshit.
          </p>
          <p className="font-body text-green-300/60 text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-200 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */

export default function App() {
  useScrollSpy();

  return (
    <div className="min-h-screen bg-[#fffdf0] text-gray-800">
      <Navbar />
      <main>
        <HeroSection />
        <ImpactSection />
        <HowToDonateSection />
        <DonateSection />
        <TeamSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
