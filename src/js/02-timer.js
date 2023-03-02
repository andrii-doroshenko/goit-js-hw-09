import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  input: document.querySelector("input[type = 'text']"),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

class Timer {
  constructor({ onTick }) {
    this.countTime = null;
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;
  }

  start() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;

    this.intervalId = setInterval(() => {
      let timeRemainder = this.countTime - Date.now();

      if (timeRemainder <= 0) {
        this.stop();
        return;
      }

      const time = this.convertMs(timeRemainder);
      this.onTick(time);
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
    Notify.success('Deadline !!! Reload the page please !', {
      cssAnimationStyle: 'from-right',
    });
    refs.startBtn.disabled = true;
    this.isActive = false;
    const time = this.convertMs(0);
    this.onTick(time);
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = this.addLeadingZero(Math.floor(ms / day));
    // Remaining hours
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    // Remaining seconds
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

const timer = new Timer({
  onTick: updateClockFace,
});

refs.startBtn.disabled = true;

refs.startBtn.addEventListener('click', onStartTimer);

function onStartTimer(e) {
  timer.start();
}

const fp = flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (Date.now() > selectedDates[0]) {
      Notify.failure('Please choose a date in the future', {
        cssAnimationStyle: 'from-right',
      });
      return;
    }
    refs.startBtn.disabled = false;
    timer.countTime = selectedDates[0];
  },
});

function updateClockFace({ days, hours, minutes, seconds }) {
  refs.days.textContent = `${days}`;
  refs.hours.textContent = `${hours}`;
  refs.minutes.textContent = `${minutes}`;
  refs.seconds.textContent = `${seconds}`;
}
