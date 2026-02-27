import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  ShadingType,
} from "docx";
import { saveAs } from "file-saver";

const PROGRAM = [
  { time: "09:30 – 10:00", type: "break", title: "Регистрация, приветственный кофе", speaker: null, company: null },
  { time: "10:00 – 12:30", type: "session", title: "СЕССИЯ 1: ИИ НА ФРОНТЕ: КЛИЕНТСКИЙ ОПЫТ И ПРОДАЖИ", speaker: null, company: null },
  { time: "10:00 – 10:30", type: "talk", title: "Основные системные ошибки и смена парадигмы", speaker: "Александр Петров", company: "CTO, Чанган Моторс Россия" },
  { time: "10:30 – 11:00", type: "talk", title: "Цифровизация и клиентские ожидания поколения Z", speaker: "Мария Иванова", company: "Директор по ИИ, Джили Мотор" },
  { time: "11:00 – 11:30", type: "talk", title: "Чат-боты, которые действительно продают: кейс роста конверсии на 34%", speaker: "Дмитрий Соколов", company: "Вице-президент по инновациям, HAVAL" },
  { time: "11:30 – 12:00", type: "talk", title: "Генеративный ИИ для персонализированных предложений", speaker: "Елена Волкова", company: "Руководитель цифровизации, Hyundai Motor CIS" },
  { time: "12:00 – 12:30", type: "panel", title: "Панельная дискуссия: Ошибки традиционных дилеров и действия лидеров рынка", speaker: null, company: null },
  { time: "12:30 – 13:30", type: "break", title: "Обед и нетворкинг", speaker: null, company: null },
  { time: "13:30 – 15:30", type: "session", title: "СЕССИЯ 2: ИИ В СЕРВИСЕ: ЭФФЕКТИВНОСТЬ И ЛОЯЛЬНОСТЬ", speaker: null, company: null },
  { time: "13:30 – 14:00", type: "talk", title: "Почему сервис важнее продаж: новая экономика дилера", speaker: "Алексей Кузнецов", company: "Директор сервисного департамента" },
  { time: "14:00 – 14:30", type: "talk", title: "Предиктивный сервис: как предсказать поломку до клиента", speaker: "Спикер уточняется", company: "" },
  { time: "14:30 – 15:00", type: "talk", title: "ИИ для управления запасными частями: снижение остатков и простоев", speaker: "Спикер уточняется", company: "" },
  { time: "15:00 – 15:30", type: "talk", title: "Апсейл как ключевой инструмент: как ИИ подсказывает доппродажи", speaker: "Спикер уточняется", company: "" },
  { time: "15:30 – 17:00", type: "session", title: "СЕССИЯ 3: ВНУТРЕННЯЯ КУХНЯ: HR, МАРКЕТИНГ, БЕЗОПАСНОСТЬ", speaker: null, company: null },
  { time: "15:30 – 16:00", type: "talk", title: "Маркетинг 6.0: от массовых рассылок к иммерсивному опыту", speaker: "Кира Волкова", company: "Маркетолог-стратег" },
  { time: "16:00 – 16:30", type: "talk", title: "ИИ-ассистенты для onboarding и обучения сотрудников", speaker: "Спикер уточняется", company: "" },
  { time: "16:30 – 17:00", type: "talk", title: "Анализ тональности обращений в КСО: как сохранить репутацию", speaker: "Спикер уточняется", company: "" },
  { time: "17:00 – 17:45", type: "session", title: "СЕССИЯ 4: ВНЕДРЕНИЕ ИИ: С ЧЕГО НАЧАТЬ?", speaker: null, company: null },
  { time: "17:00 – 17:45", type: "workshop", title: "Формат «Делай как я» — готовые фреймворки, шаблоны промптов, дорожные карты", speaker: "Эксперты-практики (2–3 человека)", company: "" },
  { time: "17:45 – 18:00", type: "panel", title: "Заключительное слово и розыгрыш", speaker: null, company: null },
  { time: "18:00 – 20:00", type: "break", title: "Фуршет, неформальное общение, нетворкинг", speaker: null, company: null },
];

const COLORS = {
  session: "4A0080",
  break: "2D2D2D",
  talk: "FFFFFF",
  panel: "F5F0FF",
  workshop: "FFF5E6",
  header: "6B00CC",
};

const noBorder = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

function makeRow(item: typeof PROGRAM[0]): TableRow {
  const isSession = item.type === "session";
  const isBreak = item.type === "break";
  const isDark = isSession || isBreak;

  const bgColor = isSession ? COLORS.session : isBreak ? COLORS.break : item.type === "panel" ? "EDE7F6" : item.type === "workshop" ? "FFF3E0" : "FFFFFF";
  const textColor = isDark ? "FFFFFF" : "1A1A2E";
  const timeColor = isDark ? "DDBBFF" : "7B2FBE";

  const speakerLines: TextRun[] = [];
  if (item.speaker) {
    speakerLines.push(
      new TextRun({ text: "", break: 1 }),
      new TextRun({ text: item.speaker, bold: true, size: 18, color: "7B2FBE" }),
    );
    if (item.company) {
      speakerLines.push(
        new TextRun({ text: "  " + item.company, size: 16, color: "888888" }),
      );
    }
  }

  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2000, type: WidthType.DXA },
        borders: noBorder,
        shading: { type: ShadingType.SOLID, color: bgColor },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({
                text: item.time,
                bold: true,
                size: isSession ? 18 : 17,
                color: timeColor,
                font: "Arial",
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 7500, type: WidthType.DXA },
        borders: noBorder,
        shading: { type: ShadingType.SOLID, color: bgColor },
        children: [
          new Paragraph({
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({
                text: item.title,
                bold: isSession || isBreak,
                size: isSession ? 20 : 18,
                color: textColor,
                font: "Arial",
              }),
              ...speakerLines,
            ],
          }),
        ],
      }),
    ],
  });
}

export async function exportProgramDocx() {
  const rows = PROGRAM.map(makeRow);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 },
          },
        },
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "ИИ В АВТОБИЗНЕСЕ 2025",
                bold: true,
                size: 40,
                color: COLORS.header,
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: "Программа конференции",
                size: 26,
                color: "555555",
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: "Москва • 2025",
                size: 22,
                color: "999999",
                font: "Arial",
                italics: true,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows,
          }),
          new Paragraph({
            spacing: { before: 400 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "ai-auto.ru  •  info@ai-auto.ru",
                size: 18,
                color: "AAAAAA",
                font: "Arial",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Программа_конференции_ИИ_в_автобизнесе_2025.docx");
}
