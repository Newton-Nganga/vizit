
window.addEventListener('load',()=>{
  // Get the current URL
  const url = new URL(window.location.href);

  // Access the query string parameters using URLSearchParams
  const searchParams = new URLSearchParams(url.search);

  // Get the JWT token parameter value
  const token = searchParams.get("token");


  //buttons
const addVisitorBtnEl = document.getElementById('add-visitor')
const visitorIconEl = document.querySelector('.visitor-icon')

  const data = {};
  let img
  //get all the input values
  const visitorImageEl = document.getElementById('visitor-image')
  const fNameEl = document.getElementById("fName");
  const lNameEl = document.getElementById("lName");
  const uNameEl = document.getElementById("uName");
  const phoneEl = document.getElementById("phone");
  const emailEl = document.getElementById("email");
  const statusEl = document.getElementById('status')
  const genderEl = document.getElementById('gender')
  const addressEl = document.getElementById('address')


  addVisitorBtnEl.addEventListener('click',async(e)=>{
    e.preventDefault();
    // Loop through each input element and store its value in the data object
    const inputEls = [phoneEl, emailEl, lNameEl, uNameEl, fNameEl,genderEl,statusEl,addressEl];

    inputEls.map((el) => {
      data[el.name] = el.value;
    });
    data.visitorIcon = img
    alert("clicked n data saved");
    // Perform any desired actions with the collected data
    console.log(data);
    if (
      !data.phone ||
      !data.email ||
      !data.uName ||
      !data.fName ||
      !data.lName ||
      !data.status ||
      !data.address||
      !data.gender
    ) {
      alert("All the fields are required");
    }
    const response = await fetch(`/visitors/add?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    });
    const toastEl= document.querySelector('.animate__fadeInTopRight')
    
    
        
     if(response.status.ok || response.status === 200){
        document.querySelector('.response-text').innerHTML="visitor added successfully"
        toastEl.classList.remove('hide')
        setTimeout(()=>{
            toastEl.classList.add('hide')
            setTimeout(()=>{window.location.reload()},2000)
            
        },3000)
     }
     else{
        document.querySelector('.response-text').innerHTML="visitor couldn't be added"
        setTimeout(()=>{toastEl.classList.remove('hide')
       },4000)}
       toastEl.classList.add('hide')
  })
  //image upload




  visitorImageEl.addEventListener('change',async(event)=>{
    document.getElementById('loader-spinner').classList.remove('hide')
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ggqyl3qi");

    if (!visitorIconEl.id  || visitorIconEl.id === null) {
      //if its the firts upload
      fetch(
        `https://api.cloudinary.com/v1_1/dv331j5da/image/upload/${visitorIconEl.id}`,
        {
          method: "PUT",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const imageUrl = data.secure_url;
          img  = imageUrl;
          visitorIconEl.id = data.public_url;
          visitorIconEl.src = imageUrl;
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
          img = imageUrl;
          visitorIconEl.id = data.public_url;
          console.log(data)
          visitorIconEl.src = imageUrl;
          console.log("image Url", imageUrl);
          document.getElementById('loader-spinner').classList.add('hide')
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  })
})
