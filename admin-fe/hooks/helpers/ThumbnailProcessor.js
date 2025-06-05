export async function generateVideoThumbnailJS(videoUrl, seekTime = 1) {
  return new Promise((resolve, reject) => {
    // buat elemen video
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    // buat canvas buat capture frame
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.addEventListener("loadedmetadata", () => {
      // set ukuran canvas sesuai video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Seek ke waktu yang diinginkan
      video.currentTime = Math.min(seekTime, video.duration);
    });

    video.addEventListener("seeked", () => {
      // capture frame ke canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // dapatkan data URL gambar thumbnail
      const imageUrl = canvas.toDataURL("image/png");

      resolve(imageUrl);
    });

    video.addEventListener("error", (e) => {
      reject("Video load error: " + e.message);
    });
  });
}
