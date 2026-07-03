function onEvent() {
  var max = +event.target.selectedOptions[0].dataset.max || 3;
  var size = document.getElementById("size");
  [...size.options].forEach((o) => {
    if (o.value) o.hidden = +o.value > max;
  });
  if (+size.value > max) {
    size.value = "";
    onSize();
  }
}
function onSize() {
  var n = +document.getElementById("size").value;
  document.getElementById("m2").style.display = n >= 2 ? "block" : "none";
  document.getElementById("m3").style.display = n >= 3 ? "block" : "none";
}
