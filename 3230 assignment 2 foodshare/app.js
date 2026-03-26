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
  const notice = qs("#checkoutNotice");
  const status = qs("#statusLine");
  const mode = qs("input[name='paymode']:checked")?.value || "pay";

  if(mode === "voucher"){
    const code = voucherInput?.value?.trim() || "";
    if(code.length === 0){
      notice.className = "notice-box err mt-3";
      notice.innerHTML = "<b>Voucher error:</b> Please enter a voucher code.";
      notice.classList.remove("d-none");
      return;
    }
  }

  notice.className = "notice-box ok mt-3";
  notice.innerHTML = "<b>Order Requested!</b> Order ID: <span style='font-family:monospace'>FS-12843</span>. Status updates will appear below.";
  notice.classList.remove("d-none");

  if(status){
    status.textContent = "Requested";
    status.className = "badge-pill badge-info";
    setTimeout(()=>{ status.textContent = "Accepted"; }, 900);
    setTimeout(()=>{ status.textContent = "Preparing"; }, 1800);
    setTimeout(()=>{ status.textContent = "Ready for pickup"; status.className = "badge-pill badge-ok"; }, 2700);
  }
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

document.addEventListener("click", (e)=>{
  const t = e.target.closest("button, label");
  if(!t) return;
  if(t.matches("#payBtn")) setActivePayment("pay");
  if(t.matches("#voucherBtn")) setActivePayment("voucher");
  if(t.matches("#confirmOrderBtn")) checkoutConfirm();
  if(t.matches("[data-action]")) providerUpdate(t);
});

document.addEventListener("DOMContentLoaded", ()=>{
  const mode = document.querySelector("input[name='paymode']:checked")?.value;
  if(mode) setActivePayment(mode);
});
