import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  currentMonth: Date = new Date();
  daysInMonth: Array<{ date: Date; notes: string }> = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.updateDaysInMonth();
  }

  updateDaysInMonth() {
    this.daysInMonth = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0);
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      this.daysInMonth.push({ date: date, notes: '' });
    }
    this.cdr.detectChanges(); // Asegurar que se detecten los cambios
  }
  prevMonth() {
    this.currentMonth = new Date(
      this.currentMonth.setMonth(this.currentMonth.getMonth() - 1)
    );
    this.updateDaysInMonth();
  }
  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.setMonth(this.currentMonth.getMonth() + 1)
    );
    this.updateDaysInMonth();
  }
  getDayClass(day: { date: Date; notes: string }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day.date.toDateString() === today.toDateString()) {
      return 'current-day';
    } else if (day.date < today) {
      return 'past-day';
    } else {
      return 'future-day';
    }
  }
}
