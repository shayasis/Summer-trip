import { afterNextRender, Component, computed, signal } from '@angular/core';
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

  protected readonly tab = signal<Tab>('travel');
  protected readonly dayN = signal(this.todayN() || 1);

  protected readonly checked = signal<Record<string, boolean>>(this.load());
  protected readonly doneCount = computed(
    () => this.checklist.filter((c) => this.checked()[c.id]).length,
  );
  protected readonly credits = signal<Credit[]>([]);

  private dayObserver?: IntersectionObserver;
  private partObserver?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const top = document.querySelector('.top') as HTMLElement | null;
      const setTop = () => top && document.documentElement.style.setProperty('--top-h', top.offsetHeight + 'px');
      setTop();
      window.addEventListener('resize', setTop);
      this.watch();
      this.readHash(false);
    });
    setInterval(() => this.now.set(Date.now()), 60 * 60 * 1000);
    fetch('img/credits.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then((c: Record<string, Credit>) => this.credits.set(Object.values(c)))
      .catch(() => {});
  }

  /** #day3 jumps to a day, #car / #travel / #days / #prep jump to a part of the page. */
  protected readHash(smooth: boolean) {
    const h = location.hash.replace('#', '');
    const m = /^day(\d+)$/.exec(h);
    const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto';
    if (m && +m[1] >= 1 && +m[1] <= 10) {
      this.scrollToDay(+m[1], behavior);
    } else if ((TABS as string[]).includes(h)) {
      this.scrollToPart(h as Tab, behavior);
    }
  }

  protected go(t: Tab) {
    this.tab.set(t);
    this.scrollToPart(t);
  }

  protected pick(n: number) {
    if (n < 1 || n > 10) return;
    this.dayN.set(n);
    this.scrollToDay(n);
  }

  private headerOffset(withChips: boolean) {
    const top = (document.querySelector('.top') as HTMLElement)?.offsetHeight ?? 0;
    const chips = withChips ? ((document.querySelector('.chips') as HTMLElement)?.offsetHeight ?? 0) : 0;
    return top + chips + 8;
  }

  private scrollToPart(t: Tab, behavior: ScrollBehavior = 'smooth') {
    const el = document.getElementById(t);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - this.headerOffset(false), behavior });
  }

  private scrollToDay(n: number, behavior: ScrollBehavior = 'smooth') {
    const el = document.getElementById('day' + n);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - this.headerOffset(true), behavior });
  }

  /** Keep the bottom bar and the day chips in sync with what is on screen. */
  private watch() {
    if (typeof IntersectionObserver === 'undefined') return;
    const band = { rootMargin: '-45% 0px -50% 0px' };
    this.dayObserver = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const n = Number((e.target as HTMLElement).dataset['n']);
        if (n && n !== this.dayN()) {
          this.dayN.set(n);
          document.getElementById('chip' + n)?.scrollIntoView({ inline: 'center', block: 'nearest' });
        }
      }
    }, band);
    document.querySelectorAll('article.day').forEach((el) => this.dayObserver!.observe(el));
    this.partObserver = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) this.tab.set(e.target.id as Tab);
    }, band);
    document.querySelectorAll('section.part').forEach((el) => this.partObserver!.observe(el));
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


  private load(): Record<string, boolean> {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    } catch {
      return {};
    }
  }
}
