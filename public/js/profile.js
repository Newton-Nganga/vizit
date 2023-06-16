window.addEventListener("load", () => {
    // Get the current URL
    const url = new URL(window.location.href);

    // Access the query string parameters using URLSearchParams
    const searchParams = new URLSearchParams(url.search);
  
    // Get the JWT token parameter value
    const token = searchParams.get("token");
  

  //buttons
  const updateBtnEl = document.querySelector(".update");
  const deleteBtnEl = document.querySelector(".del");
  const profileIconEl = document.querySelector(".profileIconEl");
  //elements
  const profileImageEl = document.getElementById("profile-image");
  const fNameEl = document.getElementById("fName");
  const lNameEl = document.getElementById("lName");
  const uNameEl = document.getElementById("uName");
  const phoneEl = document.getElementById("phone");
  const emailEl = document.getElementById("email");

  const data = {};
   

  profileImageEl.addEventListener("change", async (event) => {
    document.getElementById('loader-spinner').classList.remove('hide')
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ggqyl3qi");

    if (!profileIconEl.id  || profileIconEl.id === null) {
      //if its the firts upload
      fetch(
        `https://api.cloudinary.com/v1_1/dv331j5da/image/upload/${profileIconEl.id}`,
        {
          method: "PUT",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const imageUrl = data.secure_url;
          data.profileImage = imageUrl;
          profileIconEl.id = data.public_url;
          profileIconEl.src = imageUrl;
          console.log("image Url", imageUrl);
          document.getElementById('loader-spinner').classList.add('hide')
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    } else{
      //else if its another upload
      fetch("https://api.cloudinary.com/v1_1/dv331j5da/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const imageUrl = data.secure_url;
          data.profileImage = imageUrl;
          profileIconEl.id = data.public_url;
          profileIconEl.src = imageUrl;
          console.log("image Url", imageUrl);
          document.getElementById('loader-spinner').classList.add('hide')
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  });
  deleteBtnEl.addEventListener("click",async(e)=>{
    e.preventDefault()
    fetch(`/profile?token=${token}`,{
      method:"DELETE",
      headers:{"Content-Type": "application/json",}
    })
  })
  updateBtnEl.addEventListener("click", async (e) => {
    e.preventDefault();
    // Loop through each input element and store its value in the data object
    const inputEls = [phoneEl, emailEl, lNameEl, uNameEl, fNameEl];
    inputEls.map((el) => {
      data[el.name] = el.value;
    });
    alert("clicked n data saved");
    // Perform any desired actions with the collected data
    console.log(data);
    if (
      !data.phone ||
      !data.email ||
      !data.uName ||
      !data.fName ||
      !data.lName
    ) {
      alert("All the fields are required");
    }
    const response = await fetch(`/profile?token=${token}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    });
    //after getting the response from the backend
     if(response.status.ok || response.status === 200 ){
      window.location.reload()
     }
     else{

     }
  });
});
