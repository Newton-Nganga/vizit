

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const uploadToCloudinary = async(req,res)=>{

}
//   const form = formidable({ multiples: true });
//   await new Promise((resolve, reject) => {
//     console.log("Before parsing form...");
//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         reject(err);
//       }
//       resolve({ fields, files });
//     });
//     console.log("After parsing form...");
//   })
//     .then(async (formData) => {
//       if (!formData) {
//         console.log("No form data");
//       }
//       const { id, email, title, journal, journal_thumbnail } = formData.fields;
//       const eId = id + "_" + nid + "_" + date;
//       console.log("====== we got the form now =======");
//       // console.log(images)
//       //save all the images into the cloudinary cloud storage
//       //push all the images to cloudinary
//       console.log("====== PUSHING IMAGES TO CLOUDINARY ======");
//       const resp = await cloudinary.v2.uploader.upload(journal_thumbnail, {
//         folder: "dayli-uploads",
//       });
//       const imageUrl = [{ url: resp.secure_url, publicId: resp.public_id }];

//       console.log("***all the urls***", imageUrl);