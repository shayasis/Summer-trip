import { Component, computed, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  CAR, CHECKLIST, DAYS, DEPARTURE, FLIGHTS, HOTELS, WEATHER_ROWS, Day,
} from './trip-data';

interface Credit { title: string; author: string; license: string; url: string }

const STORE_KEY = 'austria-2027-checklist';

@Component({
  selector: 'app-root',
  imports: [NgTemplateOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly flights = FLIGHTS;
  protected readonly hotels = HOTELS;
  protected readonly car = CAR;
  protected readonly weatherRows = WEATHER_ROWS;
  protected readonly checklist = CHECKLIST;
  protected readonly flachauDays = DAYS.filter((d) => d.base === 'flachau');
  protected readonly kaprunDays = DAYS.filter((d) => d.base === 'kaprun');
  protected readonly days = DAYS;

  protected readonly now = signal(Date.now());
  protected readonly daysToGo = computed(() =>
    Math.ceil((DEPARTURE.getTime() - this.now()) / 86_400_000),
  );
  /** Trip day number (1–10) if today falls inside the trip, else 0. */
  protected readonly todayN = computed(() => {
    const d = new Date(this.now());
    if (d.getFullYear() !== 2027 || d.getMonth() !== 7) return 0;
    const n = d.getDate() - 2;
    return n >= 1 && n <= 10 ? n : 0;
  });

  protected readonly checked = signal<Record<string, boolean>>(this.load());
  protected readonly doneCount = computed(
    () => this.checklist.filter((c) => this.checked()[c.id]).length,
  );
  protected readonly credits = signal<Record<string, Credit>>({});

  constructor() {
    setInterval(() => this.now.set(Date.now()), 60 * 60 * 1000);
    fetch('img/credits.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then((c) => this.credits.set(c))
      .catch(() => {});
  }

  protected creditList() {
    const c = this.credits();
    return Object.keys(c).map((k) => c[k]);
  }

  protected hotelFor(day: Day) {
    return this.hotels.find((h) => h.base === day.base)!;
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
