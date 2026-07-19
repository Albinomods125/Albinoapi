
const express = require("express");
const yts = require("yt-search");
const ytdlp = require("yt-dlp-exec");

const app = express();

app.use(express.json());


// =======================
// STATUS API
// =======================

app.get("/", (req, res) => {
  res.json({
    sucesso: true,
    nome: "YouTube API",
    status: "online"
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// =======================
// BUSCAR YOUTUBE
// =======================

app.get("/api/yt/search", async (req, res) => {

  const { q } = req.query;

  if (!q) {
    return res.json({
      sucesso: false,
      mensagem: 'Falta parametro "q"'
    });
  }

  try {

    const search = await yts(q);

    const resultados = search.videos.slice(0, 5).map(video => ({
      titulo: video.title,
      canal: video.author.name,
      duracao: video.timestamp,
      thumbnail: video.thumbnail,
      url: video.url
    }));

    res.json({
      sucesso: true,
      resultados
    });

  } catch (e) {

    res.json({
      sucesso:false,
      erro:e.message
    });

  }

});


// =======================
// INFORMAÇÕES DO VÍDEO
// =======================

app.get("/api/yt/info", async (req,res)=>{

const {url}=req.query;

if(!url){
 return res.json({
  sucesso:false,
  mensagem:"Falta parametro url"
 });
}


try{

const info = await ytdlp(url,{
 dumpSingleJson:true,
 noWarnings:true
});


res.json({

 sucesso:true,

 data:{
  titulo: info.title,
  canal: info.channel,
  descricao: info.description,
  duracao: info.duration,
  views: info.view_count,
  thumbnail: info.thumbnail,
  url: info.webpage_url
 }

});


}catch(e){

res.json({
 sucesso:false,
 erro:e.message
});

}

});


// =======================
// BAIXAR MP3
// =======================

app.get("/api/yt/mp3", async(req,res)=>{

const {url}=req.query;


if(!url){
 return res.json({
  sucesso:false,
  mensagem:"Falta parametro url"
 });
}


try{


const arquivo = await ytdlp(url,{
 extractAudio:true,
 audioFormat:"mp3",
 output:"downloads/%(title)s.%(ext)s"
});


res.json({

 sucesso:true,

 tipo:"audio",

 arquivo

});


}catch(e){

res.json({
 sucesso:false,
 erro:e.message
});

}

});


// =======================
// BAIXAR MP4
// =======================

app.get("/api/yt/mp4", async(req,res)=>{

const {url}=req.query;


if(!url){
 return res.json({
  sucesso:false,
  mensagem:"Falta parametro url"
 });
}


try{


const arquivo = await ytdlp(url,{
 format:"mp4",
 output:"downloads/%(title)s.%(ext)s"
});


res.json({

 sucesso:true,

 tipo:"video",

 arquivo

});


}catch(e){

res.json({
 sucesso:false,
 erro:e.message
});

}

});


// =======================
// INICIAR SERVIDOR
// =======================

app.listen(3000,()=>{

console.log(`
🔥 YouTube API online

Porta: 3000

Rotas:
GET /api/yt/search?q=
GET /api/yt/info?url=
GET /api/yt/mp3?url=
GET /api/yt/mp4?url=
`);

});
