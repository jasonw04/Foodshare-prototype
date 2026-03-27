function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

function setActivePayment(mode){
  const payBox = qs("#payBox");
  const voucherBox = qs("#voucherBox");
  const modeLabel = qs("#modeLabel");

  if(!payBox || !voucherBox || !modeLabel) return;

  if(mode === "pay"){
    payBox.classList.remove("d-none");
    voucherBox.classList.add("d-none");
    modeLabel.textContent = "Pay Online";
  } else {
    payBox.classList.add("d-none");
    voucherBox.classList.remove("d-none");
    modeLabel.textContent = "Redeem Voucher";
  }
}

function checkoutConfirm(){
  const voucherInput = qs("#voucherCode");
  const mode = qs("input[name='paymode']:checked")?.value || "pay";
  const notice = qs("#checkoutNotice");

  if(mode === "voucher"){
    const code = voucherInput?.value?.trim() || "";
    if(code.length === 0){
      if(notice){
        notice.className = "notice-box err mt-3";
        notice.innerHTML = "<b>Voucher error:</b> Please enter a voucher code.";
        notice.classList.remove("d-none");
      }
      return;
    }
  }

  const item = document.body.dataset.item || "FoodShare order";
  const provider = document.body.dataset.provider || "FoodShare provider";
  const orderId = "FS-12843";
  const payment = mode === "voucher" ? "Voucher redeemed" : "Paid online";

  const params = new URLSearchParams({
    item,
    provider,
    payment,
    order: orderId
  });

  window.location.href = `order-tracking.html?${params.toString()}`;
}

function providerUpdate(btn){
  const card = btn.closest(".provider-order");
  const status = card?.querySelector(".provStatus");
  if(!status) return;

  const action = btn.dataset.action;

  if(action === "accept") status.textContent = "Accepted";
  if(action === "reject") status.textContent = "Rejected";
  if(action === "prep") status.textContent = "Preparing";
  if(action === "ready") status.textContent = "Ready";
  if(action === "complete") status.textContent = "Completed";
  if(action === "noshow") status.textContent = "No-show";
}

function applyTrackingStage(stage){
  const currentText = qs("#trackingCurrentText");
  const stages = qsa(".tracking-stage");
  const order = ["requested", "accepted", "preparing", "ready", "completed"];
  const labels = {
    requested: "Requested",
    accepted: "Accepted",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed"
  };

  const activeIndex = order.indexOf(stage);

  if(currentText && labels[stage]){
    currentText.textContent = labels[stage];
  }

  stages.forEach((el) => {
    const idx = order.indexOf(el.dataset.stage);
    el.classList.toggle("active", idx > -1 && idx <= activeIndex);
  });
}

function initOrderTrackingPage(){
  if(!qs(".tracking-stages")) return;

  // does not fully work
  // provider name and item do not work
  const params = new URLSearchParams(window.location.search);
  const item = params.get("item") || "Chicken Teriyaki Bowl";
  const provider = params.get("provider") || "Midtown Bento";
  const payment = params.get("payment") || "Paid online";
  const order = params.get("order") || "FS-12843";

  const itemEl = qs("#trackingItem");
  const providerEl = qs("#trackingProvider");
  const paymentEl = qs("#trackingPayment");
  const metaEl = qs("#trackingMeta");

  if(itemEl) itemEl.textContent = item;
  if(providerEl) providerEl.textContent = provider;
  if(paymentEl) paymentEl.textContent = payment;
  if(metaEl) metaEl.textContent = `${order} • Live status updates`;

  applyTrackingStage("requested");
  setTimeout(() => applyTrackingStage("accepted"), 900);
  setTimeout(() => applyTrackingStage("preparing"), 1800);
  setTimeout(() => applyTrackingStage("ready"), 2700);
  setTimeout(() => applyTrackingStage("completed"), 3600);
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("button, label");
  if(!t) return;

  if(t.matches("#payBtn")) setActivePayment("pay");
  if(t.matches("#voucherBtn")) setActivePayment("voucher");
  if(t.matches("#confirmOrderBtn")) checkoutConfirm();
  if(t.matches("[data-action]")) providerUpdate(t);
});

document.addEventListener("DOMContentLoaded", () => {
  const mode = document.querySelector("input[name='paymode']:checked")?.value;
  if(mode) setActivePayment(mode);
  initOrderTrackingPage();
});