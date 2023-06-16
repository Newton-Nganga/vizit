window.addEventListener("load", () => {

  let state = false;
  const btnEl = document.querySelector(".menu-icon");
  const asideEl = document.querySelector(".aside");
  const dashEl = document.querySelector(".dash-content");

  btnEl.addEventListener("click", (e) => {
    e.preventDefault;
    state = !state;
    if (state === true) {
      asideEl.classList.add("hide");
      dashEl.classList.add("reduce-dash-content");
      updateBtnEl.style.width = "-webkit-fill-available";
      deleteBtnEl.style.width = "-webkit-fill-available";
      deleteBtnEl.style.marginTop = "0.5rem";
    } else if (state === false) {
      asideEl.classList.remove("hide");
      dashEl.classList.remove("reduce-dash-content");
    }
  });


});
