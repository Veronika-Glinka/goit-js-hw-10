// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const buttonEl = document.querySelector('[data-start]');
let userSelectedDate;
let timerId;
let timeLeft;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    let selectedTime = userSelectedDate.getTime();
    let now = Date.now();

    if (selectedTime <= now) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
    } else {
      buttonEl.removeAttribute('disabled');
    }
  },
};

const fp = flatpickr('#datetime-picker', options);

//робимо кнопку неактивної при завантаженні сторінки
// якщо обрана дата в минулому - кнопка залишаєтся неактивною і вилазить алерт
// якщо в майбутньому - кнопка активна і дата записуєтсья в let userSelectedDate;

//option 1 to disable
buttonEl.disabled = true;

/*
option 2 to disable:
buttonEl.setAttribute('disabled', true);
 */

//Відлік часу

function startTimer() {
  timerId = setInterval(() => calculateTimeLeft(userSelectedDate), 1000);

  function calculateTimeLeft(userSelectedDate) {
    let timeInMs = userSelectedDate.getTime();
    let now = Date.now();
    timeLeft = timeInMs - now;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      iziToast.success({
        title: 'success',
        message: 'Timer has just ended',
        position: 'topRight',
      });
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(timeLeft);

    document.querySelector('[data-days]').textContent = days;
    document.querySelector('[data-hours]').textContent = hours;
    document.querySelector('[data-minutes]').textContent = minutes;
    document.querySelector('[data-seconds]').textContent = seconds;

    buttonEl.disabled = true;
  }
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  let days = Math.floor(ms / day);
  // Remaining hours
  let hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  let minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  let seconds = Math.floor((((ms % day) % hour) % minute) / second);

  function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
  }

  days = addLeadingZero(days);
  hours = addLeadingZero(hours);
  minutes = addLeadingZero(minutes);
  seconds = addLeadingZero(seconds);

  return { days, hours, minutes, seconds };
}

buttonEl.addEventListener('click', startTimer);
