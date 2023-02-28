const refs = {
  body: document.querySelector('body'),
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
};

let intervalId = null;

refs.startBtn.addEventListener('click', onStartChangeColor);
refs.stopBtn.addEventListener('click', onStopChangeColor);

function onStartChangeColor() {
  intervalId = setInterval(() => {
    changeColorEl(refs.body);
  }, 1000);

  refs.startBtn.disabled = true;
  refs.stopBtn.disabled = false;
}

function onStopChangeColor() {
  clearInterval(intervalId);

  refs.startBtn.disabled = false;
  refs.stopBtn.disabled = true;
}

function changeColorEl(el) {
  el.style.backgroundColor = getRandomHexColor();
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
