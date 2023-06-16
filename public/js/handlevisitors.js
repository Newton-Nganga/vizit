window.addEventListener("load", () => {
  // Get the current URL
  const url = new URL(window.location.href);

  // Access the query string parameters using URLSearchParams
  const searchParams = new URLSearchParams(url.search);

  // Get the JWT token parameter value
  const token = searchParams.get("token");

  deleteBtnEl = document.querySelectorAll(".delete-link");
  deleteBtnEl.forEach((element) => {
    //each button
    element.addEventListener("click", (e) => {
      handleClick(e, element);
    });
  });
  const handleClick = (e, el) => {
    e.preventDefault();
    const confirm = window.confirm(
      "Are you sure you want to delete this visitor"
    );
    if (!confirm) {
      window.location.reload();
    }
    fetch(`/visitors/${el.id}/?token=${token}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    window.location.reload()
  };
  //update a specific visitor detail
});
