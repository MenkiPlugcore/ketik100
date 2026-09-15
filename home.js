(()=>{
  const image=document.getElementById("posterImage");
  const data=window.__K100_POSTER||"";
  const EXPECTED_LENGTH=49580;

  if(!image) return;

  if(data.length===EXPECTED_LENGTH){
    image.src=`data:image/jpeg;base64,${data}`;
  }else{
    console.error(`Ketik100 poster data tidak lengkap: ${data.length}/${EXPECTED_LENGTH}`);
    image.alt="Beranda Ketik100 gagal dimuat. Silakan muat ulang halaman.";
  }

  delete window.__K100_POSTER;
})();