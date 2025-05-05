function toggleParkingCost(value) {
  const feeDiv = document.getElementById("parking-fee");
  feeDiv.style.display = value === "yes" ? "block" : "none";
}

document.getElementById("user-form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("情報が送信されました！（次のステップへ進みましょう）");
});
