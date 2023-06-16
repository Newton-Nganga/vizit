const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];

  // Upload the file to Cloudinary
  uploadToCloudinary(file)
    .then((imageUrl) => {
      // Set the input value to the image URL
      fileInput.value = imageUrl;
    })
    .catch((error) => {
      console.log('Error uploading image:', error);
    });
}

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Replace with your Cloudinary upload preset

    fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const imageUrl = data.secure_url;
        resolve(imageUrl);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
