const canvas = document.getElementById("canvas");
const clearBtn = document.getElementById("clear-btn");
const toolboxItems = document.querySelectorAll(".tool");

const labels = {
  start: "开始",
  task: "任务",
  decision: "判断",
  end: "结束",
};

let idSeed = 1;

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function placeNode(type, x, y) {
  const node = document.createElement("div");
  node.className = `node node--${type}`;
  node.textContent = `${labels[type]} ${idSeed++}`;
  node.dataset.type = type;
  node.draggable = true;

  const width = 110;
  const height = 40;
  const left = clamp(x - width / 2, 0, canvas.clientWidth - width);
  const top = clamp(y - height / 2, 0, canvas.clientHeight - height);
  node.style.left = `${left}px`;
  node.style.top = `${top}px`;

  node.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", "move-node");
    event.dataTransfer.setData("node-id", node.dataset.nodeId);
  });

  node.dataset.nodeId = `node-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  canvas.appendChild(node);
}

toolboxItems.forEach((item) => {
  item.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", "new-node");
    event.dataTransfer.setData("node-type", item.dataset.type);
  });
});

canvas.addEventListener("dragover", (event) => {
  event.preventDefault();
  canvas.classList.add("is-over");
});

canvas.addEventListener("dragleave", () => {
  canvas.classList.remove("is-over");
});

canvas.addEventListener("drop", (event) => {
  event.preventDefault();
  canvas.classList.remove("is-over");

  const rect = canvas.getBoundingClientRect();
  const dropX = event.clientX - rect.left;
  const dropY = event.clientY - rect.top;

  const mode = event.dataTransfer.getData("text/plain");
  if (mode === "new-node") {
    const type = event.dataTransfer.getData("node-type");
    if (labels[type]) {
      placeNode(type, dropX, dropY);
    }
    return;
  }

  if (mode === "move-node") {
    const nodeId = event.dataTransfer.getData("node-id");
    const node = canvas.querySelector(`[data-node-id="${nodeId}"]`);
    if (!node) {
      return;
    }

    const width = node.offsetWidth;
    const height = node.offsetHeight;
    node.style.left = `${clamp(dropX - width / 2, 0, canvas.clientWidth - width)}px`;
    node.style.top = `${clamp(dropY - height / 2, 0, canvas.clientHeight - height)}px`;
  }
});

clearBtn.addEventListener("click", () => {
  canvas.innerHTML = "";
  idSeed = 1;
});
