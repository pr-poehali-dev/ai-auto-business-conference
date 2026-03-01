import { useState, useEffect, useRef } from "react";
import { exportProgramDocx } from "@/utils/exportProgram";
import Icon from "@/components/ui/icon";

// ── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "О конференции", href: "#about" },
  { label: "Программа", href: "#program" },
  { label: "Спикеры", href: "#speakers" },
  { label: "Партнёры", href: "#partners" },
  { label: "Для спикеров", href: "#for-speakers" },
  { label: "Для партнёров", href: "#for-partners" },
  { label: "Контакты", href: "#contacts" },
];

const ROLES = [
  {
    icon: "TrendingUp",
    title: "Собственникам и гендиректорам",
    points: [
      "Как перестроить бизнес-модель под новую реальность",
      "Где искать маржу, когда продажи падают",
    ],
  },
  {
    icon: "BarChart2",
    title: "Коммерческим директорам и руководителям продаж",
    points: [
      "ИИ-инструменты для роста конверсии",
      "Автоматизация рутины менеджеров",
    ],
  },
  {
    icon: "Wrench",
    title: "Руководителям сервиса",
    points: [
      "Предиктивный сервис и управление запчастями",
      "Как поднять апсейл без допнагрузки на мастеров",
    ],
  },
  {
    icon: "Cpu",
    title: "ИТ-директорам и HR",
    points: [
      "Интеграция ИИ в существующие системы",
      "Обучение команды и работа с сопротивлением",
    ],
  },
];

const SPEAKERS = [
  { name: "Александр Кулагин", role: "Исполнительный директор", company: "Чанган Моторс РУС", initials: "АК", color: "#9D4EDD", topic: "", bio: "" },
  { name: "Алексей Почечуев", role: "Директор по продажам", company: "Geely", initials: "АП", color: "#FF00FF", topic: "", bio: "" },
  { name: "Дмитрий Денисов", role: "Директор Академии", company: "АВТОВАЗ", initials: "ДД", color: "#7B2FBE", topic: "", bio: "" },
  { name: "Дмитрий Новиков", role: "Директор клиентской службы", company: "АВТОВАЗ", initials: "ДН", color: "#9D4EDD", topic: "", bio: "" },
  { name: "Василий Чеботарёв", role: "Руководитель отдела маркетинга", company: "Мотор Инвест", initials: "ВЧ", color: "#FF00FF", topic: "", bio: "" },
  { name: "Ирина Клебанович", role: "Руководитель тренинг-центра", company: "Джетур", initials: "ИК", color: "#7B2FBE", topic: "", bio: "" },
  { name: "Ирина Козлова", role: "Руководитель направления", company: "СБЕР КРЕДИТОВАНИЕ", initials: "ИК", color: "#9D4EDD", topic: "", bio: "" },
  { name: "Алексей Лагутин", role: "Руководитель департамента", company: "СБЕР СТРАХОВАНИЕ", initials: "АЛ", color: "#FF00FF", topic: "", bio: "" },
  { name: "Олег Габидулин", role: "Операционный директор по AI", company: "Яндекс (Латинская Америка, Турция)", initials: "ОГ", color: "#7B2FBE", topic: "", bio: "" },
  { name: "Инна Петухова", role: "Генеральный директор", company: "Автобизнес Консалтинг", initials: "ИП", color: "#9D4EDD", topic: "", bio: "" },
  { name: "Степан Бойков", role: "Исполнительный директор", company: "Автобизнес Консалтинг", initials: "СБ", color: "#FF00FF", topic: "", bio: "" },
  { name: "Алексей Николаев", role: "Эксперт", company: "Автобизнес Консалтинг", initials: "АН", color: "#7B2FBE", topic: "", bio: "" },
  { name: "Анастасия Емельянова", role: "Эксперт", company: "Автобизнес Консалтинг", initials: "АЕ", color: "#9D4EDD", topic: "", bio: "" },
];

const PROGRAM = [
  { time: "09:30 – 10:00", type: "break", title: "Регистрация, приветственный кофе", track: null },
  { time: "10:00 – 12:30", type: "session", title: "СЕССИЯ 1: ИИ НА ФРОНТЕ: КЛИЕНТСКИЙ ОПЫТ И ПРОДАЖИ", track: "sales" },
  { time: "10:00 – 10:30", type: "talk", title: "Основные системные ошибки и смена парадигмы", speaker: "Александр Петров", company: "CTO, Чанган Моторс Россия", track: "sales" },
  { time: "10:30 – 11:00", type: "talk", title: "Цифровизация и клиентские ожидания поколения Z", speaker: "Мария Иванова", company: "Директор по ИИ, Джили Мотор", track: "sales" },
  { time: "11:00 – 11:30", type: "talk", title: "Чат-боты, которые действительно продают: кейс роста конверсии на 34%", speaker: "Дмитрий Соколов", company: "Вице-президент по инновациям, HAVAL", track: "sales" },
  { time: "11:30 – 12:00", type: "talk", title: "Генеративный ИИ для персонализированных предложений", speaker: "Елена Волкова", company: "Руководитель цифровизации, Hyundai Motor CIS", track: "sales" },
  { time: "12:00 – 12:30", type: "panel", title: "Панельная дискуссия: Ошибки традиционных дилеров и действия лидеров рынка", track: "sales" },
  { time: "12:30 – 13:30", type: "break", title: "Обед и нетворкинг", track: null },
  { time: "13:30 – 15:30", type: "session", title: "СЕССИЯ 2: ИИ В СЕРВИСЕ: ЭФФЕКТИВНОСТЬ И ЛОЯЛЬНОСТЬ", track: "service" },
  { time: "13:30 – 14:00", type: "talk", title: "Почему сервис важнее продаж: новая экономика дилера", speaker: "Алексей Кузнецов", company: "Директор сервисного департамента", track: "service" },
  { time: "14:00 – 14:30", type: "talk", title: "Предиктивный сервис: как предсказать поломку до клиента", speaker: "Спикер уточняется", company: "", track: "service" },
  { time: "14:30 – 15:00", type: "talk", title: "ИИ для управления запасными частями: снижение остатков и простоев", speaker: "Спикер уточняется", company: "", track: "service" },
  { time: "15:00 – 15:30", type: "talk", title: "Апсейл как ключевой инструмент: как ИИ подсказывает доппродажи", speaker: "Спикер уточняется", company: "", track: "service" },
  { time: "15:30 – 17:00", type: "session", title: "СЕССИЯ 3: ВНУТРЕННЯЯ КУХНЯ: HR, МАРКЕТИНГ, БЕЗОПАСНОСТЬ", track: "marketing" },
  { time: "15:30 – 16:00", type: "talk", title: "Маркетинг 6.0: от массовых рассылок к иммерсивному опыту", speaker: "Кира Волкова", company: "Маркетолог-стратег", track: "marketing" },
  { time: "16:00 – 16:30", type: "talk", title: "ИИ-ассистенты для onboarding и обучения сотрудников", speaker: "Спикер уточняется", company: "", track: "it" },
  { time: "16:30 – 17:00", type: "talk", title: "Анализ тональности обращений в КСО: как сохранить репутацию", speaker: "Спикер уточняется", company: "", track: "it" },
  { time: "17:00 – 17:45", type: "session", title: "СЕССИЯ 4: ВНЕДРЕНИЕ ИИ: С ЧЕГО НАЧАТЬ?", track: "it" },
  { time: "17:00 – 17:45", type: "talk", title: "Пять стратегических решений, которые руководитель автобизнеса должен принять, чтобы ИИ работал на капитализацию", speaker: "Кирилл Лядов", company: "", track: "it" },
  { time: "17:00 – 17:45", type: "talk", title: "Личные и командные ИИ-ассистенты: архитектура новой продуктивности", speaker: "Иван Староастин", company: "", track: "it" },
  { time: "17:00 – 17:45", type: "workshop", title: "Формат «Делай как я» — готовые фреймворки, шаблоны промптов, дорожные карты", speaker: "Эксперты-практики (2-3 человека)", company: "", track: "it" },
  { time: "17:45 – 18:00", type: "panel", title: "Заключительное слово и розыгрыш", track: null },
  { time: "18:00 – 20:00", type: "break", title: "Фуршет, неформальное общение, нетворкинг", track: null },
];

const TICKETS = [
  {
    id: "abc",
    title: "Для клиентов АВС",
    price: "Бесплатно",
    badge: null,
    features: [
      "Участие во всех сессиях",
      "Обед и кофе-брейки",
      "Доступ к записям после конференции",
      "Презентации спикеров",
    ],
    btnLabel: "Получить билет",
    btnStyle: "outline",
    note: "Проверка контракта АВС",
  },
  {
    id: "webinar",
    title: "Для участников вебинара",
    price: "4 000 ₽",
    badge: "Спеццена",
    features: [
      "Участие во всех сессиях",
      "Обед и кофе-брейки",
      "Доступ к записям",
      "Презентации спикеров",
      "Закрытый Telegram-чат участников",
    ],
    btnLabel: "Купить по промокоду ВЕБИНАР",
    btnStyle: "violet",
    note: null,
  },
  {
    id: "early",
    title: "Ранняя регистрация",
    price: "10 000 ₽",
    badge: "До 6 марта 2026",
    features: [
      "Участие во всех сессиях",
      "Обед и кофе-брейки",
      "Доступ к записям",
      "Презентации спикеров",
      "Закрытый Telegram-чат",
      "Приоритетная рассадка",
    ],
    btnLabel: "Забронировать",
    btnStyle: "neon",
    note: null,
    highlight: true,
  },
  {
    id: "standard",
    title: "Стандарт",
    price: "15 000 ₽",
    badge: "После 6 марта 2026",
    features: [
      "Участие во всех сессиях",
      "Обед и кофе-брейки",
      "Доступ к записям",
      "Презентации спикеров",
      "Закрытый Telegram-чат",
    ],
    btnLabel: "Купить билет",
    btnStyle: "violet",
    note: null,
  },
];

const PARTNER_PACKAGES = [
  {
    title: "Генеральный партнёр",
    slots: "Ограниченное количество мест",
    price: "По запросу",
    color: "#FF00FF",
    glow: true,
    perks: [
      "Выступление спикера",
      "Логотип партнёра на всех материалах",
      "База регистраций",
      "Информационный стенд в зоне нетворкинга и фуршета",
      "Видеоролик генерального партнёра в начале конференции",
    ],
  },
  {
    title: "Информационный партнёр",
    slots: "Ограниченное количество мест",
    price: "По запросу",
    color: "#9D4EDD",
    glow: false,
    perks: [
      "Выступление спикера",
      "Логотип партнёра на всех материалах",
      "База регистраций",
    ],
  },
];

const TRACKS = [
  { id: "all", label: "Все" },
  { id: "sales", label: "Продажи" },
  { id: "service", label: "Сервис" },
  { id: "marketing", label: "Маркетинг" },
  { id: "it", label: "ИТ / HR" },
];

// ── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── PARTICLE BACKGROUND ───────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 6,
    duration: Math.random() * 4 + 4,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.id % 3 === 0 ? "#FF00FF" : p.id % 2 === 0 ? "#9D4EDD" : "#ffffff",
            opacity: p.opacity,
            animationName: "particle-float",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        />
      ))}
      {/* Neon grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#9D4EDD" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

// ── SCROLL REVEAL WRAPPER ────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── TICKET MODAL ─────────────────────────────────────────────────────────────
type TicketType = typeof TICKETS[number] | { id: "online"; title: string; price: string; btnLabel: string; btnStyle: string; badge: null; features: string[]; note: null; highlight: boolean };

function TicketModal({ ticket, onClose }: { ticket: TicketType; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "promo" | "success">("form");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", contract: "", promo: "" });
  const isAbc = ticket.id === "abc";
  const isWebinar = ticket.id === "webinar";

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Esc
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
      onClick={handleBackdrop}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border p-8 animate-scale-in overflow-y-auto max-h-[90vh]"
        style={{
          background: "linear-gradient(135deg, #1A0030, #0D0015)",
          borderColor: "rgba(157,78,221,0.4)",
          boxShadow: "0 0 80px rgba(157,78,221,0.2), 0 0 160px rgba(255,0,255,0.05)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <Icon name="X" size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
        </button>

        {step === "success" ? (
          <div className="text-center py-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(157,78,221,0.15)", border: "2px solid #9D4EDD" }}
            >
              <Icon name="CheckCircle" size={40} style={{ color: "#9D4EDD" }} />
            </div>
            <h3 className="font-oswald text-3xl font-bold mb-3">Готово!</h3>
            <p className="text-white/60 mb-2">Заявка на <span className="text-[#FF00FF]">{ticket.title}</span> принята.</p>
            <p className="text-white/40 text-sm mb-8">Мы отправим подтверждение на <span className="text-white/60">{formData.email}</span></p>
            <button
              onClick={onClose}
              className="px-8 py-3 font-oswald font-semibold tracking-wider rounded-full"
              style={{ background: "linear-gradient(135deg, #9D4EDD, #FF00FF)" }}
            >
              ОТЛИЧНО!
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-7">
              <span className="text-[#FF00FF] text-xs font-oswald tracking-widest uppercase">Регистрация</span>
              <h3 className="font-oswald text-2xl font-bold mt-1 mb-1">{ticket.title}</h3>
              <div className="font-oswald text-3xl font-bold" style={{ color: "#FF00FF" }}>{ticket.price}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common fields */}
              {[
                { key: "name", label: "Имя и фамилия *", placeholder: "Иван Петров", required: true },
                { key: "email", label: "Email *", placeholder: "ivan@company.ru", required: true, type: "email" },
                { key: "phone", label: "Телефон *", placeholder: "+7 (900) 123-45-67", required: true },
                { key: "company", label: "Компания / должность", placeholder: "ООО Автоцентр, директор по продажам" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm text-white/50 mb-1.5">{f.label}</label>
                  <input
                    type={f.type || "text"}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={formData[f.key as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="w-full bg-[#0D0015]/70 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[#9D4EDD]"
                    style={{ borderColor: "rgba(157,78,221,0.25)" }}
                  />
                </div>
              ))}

              {/* ABC contract check */}
              {isAbc && (
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Номер контракта АВС *</label>
                  <input
                    type="text"
                    required
                    placeholder="Введите номер контракта"
                    value={formData.contract}
                    onChange={(e) => setFormData({ ...formData, contract: e.target.value })}
                    className="w-full bg-[#0D0015]/70 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[#9D4EDD]"
                    style={{ borderColor: "rgba(157,78,221,0.25)" }}
                  />
                  <p className="text-white/30 text-xs mt-1.5">Участие бесплатно для действующих клиентов АВС</p>
                </div>
              )}

              {/* Webinar promo */}
              {isWebinar && (
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Промокод *</label>
                  <input
                    type="text"
                    required
                    placeholder="ВЕБИНАР"
                    value={formData.promo}
                    onChange={(e) => setFormData({ ...formData, promo: e.target.value.toUpperCase() })}
                    className="w-full bg-[#0D0015]/70 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[#9D4EDD] tracking-widest font-oswald"
                    style={{ borderColor: "rgba(157,78,221,0.25)" }}
                  />
                  <p className="text-white/30 text-xs mt-1.5">Промокод для участников вебинара: <span className="text-[#9D4EDD]">ВЕБИНАР</span></p>
                </div>
              )}

              {/* Price reminder */}
              {ticket.price !== "Бесплатно" && (
                <div
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: "rgba(157,78,221,0.08)", border: "1px solid rgba(157,78,221,0.2)" }}
                >
                  <span className="text-white/50 text-sm">К оплате:</span>
                  <span className="font-oswald text-xl font-bold text-[#FF00FF]">{ticket.price}</span>
                </div>
              )}

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="oferta-agree"
                  required
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[#9D4EDD] cursor-pointer"
                />
                <label htmlFor="oferta-agree" className="text-white/40 text-xs leading-relaxed cursor-pointer">
                  Я ознакомился и принимаю условия{" "}
                  <a href="#" className="text-white/60 hover:text-[#FF00FF] transition-colors underline">договора оферты</a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 font-oswald text-base font-semibold tracking-wider rounded-full transition-all duration-200 hover:scale-[1.02] mt-2"
                style={{
                  background: "linear-gradient(135deg, #9D4EDD, #FF00FF)",
                  boxShadow: "0 0 30px rgba(255,0,255,0.25)",
                }}
              >
                {isAbc ? "ПОЛУЧИТЬ БЕСПЛАТНЫЙ БИЛЕТ" : "ПЕРЕЙТИ К ОПЛАТЕ"}
              </button>

              <p className="text-center text-white/25 text-xs">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a href="#" className="text-white/40 hover:text-[#FF00FF] transition-colors underline">политикой конфиденциальности</a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState("all");
  const [activeSpeaker, setActiveSpeaker] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeTicket, setActiveTicket] = useState<TicketType | null>(null);
  const [speakerFormData, setSpeakerFormData] = useState({ name: "", company: "", role: "", topic: "", description: "", link: "", email: "" });
  const [partnerFormData, setPartnerFormData] = useState({ company: "", name: "", role: "", package: "", email: "", phone: "" });
  const [contactFormData, setContactFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [speakerSent, setSpeakerSent] = useState(false);
  const [partnerSent, setPartnerSent] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredProgram = PROGRAM.filter(
    (item) => activeTrack === "all" || item.track === activeTrack || item.type === "break"
  );

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) { el.scrollIntoView({ behavior: "smooth" }); }
    setMobileMenuOpen(false);
  };

  const trackColor = (track: string | null) => {
    const map: Record<string, string> = {
      sales: "#9D4EDD",
      service: "#FF00FF",
      marketing: "#7B2FBE",
      it: "#5A1F8E",
    };
    return track ? map[track] || "#9D4EDD" : "transparent";
  };

  return (
    <div className="font-golos bg-[#0D0015] text-white min-h-screen">

      {/* ── TICKET MODAL ── */}
      {activeTicket && (
        <TicketModal ticket={activeTicket} onClose={() => setActiveTicket(null)} />
      )}

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(13,0,21,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(157,78,221,0.2)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollTo("#hero")}
            className="flex items-center gap-3"
          >
            <img
              src="https://cdn.poehali.dev/projects/d4af42ec-5015-483c-b71c-6bf32723c131/bucket/324a8a9f-e006-4d7a-b015-9f139c0a89e1.jpg"
              alt="AI Navigate"
              className="h-10 w-10 rounded-full object-cover"
              style={{ boxShadow: "0 0 16px rgba(255,0,255,0.4)" }}
            />
            <span
              className="font-oswald text-lg font-bold tracking-widest text-white"
              style={{ textShadow: "0 0 20px rgba(255,0,255,0.5)" }}
            >
              ИИ В АВТО <span style={{ color: "#FF00FF" }}>2.0</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-white/70 hover:text-white transition-colors hover:text-[#FF00FF]"
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo("#tickets")}
            className="hidden lg:block px-5 py-2 text-sm font-oswald font-semibold tracking-wider rounded-full transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #9D4EDD, #FF00FF)",
              boxShadow: "0 0 20px rgba(255,0,255,0.3)",
            }}
          >
            КУПИТЬ БИЛЕТ
          </button>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0D0015]/98 border-t border-[#9D4EDD]/20 px-6 py-4 space-y-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left text-white/80 hover:text-[#FF00FF] py-2 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("#tickets")}
              className="w-full py-3 font-oswald font-semibold rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #9D4EDD, #FF00FF)" }}
            >
              КУПИТЬ БИЛЕТ
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D0015 0%, #2D004B 50%, #0D0015 100%)" }}
      >
        <Particles />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(157,78,221,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,0,255,0.1) 0%, transparent 70%)", filter: "blur(30px)" }} />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-24 pb-16">
          <div className="flex justify-center mb-6" style={{ animation: "fade-in 0.6s ease-out forwards" }}>
            <img
              src="https://cdn.poehali.dev/projects/d4af42ec-5015-483c-b71c-6bf32723c131/bucket/324a8a9f-e006-4d7a-b015-9f139c0a89e1.jpg"
              alt="AI Navigate"
              className="h-28 w-28 md:h-36 md:w-36 rounded-full object-cover"
              style={{ boxShadow: "0 0 60px rgba(157,78,221,0.5), 0 0 120px rgba(255,0,255,0.2)" }}
            />
          </div>

          <div
            className="inline-block mb-6 px-5 py-2 text-sm font-golos tracking-widest rounded-full border"
            style={{
              borderColor: "rgba(255,0,255,0.4)",
              background: "rgba(255,0,255,0.05)",
              color: "#FF00FF",
              animation: "fade-in 0.6s ease-out 0.1s both",
            }}
          >
            2 АПРЕЛЯ 2026 • МОСКВА
          </div>

          <h1
            className="font-oswald text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-tight mb-6"
            style={{
              animation: "fade-in 0.6s ease-out 0.2s both",
              textShadow: "0 0 60px rgba(157,78,221,0.3)",
            }}
          >
            ИИ В АВТОБИЗНЕСЕ{" "}
            <span style={{ color: "#FF00FF", textShadow: "0 0 40px rgba(255,0,255,0.6)" }}>2026</span>
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-wide">
              ОТ РУТИН К СТРАТЕГИЯМ
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed"
            style={{ animation: "fade-in 0.6s ease-out 0.4s both" }}
          >
            Вы теряете <span className="text-[#FF00FF] font-semibold">30% лидов</span> и{" "}
            <span className="text-[#FF00FF] font-semibold">20% сервисной выручки</span> из-за ручных процессов.
            <br />Приходите за готовыми алгоритмами внедрения.
          </p>

          {/* Counter */}
          <div
            className="inline-flex items-center gap-3 mb-10 px-6 py-3 rounded-full"
            style={{
              background: "rgba(157,78,221,0.1)",
              border: "1px solid rgba(157,78,221,0.3)",
              animation: "fade-in 0.6s ease-out 0.5s both",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-[#FF00FF] animate-pulse" />
            <span className="text-white/70">Уже с нами:</span>
            <span className="font-oswald text-2xl font-bold text-[#FF00FF]">
              <AnimatedCounter target={187} />
            </span>
            <span className="text-white/70">топ-менеджеров</span>
          </div>

          {/* Logos carousel placeholder */}
          <div
            className="flex flex-wrap items-center justify-center gap-6 mb-10 opacity-50"
            style={{ animation: "fade-in 0.6s ease-out 0.6s both" }}
          >
            {["HAVAL", "GEELY", "CHANGAN", "HYUNDAI", "LADA", "EXEED"].map((brand) => (
              <span key={brand} className="font-oswald text-sm tracking-widest text-white/50 border border-white/10 px-4 py-2 rounded">
                {brand}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animation: "fade-in 0.6s ease-out 0.7s both" }}
          >
            <button
              onClick={() => scrollTo("#tickets")}
              className="px-10 py-4 font-oswald text-lg font-semibold tracking-wider rounded-full transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #9D4EDD, #FF00FF)",
                boxShadow: "0 0 40px rgba(255,0,255,0.35)",
              }}
            >
              КУПИТЬ БИЛЕТ
            </button>
            <button
              onClick={() => scrollTo("#for-partners")}
              className="px-10 py-4 font-oswald text-lg font-semibold tracking-wider rounded-full border-2 transition-all duration-300 hover:scale-105 hover:bg-[#9D4EDD]/10"
              style={{ borderColor: "#9D4EDD", color: "#9D4EDD" }}
            >
              СТАТЬ ПАРТНЁРОМ
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <Icon name="ChevronDown" size={24} color="white" />
        </div>
      </section>

      {/* ── BLOCK 1: ABOUT ── */}
      <section id="about" className="py-24 bg-[#0D0015]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#FF00FF] font-oswald tracking-widest text-sm uppercase">О конференции</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold mt-3 mb-6 uppercase">
                Первая в России конференция<br />
                <span style={{ color: "#9D4EDD" }}>по ИИ для автобизнеса</span>
              </h2>
              <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
                Однодневное событие для топ- и мидл-менеджмента автомобильных импортёров и дилеров.
                Очный формат с онлайн-трансляцией. 8 часов практики, кейсов и нетворкинга.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "Users", value: "500+", label: "Участников" },
              { icon: "Mic", value: "12+", label: "Спикеров" },
              { icon: "BookOpen", value: "4", label: "Трека" },
              { icon: "Clock", value: "8 ч", label: "Программы" },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div
                  className="text-center p-6 rounded-2xl border transition-all duration-300 hover:scale-105"
                  style={{ background: "rgba(157,78,221,0.05)", borderColor: "rgba(157,78,221,0.2)" }}
                >
                  <Icon name={stat.icon} size={32} className="mx-auto mb-3 text-[#9D4EDD]" />
                  <div className="font-oswald text-3xl font-bold text-[#FF00FF] mb-1">{stat.value}</div>
                  <div className="text-white/50 text-sm">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOCK 2: FOR WHOM ── */}
      <section id="for-whom" className="py-24" style={{ background: "#16213E" }}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#FF00FF] font-oswald tracking-widest text-sm uppercase">Аудитория</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold mt-3 uppercase">
                Кому это <span style={{ color: "#9D4EDD" }}>точно нужно</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ROLES.map((role, i) => (
              <Reveal key={role.title} delay={i * 0.1}>
                <div
                  className="group p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "rgba(45,0,75,0.4)",
                    borderColor: "rgba(157,78,221,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,0,255,0.5)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(255,0,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(157,78,221,0.2)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(157,78,221,0.15)", border: "1px solid rgba(157,78,221,0.3)" }}
                    >
                      <Icon name={role.icon} size={22} style={{ color: "#9D4EDD" }} />
                    </div>
                    <div>
                      <h3 className="font-oswald text-xl font-semibold mb-3 group-hover:text-[#FF00FF] transition-colors">
                        {role.title}
                      </h3>
                      <ul className="space-y-2">
                        {role.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2 text-white/60">
                            <span style={{ color: "#FF00FF", marginTop: "4px" }}>→</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOCK 3: PROGRAM ── */}
      <section id="program" className="py-24 bg-[#0D0015]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-[#FF00FF] font-oswald tracking-widest text-sm uppercase">2 апреля 2026</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold mt-3 mb-8 uppercase">
                Программа <span style={{ color: "#9D4EDD" }}>конференции</span>
              </h2>
              <button
                onClick={exportProgramDocx}
                className="inline-flex items-center gap-2 px-6 py-2.5 mb-8 rounded-full text-sm font-golos font-medium transition-all duration-200 hover:scale-105"
                style={{ background: "rgba(157,78,221,0.12)", border: "1px solid rgba(157,78,221,0.35)", color: "rgba(255,255,255,0.7)" }}
              >
                <Icon name="Download" size={15} />
                Скачать программу (.docx)
              </button>

              {/* Track filters */}
              <div className="flex flex-wrap justify-center gap-3">
                {TRACKS.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => setActiveTrack(track.id)}
                    className="px-5 py-2 rounded-full text-sm font-golos font-medium transition-all duration-200"
                    style={{
                      background: activeTrack === track.id ? "linear-gradient(135deg, #9D4EDD, #FF00FF)" : "rgba(157,78,221,0.1)",
                      color: activeTrack === track.id ? "white" : "rgba(255,255,255,0.6)",
                      border: activeTrack === track.id ? "none" : "1px solid rgba(157,78,221,0.25)",
                    }}
                  >
                    {track.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="space-y-2">
            {filteredProgram.map((item, i) => (
              <Reveal key={i} delay={Math.min(i * 0.03, 0.4)}>
                {item.type === "session" ? (
                  <div
                    className="px-6 py-4 rounded-xl mt-6"
                    style={{ background: "rgba(157,78,221,0.1)", borderLeft: `3px solid ${trackColor(item.track)}` }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-oswald text-sm tracking-wider text-white/40 min-w-[110px]">{item.time}</span>
                      <span className="font-oswald text-sm font-semibold tracking-wider" style={{ color: trackColor(item.track) }}>
                        {item.title}
                      </span>
                    </div>
                  </div>
                ) : item.type === "break" ? (
                  <div className="px-6 py-3 flex items-center gap-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <span className="font-oswald text-sm tracking-wider text-white/30 min-w-[110px]">{item.time}</span>
                    <span className="text-white/30 text-sm italic">{item.title}</span>
                  </div>
                ) : (
                  <div
                    className="px-6 py-4 rounded-xl border transition-all duration-200 hover:border-[#9D4EDD]/40 cursor-pointer group"
                    style={{ background: "rgba(45,0,75,0.2)", borderColor: "rgba(157,78,221,0.1)" }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                      <span className="font-oswald text-sm tracking-wider text-white/40 min-w-[110px]">{item.time}</span>
                      <div className="flex-1">
                        <p className="text-white/90 group-hover:text-white transition-colors">{item.title}</p>
                        {item.speaker && (
                          <p className="text-sm mt-1" style={{ color: "#9D4EDD" }}>
                            {item.speaker}{item.company ? ` — ${item.company}` : ""}
                          </p>
                        )}
                      </div>
                      {item.track && (
                        <span
                          className="text-xs px-3 py-1 rounded-full w-fit"
                          style={{ background: `${trackColor(item.track)}20`, color: trackColor(item.track), border: `1px solid ${trackColor(item.track)}40` }}
                        >
                          {TRACKS.find(t => t.id === item.track)?.label}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOCK 4: SPEAKERS ── */}
      <section id="speakers" className="py-24" style={{ background: "#16213E" }}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#FF00FF] font-oswald tracking-widest text-sm uppercase">Эксперты</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold mt-3 uppercase">
                Спикеры <span style={{ color: "#9D4EDD" }}>конференции</span>
              </h2>
            </div>
          </Reveal>

          <Reveal>
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(157,78,221,0.25)" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: "rgba(157,78,221,0.15)" }}>
                    <th className="text-left px-6 py-4 font-oswald text-sm tracking-widest uppercase text-white/50">Спикер</th>
                    <th className="text-left px-6 py-4 font-oswald text-sm tracking-widest uppercase text-white/50 hidden md:table-cell">Должность</th>
                    <th className="text-left px-6 py-4 font-oswald text-sm tracking-widest uppercase text-white/50">Компания</th>
                  </tr>
                </thead>
                <tbody>
                  {SPEAKERS.map((sp, i) => (
                    <tr
                      key={sp.name + i}
                      className="transition-colors duration-200 border-t"
                      style={{
                        borderColor: "rgba(157,78,221,0.1)",
                        background: i % 2 === 0 ? "rgba(13,0,21,0.4)" : "rgba(45,0,75,0.15)",
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-oswald font-bold text-xs text-white"
                            style={{ background: `linear-gradient(135deg, ${sp.color}80, ${sp.color}30)`, border: `1px solid ${sp.color}50` }}
                          >
                            {sp.initials}
                          </div>
                          <span className="font-golos font-medium text-white text-sm">{sp.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60 font-golos hidden md:table-cell">{sp.role}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-golos font-medium" style={{ color: sp.color }}>{sp.company}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BLOCK: TEAM ── */}
      <section id="team" className="py-24" style={{ background: "linear-gradient(180deg, #0D0015 0%, #1a002e 100%)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#FF00FF] font-oswald tracking-widest text-sm uppercase">Организаторы</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold mt-3 uppercase">
                Наша команда <span style={{ color: "#9D4EDD" }}>экспертов</span>
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-col gap-8">

            {/* ── Елена Ермакова ── */}
            <Reveal delay={0.1}>
              <div
                className="rounded-3xl border p-8 md:p-12"
                style={{
                  background: "rgba(45,0,75,0.3)",
                  borderColor: "rgba(157,78,221,0.25)",
                  boxShadow: "0 0 80px rgba(157,78,221,0.1)",
                }}
              >
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden" style={{ boxShadow: "0 0 40px rgba(157,78,221,0.4)" }}>
                      <img src="https://cdn.poehali.dev/projects/d4af42ec-5015-483c-b71c-6bf32723c131/bucket/7801ca27-6db1-4d84-9120-b618ccf95fe2.png" alt="Елена Ермакова" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-oswald text-xl font-bold uppercase">ЕЛЕНА ЕРМАКОВА</h3>
                      <p className="text-xs text-white/50 mt-1 font-golos leading-snug max-w-[180px]">Эксперт в автоиндустрии.<br />Управление программой внедрения</p>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Экспертиза</span></div>
                      <ul className="space-y-1.5 font-golos text-sm text-white/70">
                        {["Управление проектами и программами", "Организация тендерных закупок", "Бизнес-процессы дилера, дистрибьютора, автопроизводителя", "Операционная эффективность", "Разработка и внедрение стандартов обслуживания"].map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><span style={{ color: "#9D4EDD" }} className="mt-1 flex-shrink-0">▸</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Опыт</span></div>
                      <ul className="space-y-1.5 font-golos text-sm text-white/70">
                        {["15+ лет в автобизнесе", "Исполнительный директор АвтоСпецЦентр", "Директорские позиции в Hyundai Motor CIS", "FNGroup, СОЛЛЕРС"].map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><span style={{ color: "#9D4EDD" }} className="mt-1 flex-shrink-0">▸</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Достижения</span></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { num: "2.2×", label: "Рост рентабельности по EBITDA" },
                          { num: "−35%", label: "Прямые трудовые затраты в Валовой прибыли" },
                          { num: "−30%", label: "Эффект тендерных закупок в 1-й год" },
                          { num: "5×", label: "Масштабирование Hyundai Training Academy за 5 лет" },
                        ].map((a, i) => (
                          <div key={i} className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: "rgba(157,78,221,0.12)", border: "1px solid rgba(157,78,221,0.2)" }}>
                            <span className="font-oswald text-2xl font-bold" style={{ color: "#FF00FF" }}>{a.num}</span>
                            <span className="font-golos text-xs text-white/60 leading-snug">{a.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Квалификация</span></div>
                      <div className="flex flex-wrap gap-3 font-golos text-sm text-white/70">
                        <span className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,0,255,0.08)", border: "1px solid rgba(255,0,255,0.2)" }}>МГТУ им. Баумана, инженер-электроник</span>
                        <span className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,0,255,0.08)", border: "1px solid rgba(255,0,255,0.2)" }}>МГУ им. Ломоносова, психолог</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── Кирилл Лядов ── */}
            <Reveal delay={0.15}>
              <div
                className="rounded-3xl border p-8 md:p-12"
                style={{
                  background: "rgba(45,0,75,0.3)",
                  borderColor: "rgba(157,78,221,0.25)",
                  boxShadow: "0 0 80px rgba(157,78,221,0.1)",
                }}
              >
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden" style={{ boxShadow: "0 0 40px rgba(157,78,221,0.4)" }}>
                      <img src="https://cdn.poehali.dev/projects/d4af42ec-5015-483c-b71c-6bf32723c131/bucket/7804d044-b5cb-459a-9441-8f9cbae480ca.png" alt="Кирилл Лядов" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-oswald text-xl font-bold uppercase">КИРИЛЛ ЛЯДОВ</h3>
                      <p className="text-xs text-white/50 mt-1 font-golos leading-snug max-w-[180px]">Стратегия ИИ и разработка ИИ систем</p>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Экспертиза</span></div>
                      <ul className="space-y-1.5 font-golos text-sm text-white/70">
                        {["Стратегия и архитектура ИИ", "Выбор и внедрение ИИ платформ", "Качество и защита данных"].map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><span style={{ color: "#9D4EDD" }} className="mt-1 flex-shrink-0">▸</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Опыт</span></div>
                      <ul className="space-y-1.5 font-golos text-sm text-white/70">
                        {["10+ лет в компаниях Accenture, PWC, EY", "Управляет командами 100–200 человек"].map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><span style={{ color: "#9D4EDD" }} className="mt-1 flex-shrink-0">▸</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Достижения</span></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { num: "$200M+", label: "Экономический эффект для клиентов в РФ и на Ближнем Востоке" },
                          { num: "30+", label: "ИИ систем разработано и внедрено" },
                          { num: "+17%", label: "Рост маржи в e-commerce благодаря ИИ" },
                          { num: "−15%", label: "Снижение операционных затрат для добывающей компании" },
                        ].map((a, i) => (
                          <div key={i} className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: "rgba(157,78,221,0.12)", border: "1px solid rgba(157,78,221,0.2)" }}>
                            <span className="font-oswald text-2xl font-bold" style={{ color: "#FF00FF" }}>{a.num}</span>
                            <span className="font-golos text-xs text-white/60 leading-snug">{a.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Квалификация</span></div>
                      <div className="flex flex-wrap gap-3 font-golos text-sm text-white/70">
                        <span className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,0,255,0.08)", border: "1px solid rgba(255,0,255,0.2)" }}>Магистр, Информационные системы и ИИ, МИЭМ</span>
                        <span className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,0,255,0.08)", border: "1px solid rgba(255,0,255,0.2)" }}>CDMP</span>
                        <span className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,0,255,0.08)", border: "1px solid rgba(255,0,255,0.2)" }}>DipIFR ACCA</span>
                        <span className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,0,255,0.08)", border: "1px solid rgba(255,0,255,0.2)" }}>PMP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── Анастасия Емельянова ── */}
            <Reveal delay={0.15}>
              <div
                className="rounded-3xl border p-8 md:p-12"
                style={{
                  background: "rgba(45,0,75,0.3)",
                  borderColor: "rgba(157,78,221,0.25)",
                  boxShadow: "0 0 80px rgba(157,78,221,0.1)",
                }}
              >
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden" style={{ boxShadow: "0 0 40px rgba(157,78,221,0.4)" }}>
                      <img src="https://cdn.poehali.dev/projects/d4af42ec-5015-483c-b71c-6bf32723c131/bucket/14b04c74-239d-401b-b9e7-4fdd94af4ab7.png" alt="Анастасия Емельянова" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-oswald text-xl font-bold uppercase">АНАСТАСИЯ ЕМЕЛЬЯНОВА</h3>
                      <p className="text-xs text-white/50 mt-1 font-golos leading-snug max-w-[180px]">Эксперт в сфере обучения персонала и внедрения программ ИИ</p>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Экспертиза</span></div>
                      <ul className="space-y-1.5 font-golos text-sm text-white/70">
                        {[
                          "Стратегическое управление обучением (T&D): построение систем обучения с нуля",
                          "Управление end-to-end проектами: полный цикл от анализа до оценки по модели Киркпатрика",
                          "Гибридные и цифровые форматы: стриминги, вебинары, VR-тренажёры",
                          "Бизнес-партнёрство с ключевыми стейкхолдерами дилерской сети",
                          "Перевод сложных технических тем в доступные программы для линейного персонала",
                          "Оптимизация через стандартизацию: аудит процессов и создание стандартов работы",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><span style={{ color: "#9D4EDD" }} className="mt-1 flex-shrink-0">▸</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Опыт</span></div>
                      <ul className="space-y-1.5 font-golos text-sm text-white/70">
                        {["12+ лет в корпоративном обучении", "X5 Retail Group, Яндекс, Nissan Manufacturing Rus, McKinsey & Company", "Автомобильная отрасль, ритейл, IT", "Техническое и управленческое обучение"].map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><span style={{ color: "#9D4EDD" }} className="mt-1 flex-shrink-0">▸</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Достижения</span></div>
                      <ul className="space-y-1.5 font-golos text-sm text-white/70">
                        {[
                          "X5: стандарты АТП, система поддержки экспертов 24/7",
                          "Яндекс: NPS программ обучения 70–90%",
                          "Яндекс: оценка по Киркпатрику, подкаст для B2B-клиентов",
                          "Nissan: VR-обучение с удовлетворённостью 95%",
                          "Nissan: система сертификации руководителей",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><span style={{ color: "#9D4EDD" }} className="mt-1 flex-shrink-0">▸</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Квалификация</span></div>
                      <div className="flex flex-wrap gap-3 font-golos text-sm text-white/70">
                        <span className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,0,255,0.08)", border: "1px solid rgba(255,0,255,0.2)" }}>Digital-тренер и методолог</span>
                        <span className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,0,255,0.08)", border: "1px solid rgba(255,0,255,0.2)" }}>Сертифицированный бизнес-тренер</span>
                        <span className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,0,255,0.08)", border: "1px solid rgba(255,0,255,0.2)" }}>Английский язык C1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── Алексей Николаев ── */}
            <Reveal delay={0.15}>
              <div
                className="rounded-3xl border p-8 md:p-12"
                style={{
                  background: "rgba(45,0,75,0.3)",
                  borderColor: "rgba(157,78,221,0.25)",
                  boxShadow: "0 0 80px rgba(157,78,221,0.1)",
                }}
              >
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden" style={{ boxShadow: "0 0 40px rgba(157,78,221,0.4)" }}>
                      <img src="https://cdn.poehali.dev/projects/d4af42ec-5015-483c-b71c-6bf32723c131/bucket/ae10706c-5134-4ac0-b1f6-280942b17523.png" alt="Алексей Николаев" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-oswald text-xl font-bold uppercase">АЛЕКСЕЙ НИКОЛАЕВ</h3>
                      <p className="text-xs text-white/50 mt-1 font-golos leading-snug max-w-[180px]">Консультант для автодилеров по внедрению ИИ, бизнес-тренер</p>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Экспертиза</span></div>
                      <ul className="space-y-1.5 font-golos text-sm text-white/70">
                        {[
                          "Обучение сотрудников автодилеров от механиков до директоров",
                          "Аудит бизнеса автодилеров",
                          "Сертификация персонала автодилеров",
                          "Стратегия и архитектура ИИ",
                          "Выбор и внедрение ИИ инструментов, создание платформ",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><span style={{ color: "#9D4EDD" }} className="mt-1 flex-shrink-0">▸</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Опыт</span></div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                          { num: "25+", label: "лет в автобизнесе" },
                          { num: "4000+", label: "тренингов" },
                          { num: "26", label: "проектов цифровизации с ИИ" },
                        ].map((a, i) => (
                          <div key={i} className="rounded-xl px-3 py-2 text-center" style={{ background: "rgba(157,78,221,0.12)", border: "1px solid rgba(157,78,221,0.2)" }}>
                            <div className="font-oswald text-xl font-bold" style={{ color: "#FF00FF" }}>{a.num}</div>
                            <div className="font-golos text-xs text-white/50 leading-snug mt-1">{a.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Достижения</span></div>
                      <ul className="space-y-1.5 font-golos text-sm text-white/70">
                        {[
                          "Передал клиентам 49 автомобилей в месяц, обеспечил сток на 6 месяцев вперёд",
                          "Вывел сервисное подразделение в лидеры по NPS среди 236 предприятий бренда",
                          "Провёл более 4000 тренингов, обучил более 10 000 специалистов",
                          "Увеличил выручку сервиса на 20% за 1 месяц без финансовых вложений",
                          "Улучшил показатели маркетинга на 68% за счёт применения ИИ инструментов",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><span style={{ color: "#9D4EDD" }} className="mt-1 flex-shrink-0">▸</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Квалификация</span></div>
                      <div className="flex flex-wrap gap-3 font-golos text-sm text-white/70">
                        {["Инженер-механик", "Сертифицированный бизнес-тренер, аудитор, асессор", "Лучший продавец нескольких автомобильных брендов", "Специалист по ИИ"].map((q, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,0,255,0.08)", border: "1px solid rgba(255,0,255,0.2)" }}>{q}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── Иван Староастин ── */}
            <Reveal delay={0.15}>
              <div
                className="rounded-3xl border p-8 md:p-12"
                style={{
                  background: "rgba(45,0,75,0.3)",
                  borderColor: "rgba(157,78,221,0.25)",
                  boxShadow: "0 0 80px rgba(157,78,221,0.1)",
                }}
              >
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden" style={{ boxShadow: "0 0 40px rgba(157,78,221,0.4)" }}>
                      <img src="https://cdn.poehali.dev/projects/d4af42ec-5015-483c-b71c-6bf32723c131/bucket/f34f3f16-3893-4627-bd13-66e1d79615e4.png" alt="Иван Староастин" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-oswald text-xl font-bold uppercase">ИВАН СТАРОАСТИН</h3>
                      <p className="text-xs text-white/50 mt-1 font-golos leading-snug max-w-[180px]">Внедрение ИИ в бизнес-процессы</p>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Экспертиза</span></div>
                      <ul className="space-y-1.5 font-golos text-sm text-white/70">
                        {[
                          "ИИ-стратегия и архитектура применения ИИ",
                          "Внедрение ИИ в бизнес-процессы (AI-native processes)",
                          "Использование ИИ в регулируемой среде",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><span style={{ color: "#9D4EDD" }} className="mt-1 flex-shrink-0">▸</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Опыт</span></div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {[
                          { num: "15+", label: "лет в цифровых платформах" },
                          { num: "700+", label: "человек под управлением" },
                        ].map((a, i) => (
                          <div key={i} className="rounded-xl px-3 py-2 text-center" style={{ background: "rgba(157,78,221,0.12)", border: "1px solid rgba(157,78,221,0.2)" }}>
                            <div className="font-oswald text-xl font-bold" style={{ color: "#FF00FF" }}>{a.num}</div>
                            <div className="font-golos text-xs text-white/50 leading-snug mt-1">{a.label}</div>
                          </div>
                        ))}
                      </div>
                      <p className="font-golos text-xs text-white/50">Альфа, Сбер, ВТБ и другие крупнейшие компании</p>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Примеры проектов</span></div>
                      <ul className="space-y-1.5 font-golos text-sm text-white/70">
                        {[
                          "Внедрение ИИ-агентов в 90% внутренней разработки (100% кода и тестов) и перевод в полностью автоматический режим",
                          "Создание фабрики специализированных ИИ-агентов под задачу",
                          "Корпоративная Q&A-система по базе знаний с контролем качества ответов",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><span style={{ color: "#9D4EDD" }} className="mt-1 flex-shrink-0">▸</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background: "#FF00FF" }} /><span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#FF00FF" }}>Подход</span></div>
                      <p className="font-golos text-sm text-white/60 leading-relaxed">Диагностика процесса и ограничений → проектирование целевой схемы → запуск управляемого контура качества → передача с документацией и метриками</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── Инна Петухова ── */}
            <Reveal delay={0.15}>
              <div
                className="rounded-3xl border p-8 md:p-12"
                style={{
                  background: "rgba(45,0,75,0.3)",
                  borderColor: "rgba(157,78,221,0.25)",
                  boxShadow: "0 0 80px rgba(157,78,221,0.1)",
                }}
              >
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden" style={{ boxShadow: "0 0 40px rgba(157,78,221,0.4)" }}>
                      <img src="https://cdn.poehali.dev/projects/d4af42ec-5015-483c-b71c-6bf32723c131/bucket/3c31a22f-e25a-4095-b52f-743990fba8f0.png" alt="Инна Петухова" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-oswald text-xl font-bold uppercase">ИННА ПЕТУХОВА</h3>
                      <p className="text-xs text-white/50 mt-1 font-golos leading-snug max-w-[180px]">Генеральный директор Auto Business Consulting</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-6 justify-center">
                    <div
                      className="p-6 rounded-2xl"
                      style={{ background: "rgba(157,78,221,0.08)", border: "1px solid rgba(157,78,221,0.2)" }}
                    >
                      <p className="font-golos text-base text-white/80 leading-relaxed">
                        Инна Петухова — основатель и генеральный директор Auto Business Consulting. Эксперт в области стратегического развития автобизнеса, организации конференций и внедрения ИИ-решений в автомобильной индустрии.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a href="mailto:Inna.Petuhova@autobisconsult.ru" className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-golos text-sm transition-all hover:scale-105" style={{ background: "rgba(157,78,221,0.12)", border: "1px solid rgba(157,78,221,0.3)", color: "#9D4EDD" }}>
                        <Icon name="Mail" size={15} />
                        Inna.Petuhova@autobisconsult.ru
                      </a>
                      <a href="tel:+79852320005" className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-golos text-sm transition-all hover:scale-105" style={{ background: "rgba(157,78,221,0.12)", border: "1px solid rgba(157,78,221,0.3)", color: "#9D4EDD" }}>
                        <Icon name="Phone" size={15} />
                        +7 985 232-00-05
                      </a>
                      <a href="https://t.me/abc_cons" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-golos text-sm transition-all hover:scale-105" style={{ background: "rgba(157,78,221,0.12)", border: "1px solid rgba(157,78,221,0.3)", color: "#9D4EDD" }}>
                        <Icon name="Send" size={15} />
                        @abc_cons
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ── BLOCK 5: TICKETS ── */}
      <section id="tickets" className="py-24 bg-[#0D0015]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#FF00FF] font-oswald tracking-widest text-sm uppercase">Регистрация</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold mt-3 uppercase">
                Выберите <span style={{ color: "#9D4EDD" }}>ваш билет</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {TICKETS.map((ticket, i) => (
              <Reveal key={ticket.id} delay={i * 0.1}>
                <div
                  className="relative rounded-2xl border p-6 flex flex-col h-full transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: ticket.highlight
                      ? "linear-gradient(135deg, rgba(157,78,221,0.2), rgba(255,0,255,0.1))"
                      : "rgba(45,0,75,0.3)",
                    borderColor: ticket.highlight ? "#FF00FF" : "rgba(157,78,221,0.2)",
                    boxShadow: ticket.highlight ? "0 0 40px rgba(255,0,255,0.15)" : "none",
                  }}
                >
                  {ticket.badge && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-oswald font-semibold whitespace-nowrap"
                      style={{
                        background: ticket.highlight ? "linear-gradient(135deg, #9D4EDD, #FF00FF)" : "rgba(157,78,221,0.3)",
                        border: ticket.highlight ? "none" : "1px solid rgba(157,78,221,0.4)",
                      }}
                    >
                      {ticket.badge}
                    </div>
                  )}

                  <h3 className="font-oswald text-lg font-semibold mt-2 mb-3">{ticket.title}</h3>
                  <div className="font-oswald text-3xl font-bold mb-5" style={{ color: ticket.highlight ? "#FF00FF" : "#9D4EDD" }}>
                    {ticket.price}
                  </div>

                  <ul className="space-y-2 flex-1 mb-6">
                    {ticket.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                        <Icon name="Check" size={14} style={{ color: "#9D4EDD", marginTop: "3px", flexShrink: 0 }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {ticket.note && (
                    <p className="text-xs text-white/30 mb-3 italic">{ticket.note}</p>
                  )}

                  <button
                    onClick={() => setActiveTicket(ticket)}
                    className="w-full py-3 font-oswald text-sm font-semibold tracking-wider rounded-full transition-all duration-200 hover:scale-105"
                    style={{
                      background: ticket.btnStyle === "neon"
                        ? "linear-gradient(135deg, #9D4EDD, #FF00FF)"
                        : ticket.btnStyle === "violet"
                          ? "rgba(157,78,221,0.2)"
                          : "transparent",
                      border: ticket.btnStyle !== "neon" ? "1px solid rgba(157,78,221,0.4)" : "none",
                      boxShadow: ticket.btnStyle === "neon" ? "0 0 20px rgba(255,0,255,0.3)" : "none",
                    }}
                  >
                    {ticket.btnLabel}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Extra options */}
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border flex items-center gap-4" style={{ background: "rgba(45,0,75,0.2)", borderColor: "rgba(157,78,221,0.2)" }}>
                <Icon name="Monitor" size={28} style={{ color: "#9D4EDD", flexShrink: 0 }} />
                <div>
                  <p className="font-oswald font-semibold">Онлайн-участие (трансляция)</p>
                  <p className="text-[#FF00FF] font-oswald text-xl font-bold">5 000 ₽</p>
                  <p className="text-white/40 text-xs mt-1">Доступ ко всем сессиям онлайн</p>
                </div>
                <button
                  onClick={() => setActiveTicket({
                    id: "online",
                    title: "Онлайн-участие (трансляция)",
                    price: "5 000 ₽",
                    badge: null,
                    features: ["Доступ ко всем сессиям онлайн", "Запись конференции", "Презентации спикеров"],
                    btnLabel: "Купить",
                    btnStyle: "violet",
                    note: null,
                    highlight: false,
                  })}
                  className="ml-auto px-5 py-2 rounded-full text-sm font-oswald font-semibold border border-[#9D4EDD]/40 hover:bg-[#9D4EDD]/10 transition-colors whitespace-nowrap"
                >
                  Купить
                </button>
              </div>
              <div className="p-6 rounded-2xl border flex items-center gap-4" style={{ background: "rgba(45,0,75,0.2)", borderColor: "rgba(157,78,221,0.2)" }}>
                <Icon name="Building2" size={28} style={{ color: "#9D4EDD", flexShrink: 0 }} />
                <div>
                  <p className="font-oswald font-semibold">Корпоративная заявка</p>
                  <p className="text-[#FF00FF] font-oswald text-xl font-bold">от 5 человек</p>
                  <p className="text-white/40 text-xs mt-1">Специальные условия — напишите нам</p>
                </div>
                <button
                  onClick={() => scrollTo("#contacts")}
                  className="ml-auto px-5 py-2 rounded-full text-sm font-oswald font-semibold border border-[#9D4EDD]/40 hover:bg-[#9D4EDD]/10 transition-colors whitespace-nowrap"
                >
                  Связаться
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BLOCK 6: FOR SPEAKERS ── */}
      <section id="for-speakers" className="py-24" style={{ background: "#16213E" }}>
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-[#FF00FF] font-oswald tracking-widest text-sm uppercase">Спикеры</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold mt-3 uppercase">
                Хотите <span style={{ color: "#9D4EDD" }}>выступить?</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto mt-4 leading-relaxed">
                Мы открыты к предложениям от экспертов-практиков с реальными кейсами внедрения ИИ в автобизнесе.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: "Clock3", title: "Формат", text: "20–30 мин. выступление + 10 мин. вопросы" },
              { icon: "Target", title: "Тема", text: "Один из треков: продажи, сервис, маркетинг, ИТ/HR" },
              { icon: "BarChart", title: "Требования", text: "Измеримые результаты в кейсе обязательны" },
            ].map((item) => (
              <Reveal key={item.title}>
                <div className="p-5 rounded-xl border text-center" style={{ background: "rgba(45,0,75,0.3)", borderColor: "rgba(157,78,221,0.2)" }}>
                  <Icon name={item.icon} size={28} className="mx-auto mb-3" style={{ color: "#9D4EDD" }} />
                  <p className="font-oswald font-semibold mb-1">{item.title}</p>
                  <p className="text-white/50 text-sm">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div
              className="rounded-2xl border p-8"
              style={{ background: "rgba(45,0,75,0.3)", borderColor: "rgba(157,78,221,0.2)" }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Icon name="AlertCircle" size={16} style={{ color: "#FF00FF" }} />
                <span className="text-[#FF00FF] text-sm">Дедлайн подачи заявок: 1 февраля 2026</span>
              </div>

              {speakerSent ? (
                <div className="text-center py-8">
                  <Icon name="CheckCircle" size={48} className="mx-auto mb-4" style={{ color: "#9D4EDD" }} />
                  <h3 className="font-oswald text-2xl font-bold mb-2">Заявка отправлена!</h3>
                  <p className="text-white/60">Мы свяжемся с вами в ближайшее время.</p>
                </div>
              ) : (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); setSpeakerSent(true); }}>
                  {[
                    { key: "name", label: "Имя и фамилия", placeholder: "Иван Петров" },
                    { key: "company", label: "Компания", placeholder: "Название компании" },
                    { key: "role", label: "Должность", placeholder: "Директор по продажам" },
                    { key: "topic", label: "Тема выступления", placeholder: "Как мы внедрили ИИ в колл-центр" },
                    { key: "link", label: "LinkedIn / сайт", placeholder: "https://..." },
                    { key: "email", label: "Email для связи", placeholder: "ivan@company.ru" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm text-white/50 mb-2">{field.label}</label>
                      <input
                        type={field.key === "email" ? "email" : "text"}
                        placeholder={field.placeholder}
                        value={speakerFormData[field.key as keyof typeof speakerFormData]}
                        onChange={(e) => setSpeakerFormData({ ...speakerFormData, [field.key]: e.target.value })}
                        className="w-full bg-[#0D0015]/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[#9D4EDD]"
                        style={{ borderColor: "rgba(157,78,221,0.2)" }}
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-white/50 mb-2">Краткое описание (3–5 предложений)</label>
                    <textarea
                      rows={3}
                      placeholder="Опишите суть вашего кейса и ключевые результаты..."
                      value={speakerFormData.description}
                      onChange={(e) => setSpeakerFormData({ ...speakerFormData, description: e.target.value })}
                      className="w-full bg-[#0D0015]/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[#9D4EDD] resize-none"
                      style={{ borderColor: "rgba(157,78,221,0.2)" }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-4 font-oswald text-base font-semibold tracking-wider rounded-full transition-all duration-200 hover:scale-[1.02]"
                      style={{ background: "linear-gradient(135deg, #9D4EDD, #FF00FF)", boxShadow: "0 0 30px rgba(255,0,255,0.2)" }}
                    >
                      ОТПРАВИТЬ ЗАЯВКУ
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-[#9D4EDD]/10 flex flex-wrap gap-6 text-sm text-white/40">
                <span>Программный директор:</span>
                <span>[Имя], <a href="mailto:program@aiauto2026.ru" className="hover:text-[#FF00FF] transition-colors">program@aiauto2026.ru</a></span>
                <a href="https://t.me/+QgiLIa1gFRY4Y2Iy" target="_blank" rel="noreferrer" className="hover:text-[#FF00FF] transition-colors">Telegram</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BLOCK 7: FOR PARTNERS ── */}
      <section id="for-partners" className="py-24 bg-[#0D0015]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-6">
              <span className="text-[#FF00FF] font-oswald tracking-widest text-sm uppercase">Партнёрство</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold mt-3 uppercase">
                Станьте партнёром <span style={{ color: "#9D4EDD" }}>конференции</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto mt-4 text-lg">
                Достигните топ-менеджмента крупнейших автомобильных компаний России.
                <br />Аудитория конференции — <span className="text-[#FF00FF] font-semibold">300+ лиц, принимающих решения</span>.
              </p>
            </div>
          </Reveal>

          {/* Sponsor packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-12">
            {PARTNER_PACKAGES.map((pkg, i) => (
              <Reveal key={pkg.title} delay={i * 0.1}>
                <div
                  className="relative rounded-2xl border p-8 h-full flex flex-col transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: pkg.glow
                      ? "linear-gradient(135deg, rgba(255,0,255,0.08), rgba(45,0,75,0.6))"
                      : "rgba(45,0,75,0.3)",
                    borderColor: `${pkg.color}50`,
                    boxShadow: pkg.glow ? `0 0 50px ${pkg.color}25` : "none",
                  }}
                >
                  {pkg.glow && (
                    <div
                      className="absolute -top-px left-0 right-0 h-0.5 rounded-t-2xl"
                      style={{ background: `linear-gradient(90deg, transparent, ${pkg.color}, transparent)` }}
                    />
                  )}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-oswald text-xl font-bold" style={{ color: pkg.color }}>{pkg.title}</h3>
                      <span className="text-white/40 text-xs">{pkg.slots}</span>
                    </div>
                    <span
                      className="px-4 py-1 rounded-full text-sm font-oswald font-semibold"
                      style={{ background: `${pkg.color}20`, color: pkg.color, border: `1px solid ${pkg.color}40` }}
                    >
                      {pkg.price}
                    </span>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {pkg.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3 text-sm text-white/70">
                        <Icon name="Check" size={14} style={{ color: pkg.color, marginTop: "3px", flexShrink: 0 }} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => scrollTo("#contacts")}
                    className="mt-8 w-full py-3 font-oswald text-sm font-semibold tracking-wider rounded-full border transition-all duration-200 hover:scale-105"
                    style={{
                      borderColor: `${pkg.color}60`,
                      color: pkg.color,
                      background: pkg.glow ? `${pkg.color}10` : "transparent",
                    }}
                  >
                    Обсудить условия
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Download mediakit */}
          <Reveal>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <a
                href="#"
                className="inline-flex items-center gap-3 px-8 py-4 font-oswald text-base font-semibold tracking-wider rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #9D4EDD, #FF00FF)",
                  boxShadow: "0 0 30px rgba(255,0,255,0.25)",
                }}
              >
                <Icon name="Download" size={18} />
                СКАЧАТЬ МЕДИАКИТ (PDF)
              </a>
              <p className="text-white/40 text-sm">Подробные условия, аудитория, форматы размещения</p>
            </div>
          </Reveal>

          {/* Partner inquiry form */}
          <Reveal>
            <div className="rounded-2xl border p-8" style={{ background: "rgba(45,0,75,0.2)", borderColor: "rgba(157,78,221,0.2)" }}>
              <h3 className="font-oswald text-2xl font-bold mb-1">Заявка на партнёрство</h3>
              <p className="text-white/50 mb-6 text-sm">Оставьте контакты — ответим в течение 24 часов</p>
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl" style={{ background: "rgba(157,78,221,0.08)", border: "1px solid rgba(157,78,221,0.2)" }}>
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(157,78,221,0.4)", boxShadow: "0 0 16px rgba(157,78,221,0.25)" }}>
                  <img src="https://cdn.poehali.dev/projects/d4af42ec-5015-483c-b71c-6bf32723c131/bucket/3c31a22f-e25a-4095-b52f-743990fba8f0.png" alt="Инна Петухова" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-oswald text-base font-bold">Инна Петухова</p>
                  <p className="text-white/40 text-xs mb-1">Генеральный директор ABC</p>
                  <div className="flex flex-wrap gap-3 text-xs text-white/50">
                    <a href="tel:+79852320005" className="text-[#9D4EDD] hover:text-[#FF00FF] transition-colors">+7 985 232-00-05</a>
                    <span>·</span>
                    <a href="mailto:Inna.Petuhova@autobisconsult.ru" className="text-[#9D4EDD] hover:text-[#FF00FF] transition-colors">Inna.Petuhova@autobisconsult.ru</a>
                  </div>
                </div>
              </div>

              {partnerSent ? (
                <div className="text-center py-10">
                  <Icon name="CheckCircle" size={52} className="mx-auto mb-4" style={{ color: "#9D4EDD" }} />
                  <h3 className="font-oswald text-2xl font-bold mb-2">Заявка получена!</h3>
                  <p className="text-white/60">Вышлем медиакит и позвоним в течение 24 часов.</p>
                </div>
              ) : (
                <form
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  onSubmit={(e) => { e.preventDefault(); setPartnerSent(true); }}
                >
                  {[
                    { key: "company", label: "Компания", placeholder: "Название компании" },
                    { key: "name", label: "Контактное лицо", placeholder: "Имя и фамилия" },
                    { key: "role", label: "Должность", placeholder: "Директор по маркетингу" },
                    { key: "email", label: "Email", placeholder: "marketing@company.ru" },
                    { key: "phone", label: "Телефон", placeholder: "+7 (xxx) xxx-xx-xx" },
                    { key: "package", label: "Интересующий пакет", placeholder: "Генеральный / Информационный" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm text-white/50 mb-2">{field.label}</label>
                      <input
                        type={field.key === "email" ? "email" : "text"}
                        placeholder={field.placeholder}
                        value={partnerFormData[field.key as keyof typeof partnerFormData]}
                        onChange={(e) => setPartnerFormData({ ...partnerFormData, [field.key]: e.target.value })}
                        className="w-full bg-[#0D0015]/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[#9D4EDD]"
                        style={{ borderColor: "rgba(157,78,221,0.2)" }}
                      />
                    </div>
                  ))}
                  <div className="md:col-span-3">
                    <button
                      type="submit"
                      className="px-10 py-4 font-oswald text-base font-semibold tracking-wider rounded-full transition-all duration-200 hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #9D4EDD, #FF00FF)", boxShadow: "0 0 30px rgba(255,0,255,0.2)" }}
                    >
                      ОТПРАВИТЬ ЗАЯВКУ
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BLOCK 8: CONTACTS & ORGANIZERS ── */}
      <section id="contacts" className="py-24" style={{ background: "#16213E" }}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#FF00FF] font-oswald tracking-widest text-sm uppercase">Оргкомитет</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold mt-3 uppercase">
                Организационный <span style={{ color: "#9D4EDD" }}>комитет</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact info */}
            <Reveal>
              <div className="space-y-6">
                <h3 className="font-oswald text-2xl font-semibold mb-6">Контакты</h3>

                {[
                  { icon: "Mail", label: "Электронная почта", value: "Inna.Petuhova@autobisconsult.ru", href: "mailto:Inna.Petuhova@autobisconsult.ru" },
                  { icon: "Globe", label: "Сайт", value: "a-b-c.su", href: "https://a-b-c.su/" },
                  { icon: "Send", label: "Telegram", value: "@abc_cons", href: "https://t.me/abc_cons" },
                  { icon: "Phone", label: "Телефон (10:00–19:00)", value: "+7 985 232-00-05", href: "tel:+79852320005" },
                ].map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:border-[#9D4EDD]/50 hover:scale-[1.02] group"
                    style={{ background: "rgba(45,0,75,0.3)", borderColor: "rgba(157,78,221,0.15)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(157,78,221,0.15)" }}
                    >
                      <Icon name={c.icon} size={18} style={{ color: "#9D4EDD" }} />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">{c.label}</p>
                      <p className="font-golos font-medium text-sm group-hover:text-[#FF00FF] transition-colors">{c.value}</p>
                    </div>
                  </a>
                ))}

                {/* Organizer block */}
                <div
                  className="mt-8 p-6 rounded-xl border"
                  style={{ background: "rgba(45,0,75,0.2)", borderColor: "rgba(157,78,221,0.15)" }}
                >
                  <p className="text-white/40 text-xs mb-4 uppercase tracking-widest">Организатор</p>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(157,78,221,0.4)", boxShadow: "0 0 20px rgba(157,78,221,0.2)" }}>
                      <img src="https://cdn.poehali.dev/projects/d4af42ec-5015-483c-b71c-6bf32723c131/bucket/89cbe04c-606a-4f61-b2b5-f181b33d8fa6.png" alt="Auto Business Consulting" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-oswald text-lg font-bold">Auto Business Consulting</p>
                      <a href="https://a-b-c.su/" target="_blank" rel="noreferrer" className="text-[#9D4EDD] text-sm hover:text-[#FF00FF] transition-colors">Перейти на сайт →</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "rgba(157,78,221,0.15)" }}>
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(157,78,221,0.35)", boxShadow: "0 0 12px rgba(157,78,221,0.2)" }}>
                      <img src="https://cdn.poehali.dev/projects/d4af42ec-5015-483c-b71c-6bf32723c131/bucket/3c31a22f-e25a-4095-b52f-743990fba8f0.png" alt="Инна Петухова" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-oswald text-sm font-bold">Инна Петухова</p>
                      <p className="text-white/40 text-xs">Генеральный директор ABC</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Contact form */}
            <Reveal delay={0.15}>
              <div className="rounded-2xl border p-8" style={{ background: "rgba(45,0,75,0.3)", borderColor: "rgba(157,78,221,0.2)" }}>
                <h3 className="font-oswald text-2xl font-semibold mb-6">Форма обратной связи</h3>

                {contactSent ? (
                  <div className="text-center py-12">
                    <Icon name="CheckCircle" size={52} className="mx-auto mb-4" style={{ color: "#9D4EDD" }} />
                    <h3 className="font-oswald text-2xl font-bold mb-2">Сообщение отправлено!</h3>
                    <p className="text-white/60">Ответим в ближайшее время.</p>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setContactSent(true); }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/50 mb-2">Имя</label>
                        <input
                          type="text"
                          placeholder="Иван Петров"
                          value={contactFormData.name}
                          onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                          className="w-full bg-[#0D0015]/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[#9D4EDD]"
                          style={{ borderColor: "rgba(157,78,221,0.2)" }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/50 mb-2">Email</label>
                        <input
                          type="email"
                          placeholder="ivan@company.ru"
                          value={contactFormData.email}
                          onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                          className="w-full bg-[#0D0015]/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[#9D4EDD]"
                          style={{ borderColor: "rgba(157,78,221,0.2)" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-white/50 mb-2">Тема</label>
                      <select
                        value={contactFormData.subject}
                        onChange={(e) => setContactFormData({ ...contactFormData, subject: e.target.value })}
                        className="w-full bg-[#0D0015] border rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#9D4EDD] appearance-none"
                        style={{ borderColor: "rgba(157,78,221,0.2)" }}
                      >
                        <option value="" style={{ background: "#0D0015" }}>Выберите тему</option>
                        <option value="tickets" style={{ background: "#0D0015" }}>Вопрос о билетах</option>
                        <option value="speaker" style={{ background: "#0D0015" }}>Предложение стать спикером</option>
                        <option value="partner" style={{ background: "#0D0015" }}>Предложение о партнёрстве</option>
                        <option value="other" style={{ background: "#0D0015" }}>Другое</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-white/50 mb-2">Сообщение</label>
                      <textarea
                        rows={4}
                        placeholder="Ваш вопрос или сообщение..."
                        value={contactFormData.message}
                        onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                        className="w-full bg-[#0D0015]/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[#9D4EDD] resize-none"
                        style={{ borderColor: "rgba(157,78,221,0.2)" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 font-oswald text-base font-semibold tracking-wider rounded-full transition-all duration-200 hover:scale-[1.02]"
                      style={{ background: "linear-gradient(135deg, #9D4EDD, #FF00FF)", boxShadow: "0 0 30px rgba(255,0,255,0.2)" }}
                    >
                      ОТПРАВИТЬ
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>

          {/* CTA banner */}
          <Reveal>
            <div
              className="mt-16 p-10 rounded-3xl text-center"
              style={{
                background: "linear-gradient(135deg, rgba(157,78,221,0.15), rgba(255,0,255,0.05))",
                border: "1px solid rgba(255,0,255,0.2)",
                boxShadow: "0 0 60px rgba(157,78,221,0.1)",
              }}
            >
              <h3 className="font-oswald text-3xl md:text-4xl font-bold mb-4 uppercase">
                Место за столом<br />
                <span style={{ color: "#FF00FF" }}>уже ждёт вас</span>
              </h3>
              <p className="text-white/50 mb-8">2 апреля 2026 • Москва • 10:00 – 20:00</p>
              <button
                onClick={() => scrollTo("#tickets")}
                className="px-12 py-4 font-oswald text-lg font-semibold tracking-wider rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #9D4EDD, #FF00FF)",
                  boxShadow: "0 0 40px rgba(255,0,255,0.35)",
                }}
              >
                ЗАРЕГИСТРИРОВАТЬСЯ
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 border-t" style={{ borderColor: "rgba(157,78,221,0.15)", background: "#0D0015" }}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Top row */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="font-oswald text-2xl font-bold tracking-widest mb-3" style={{ textShadow: "0 0 20px rgba(255,0,255,0.3)" }}>
                ИИ В АВТО <span style={{ color: "#FF00FF" }}>2.0</span>
              </div>
              <p className="text-white/30 text-sm max-w-xs leading-relaxed">
                Конференция по внедрению ИИ в бизнес-процессы автомобильных компаний. 2 апреля 2026, Москва.
              </p>
              {/* Organizer logo */}
              <div className="mt-4 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ border: "1px solid rgba(157,78,221,0.3)" }}
                >
                  <img
                    src="https://cdn.poehali.dev/projects/d4af42ec-5015-483c-b71c-6bf32723c131/bucket/89cbe04c-606a-4f61-b2b5-f181b33d8fa6.png"
                    alt="ABC"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white/30 text-xs">Auto Business Consulting</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <p className="font-oswald text-xs tracking-widest text-white/30 uppercase mb-4">Навигация</p>
                <ul className="space-y-2">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <button
                        onClick={() => scrollTo(link.href)}
                        className="text-xs text-white/40 hover:text-[#FF00FF] transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-oswald text-xs tracking-widest text-white/30 uppercase mb-4">Контакты</p>
                <ul className="space-y-2 text-xs text-white/40">
                  <li><a href="mailto:Inna.Petuhova@autobisconsult.ru" className="hover:text-[#FF00FF] transition-colors">Inna.Petuhova@autobisconsult.ru</a></li>
                  <li><a href="https://t.me/abc_cons" target="_blank" rel="noreferrer" className="hover:text-[#FF00FF] transition-colors">Telegram</a></li>
                  <li><a href="https://a-b-c.su/" target="_blank" rel="noreferrer" className="hover:text-[#FF00FF] transition-colors">a-b-c.su</a></li>
                </ul>
              </div>

              <div>
                <p className="font-oswald text-xs tracking-widest text-white/30 uppercase mb-4">Документы</p>
                <ul className="space-y-2 text-xs text-white/40">
                  <li><a href="#" className="hover:text-[#FF00FF] transition-colors">Политика конфиденциальности</a></li>
                  <li><a href="#" className="hover:text-[#FF00FF] transition-colors">Медиакит для партнёров (PDF)</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div
            className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderColor: "rgba(157,78,221,0.1)" }}
          >
            <p className="text-white/20 text-xs">© 2026 Конференция по ИИ в автобизнесе. Все права защищены.</p>
            <div className="flex items-center gap-4">
              <a
                href="https://t.me/abc_cons"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:border-[#FF00FF] hover:scale-110"
                style={{ borderColor: "rgba(157,78,221,0.3)" }}
              >
                <Icon name="Send" size={14} style={{ color: "#9D4EDD" }} />
              </a>
              <a
                href="https://a-b-c.su/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:border-[#FF00FF] hover:scale-110"
                style={{ borderColor: "rgba(157,78,221,0.3)" }}
              >
                <Icon name="Globe" size={14} style={{ color: "#9D4EDD" }} />
              </a>
              <button
                onClick={() => scrollTo("#tickets")}
                className="px-5 py-2 font-oswald text-xs font-semibold tracking-wider rounded-full transition-all duration-200 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #9D4EDD, #FF00FF)", boxShadow: "0 0 15px rgba(255,0,255,0.2)" }}
              >
                КУПИТЬ БИЛЕТ
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}