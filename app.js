function qs(sel){ return document.querySelector(sel); }

function setActivePayment(mode){
  const payBox = qs("#payBox");
  const voucherBox = qs("#voucherBox");
  const modeLabel = qs("#modeLabel");
  if(!payBox || !voucherBox || !modeLabel) return;

  if(mode === "pay"){
    payBox.style.display = "block";
    voucherBox.style.display = "none";
    modeLabel.textContent = "Pay Online";
  } else {
    payBox.style.display = "none";
    voucherBox.style.display = "block";
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
      notice.className = "notice err";
      notice.innerHTML = "<b>Voucher error:</b> Please enter a voucher code.";
      notice.style.display = "block";
      return;
    }
  }

  notice.className = "notice ok";
  notice.innerHTML = "<b>Order Requested!</b> Order ID: <span style='font-family:monospace'>FS-12843</span>. Status updates will appear below.";
  notice.style.display = "block";

  if(status){
    status.textContent = "Requested";
    status.className = "badge info";

    setTimeout(() => {
      status.textContent = "Accepted";
      status.className = "badge info";
    }, 900);

    setTimeout(() => {
      status.textContent = "Preparing";
      status.className = "badge info";
    }, 1800);

    setTimeout(() => {
      status.textContent = "Ready for pickup";
      status.className = "badge ok";
    }, 2700);
  }
}

function providerUpdate(btn){
  const card = btn.closest(".card");
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

function applyFilters(){
  alert("Filters applied.");
}

function clearFilters(){
  const listingType = qs("#listingType");
  const pickupWindow = qs("#pickupWindow");
  const dietary = qs("#dietary");
  const maxPrice = qs("#maxPrice");

  if(listingType) listingType.selectedIndex = 0;
  if(pickupWindow) pickupWindow.selectedIndex = 0;
  if(dietary) dietary.selectedIndex = 0;
  if(maxPrice) maxPrice.value = "";
}

document.addEventListener("click", (e) => {
  const t = e.target;

  if(t.matches("#payBtn")) setActivePayment("pay");
  if(t.matches("#voucherBtn")) setActivePayment("voucher");
  if(t.matches("#confirmOrderBtn")) checkoutConfirm();
  if(t.matches("[data-action]")) providerUpdate(t);
  if(t.matches("#applyFiltersBtn")) applyFilters();
  if(t.matches("#clearFiltersBtn")) clearFilters();
});

document.addEventListener("DOMContentLoaded", () => {
  const mode = document.querySelector("input[name='paymode']:checked")?.value;
  if(mode) setActivePayment(mode);
});