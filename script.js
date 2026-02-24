const stateElement = document.getElementById("flow-state");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const eventLog = document.getElementById("event-log");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const clearLogBtn = document.getElementById("clear-log-btn");

let timer = null;
let progress = 0;
let runState = "idle";

function writeLog(message) {
  const item = document.createElement("li");
  const time = new Date().toLocaleTimeString("zh-CN", { hour12: false });
  item.textContent = `[${time}] ${message}`;
  eventLog.prepend(item);
}

function render() {
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${progress}%`;

  stateElement.className = "state";
  if (runState === "running") {
    stateElement.classList.add("state--running");
    stateElement.textContent = "运行中";
  } else if (runState === "paused") {
    stateElement.classList.add("state--paused");
    stateElement.textContent = "已暂停";
  } else {
    stateElement.classList.add("state--idle");
    stateElement.textContent = "待机";
  }

  startBtn.disabled = runState === "running";
  pauseBtn.disabled = runState !== "running";
}

function startFlow() {
  if (runState === "running") {
    return;
  }
  runState = "running";
  writeLog("流程已启动");
  timer = setInterval(() => {
    progress = Math.min(progress + 5, 100);
    if (progress >= 100) {
      clearInterval(timer);
      timer = null;
      runState = "idle";
      writeLog("流程执行完成");
    }
    render();
  }, 650);
  render();
}

function pauseFlow() {
  if (runState !== "running") {
    return;
  }
  clearInterval(timer);
  timer = null;
  runState = "paused";
  writeLog("流程已暂停");
  render();
}

function resetFlow() {
  clearInterval(timer);
  timer = null;
  progress = 0;
  runState = "idle";
  writeLog("流程已重置");
  render();
}

startBtn.addEventListener("click", startFlow);
pauseBtn.addEventListener("click", pauseFlow);
resetBtn.addEventListener("click", resetFlow);

clearLogBtn.addEventListener("click", () => {
  eventLog.innerHTML = "";
  writeLog("日志已清空");
});

writeLog("面板已就绪");
render();
