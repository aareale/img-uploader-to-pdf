const imagestopdf = require('images-pdf');
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// inizializza l'uploader
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

  // controlla il tipo di file
function checkFileType(file, cb){
  // Consentire l'uscita
  const filetypes = /jpeg|jpg|png|gif/;
  // Controlla il tipo di file
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// Avvio dell'applicativo
const app = express();


// EJS
app.set('view engine', 'ejs');

// Cartella pubblica
app.use(express.static('./public'));



//cancella tutti i file della directory

let foo =  async function(folder) {
  fs.readdir('public/' + folder, (err, files) => {
    if (err) throw err;
   
     for (const file of files) {
       fs.unlink(path.join('public/'+folder, file), err => {
        if (err) throw err;
      });   }
    });
 
};

app.post('/deleteall', async function(req, res) {
  
  await foo('uploads');
  await foo('download');
  res.redirect('/');
});


app.get('/', async (req, res) => {
  await foo('download');

  return res.render('index', {
  clicked: ' '});
})

//servo la cartella download
app.use('/download', express.static('download'));
app.use('/uploads', express.static('uploads'));


app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err,
        clicked: ' '
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!',
          clicked: ' '
        });
      } else {
        res.render('index', {
          msg: 'File Uploaded! updating PDF file',
          file: `uploads/${req.file.filename}`,
          clicked: '<a class="btn" href="./download/MergedImages.pdf"  download="MergedImages.pdf">Download PDF file!</a>'
        });

        // serve per convertire tutti i  file in una directory in un singolo file pdf
        new imagestopdf.ImagesToPDF().convertFolderToPDF('public/uploads', 'public/download/MergedImages.pdf');

      }
    }
  });
});


app.use('/images', async (req, res)=> {
  
  let x = await foo33('uploads');
  return res.render('images', {test:x});
})

//delete all files in a directory

app.get('/delete', (req, res)=>{
      if(req.query.file == undefined){
        res.render('images', {
          test: 'Error: Image not existent!'
        });
      } else {
        fs.unlinkSync(path.join('public/uploads', req.query.file));
        res.redirect('/images');
      }
})

//ogni immagine presa dalla directory

let foo33 =  async function(folder) {
  let data = '';
  let res = fs.readdirSync('public/' + folder)
     for (const file of res) {
        data += `<span><img src="./uploads/${file}" widht=200 height=200 style="padding:5px">
                  <a href="delete?file=${file}"><input type="button" class="btn" value="Delete Image" /></a></span>`
       
    }

  return data;
};


const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));