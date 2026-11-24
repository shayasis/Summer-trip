import { Component, computed, signal } from '@angular/core';
import {
  CAR, CHECKLIST, DAYS, DEPARTURE, FLIGHTS, HOTELS, WEATHER_ROWS,
} from './trip-data';

interface Credit { title: string; author: string; license: string; url: string }
type Tab = 'days' | 'travel' | 'car' | 'prep';

const STORE_KEY = 'austria-2027-checklist';
const TABS: Tab[] = ['days', 'travel', 'car', 'prep'];

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: { '(window:hashchange)': 'readHash()' },
})
export class App {
  protected readonly flights = FLIGHTS;
  protected readonly hotels = HOTELS;
  protected readonly car = CAR;
  protected readonly weatherRows = WEATHER_ROWS;
  protected readonly checklist = CHECKLIST;
  protected readonly days = DAYS;

  protected readonly now = signal(Date.now());
  protected readonly daysToGo = computed(() =>
    Math.ceil((DEPARTURE.getTime() - this.now()) / 86_400_000),
  );
  protected readonly todayN = computed(() => {
    const d = new Date(this.now());
    if (d.getFullYear() !== 2027 || d.getMonth() !== 7) return 0;
    const n = d.getDate() - 2;
    return n >= 1 && n <= 10 ? n : 0;
  });

  protected readonly tab = signal<Tab>('days');
  protected readonly dayN = signal(this.todayN() || 1);
  protected readonly day = computed(() => this.days[this.dayN() - 1]);

  protected readonly checked = signal<Record<string, boolean>>(this.load());
  protected readonly doneCount = computed(
    () => this.checklist.filter((c) => this.checked()[c.id]).length,
  );
  protected readonly credits = signal<Credit[]>([]);

  private touchX = 0;
  private touchY = 0;

  constructor() {
    this.readHash();
    setInterval(() => this.now.set(Date.now()), 60 * 60 * 1000);
    fetch('img/credits.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then((c: Record<string, Credit>) => this.credits.set(Object.values(c)))
      .catch(() => {});
  }

  protected readHash() {
    const h = location.hash.replace('#', '');
    const m = /^day(\d+)$/.exec(h);
    if (m && +m[1] >= 1 && +m[1] <= 10) {
      this.tab.set('days');
      this.dayN.set(+m[1]);
    } else if ((TABS as string[]).includes(h)) {
      this.tab.set(h as Tab);
    }
  }

  protected go(t: Tab) {
    this.tab.set(t);
    this.setHash(t === 'days' ? 'day' + this.dayN() : t);
    window.scrollTo({ top: 0 });
  }

  protected pick(n: number) {
    if (n < 1 || n > 10) return;
    this.dayN.set(n);
    this.setHash('day' + n);
    document.getElementById('chip' + n)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }

  protected touchStart(e: TouchEvent) {
    this.touchX = e.touches[0].clientX;
    this.touchY = e.touches[0].clientY;
  }

  /** RTL: swiping left reveals the next day, swiping right the previous one. */
  protected touchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - this.touchX;
    const dy = e.changedTouches[0].clientY - this.touchY;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    this.pick(this.dayN() + (dx > 0 ? 1 : -1));
  }

  protected mapUrl(q: string) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  }

  protected toggle(id: string) {
    this.checked.update((s) => ({ ...s, [id]: !s[id] }));
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.checked()));
    } catch {}
  }

  private setHash(h: string) {
    try {
      history.replaceState(null, '', '#' + h);
    } catch {}
  }

  private load(): Record<string, boolean> {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    } catch {
      return {};
    }
  }
}
