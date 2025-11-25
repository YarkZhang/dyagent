const form = document.getElementById("agentForm");
const preview = document.getElementById("payloadPreview");
const responseOutput = document.getElementById("responseOutput");
const runLog = document.getElementById("runLog");
const loadSampleBtn = document.getElementById("loadSample");
const healthStatus = document.getElementById("healthStatus");
const clearForm = document.getElementById("clearForm");

const inputs = {
  goal: document.getElementById("goal"),
  product: document.getElementById("product"),
  audience: document.getElementById("audience"),
  notes: document.getElementById("notes"),
};

function buildPayload() {
  return {
    goal: inputs.goal.value.trim(),
    product: inputs.product.value.trim(),
    audience: inputs.audience.value.trim(),
    notes: inputs.notes.value.trim(),
  };
}

function updatePreview() {
  const payload = buildPayload();
  preview.textContent = JSON.stringify(payload, null, 2);
}

Object.values(inputs).forEach((input) => input.addEventListener("input", updatePreview));

loadSampleBtn.addEventListener("click", () => {
  inputs.goal.value = "提炼千川投放可用的高转化创意方向，生成主图/视频脚本";
  inputs.product.value = "筋膜枪：静音、深层放松、Type-C 快充，赠送收纳盒";
  inputs.audience.value = "25-35 岁都市白领，运动健身、夜间刷抖音，关注肩颈放松";
  inputs.notes.value = "符合抖音/天猫素材规范，规避医疗/功效敏感词，突出质保";
  updatePreview();
});

clearForm.addEventListener("click", () => {
  setTimeout(updatePreview, 0);
});

async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    healthStatus.textContent = data.message || "服务正常";
    healthStatus.classList.add("ok");
  } catch (error) {
    healthStatus.textContent = "无法连接后端，请检查服务";
    healthStatus.classList.remove("ok");
  }
}

function appendLog(entry) {
  const li = document.createElement("li");
  const summary = document.createElement("div");
  summary.innerHTML = `<strong>${entry.goal}</strong><div class="muted">${entry.audience}</div>`;
  const time = document.createElement("time");
  time.textContent = new Date().toLocaleTimeString();
  li.appendChild(summary);
  li.appendChild(time);
  runLog.prepend(li);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = buildPayload();
  responseOutput.textContent = "调用中…";

  try {
    const res = await fetch("/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    responseOutput.textContent = JSON.stringify(data, null, 2);
    appendLog(payload);
  } catch (error) {
    responseOutput.textContent = `调用失败：${error.message}`;
  }
});

updatePreview();
checkHealth();
