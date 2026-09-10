const PALETTES: [string, string][] = [
  ["#6c5ce7", "#a29bfe"],
  ["#ff5a72", "#ff9a8b"],
  ["#00b894", "#55efc4"],
  ["#0984e3", "#74b9ff"],
  ["#e17055", "#fab1a0"],
  ["#e84393", "#fd79a8"],
  ["#00cec9", "#81ecec"],
  ["#fdcb6e", "#ffeaa7"],
];

const ROOM_LABELS = ["Гостиная", "Кухня", "Спальня", "Санузел"];
const ROOM_EMOJI = ["🛋️", "🍳", "🛏️", "🚿"];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function roomPhoto(seed: string, index: number): string {
  const hash = hashString(`${seed}-${index}`);
  const [from, to] = PALETTES[hash % PALETTES.length];
  const label = ROOM_LABELS[index % ROOM_LABELS.length];
  const emoji = ROOM_EMOJI[index % ROOM_EMOJI.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${from}"/>
        <stop offset="1" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="900" height="1200" fill="url(#g)"/>
    <text x="450" y="540" font-size="240" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    <text x="450" y="740" font-size="46" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" opacity="0.95">${label}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function roomPhotos(seed: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => roomPhoto(seed, i));
}
