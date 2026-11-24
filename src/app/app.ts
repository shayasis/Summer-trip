import { afterNextRender, Component, computed, effect, signal } from '@angular/core';
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
  host: { '(window:hashchange)': 'readHash(true)' },
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

  protected readonly checked = signal<Record<string, boolean>>(this.load());
  protected readonly doneCount = computed(
    () => this.checklist.filter((c) => this.checked()[c.id]).length,
  );
  protected readonly credits = signal<Credit[]>([]);

  private observer?: IntersectionObserver;

  constructor() {
    this.readHash(false);
    afterNextRender(() => {
      const top = document.querySelector('.top') as HTMLElement | null;
      const setTop = () => top && document.documentElement.style.setProperty('--top-h', top.offsetHeight + 'px');
      setTop();
      window.addEventListener('resize', setTop);
      this.watchDays();
      const n = this.dayN();
      if (this.tab() === 'days' && (location.hash.startsWith('#day') || this.todayN())) this.scrollToDay(n, 'auto');
    });
    // Re-attach the observer whenever the days tab is shown again.
    effect(() => {
      if (this.tab() === 'days') setTimeout(() => this.watchDays());
    });
    setInterval(() => this.now.set(Date.now()), 60 * 60 * 1000);
    fetch('img/credits.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then((c: Record<string, Credit>) => this.credits.set(Object.values(c)))
      .catch(() => {});
  }

  protected readHash(scroll: boolean) {
    const h = location.hash.replace('#', '');
    const m = /^day(\d+)$/.exec(h);
    if (m && +m[1] >= 1 && +m[1] <= 10) {
      this.tab.set('days');
      this.dayN.set(+m[1]);
      if (scroll) setTimeout(() => this.scrollToDay(+m[1]));
    } else if ((TABS as string[]).includes(h)) {
      this.tab.set(h as Tab);
    }
  }

  protected go(t: Tab) {
    this.tab.set(t);
    this.setHash(t === 'days' ? '' : t);
    window.scrollTo({ top: 0 });
  }

  /** Jump to a day in the scrolling list (switching to the days tab if needed). */
  protected pick(n: number) {
    if (n < 1 || n > 10) return;
    this.dayN.set(n);
    if (this.tab() !== 'days') {
      this.tab.set('days');
      setTimeout(() => this.scrollToDay(n));
    } else {
      this.scrollToDay(n);
    }
  }

  private scrollToDay(n: number, behavior: ScrollBehavior = 'smooth') {
    const el = document.getElementById('day' + n);
    if (!el) return;
    const offset = (document.querySelector('.top') as HTMLElement)?.offsetHeight ?? 0;
    const chips = (document.querySelector('.chips') as HTMLElement)?.offsetHeight ?? 0;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset - chips - 8, behavior });
  }

  /** Highlight the chip of the day currently on screen. */
  private watchDays() {
    this.observer?.disconnect();
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const n = Number((e.target as HTMLElement).dataset['n']);
          if (n && n !== this.dayN()) {
            this.dayN.set(n);
            document.getElementById('chip' + n)?.scrollIntoView({ inline: 'center', block: 'nearest' });
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    document.querySelectorAll('article.day').forEach((el) => this.observer!.observe(el));
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
      history.replaceState(null, '', h ? '#' + h : location.pathname + location.search);
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
