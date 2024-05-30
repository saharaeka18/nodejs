const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/jayakarta', (req, res) => {
    res.send('Hello jayakarta!');
});


app.use(express.static("./public"))
// use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')
    },
    filename: (req, file, callBack) =>{
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

// create data / insert data
app.post('/api/movies',(req, res) => {
    
const uploadz = multer({storage:storage}).single('images');
    uploadz(req,res,function (err){
if(err instanceof multer.MulterError){
    //error multer
    return res.status(500).json({ message: 'Ada kesalahan multer!', error: err });
    
}else if(err){
    //error umum
    return res.status(500).json({ message: 'Ada kesalahan umum!', error: err });
    
}else{
    console.log(req.file)
    if (!req.file) {
        console.log("No file upload");
        const data = { ...req.body};
        const judul = req.judul;
        const rating = req.rating;
        const deskripsi = req.deskripsi;
        const sutradara = req.sutradara;
        const querysql = 'INSERT INTO movies (judul, rating, deskripsi, sutradara) VALUES (?, ?, ?, ?);';

        // jalankan query
        koneksi.query(querysql, [judul, rating, deskripsi, sutradara], (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan data!', error: err });
        }

        res.status(201).json({ success: true, message: 'Data berhasil ditambahkan' +data });
    });
} else {
    console.log("1");
    console.log(req.file.filename)
    var imgsrc = 'http://localhost:5000/images/' + req.file.filename
    // buat variable penampung data dan query sql
        const data = { ...req.body};
        const judul = data.judul;
        const rating = data.rating;
        const deskripsi = data.deskripsi;
        const sutradara = data.sutradara;
        const foto = imgsrc;
        const querysql = 'INSERT INTO movies (judul, rating, deskripsi, sutradara, foto) VALUES (?, ?, ?, ?, ?);';

        // jalankan query
        koneksi.query(querysql, [judul, rating, deskripsi, sutradara, foto], (err, rows, field) => {
            if (err) {
                return res.status(500).json({ message: 'Ada kesalahan data!', error: err });
            }
    
            res.status(201).json({ success: true, message: 'Data berhasil ditambahkan' +data });
        });

}
}
    });
    console.log("1");
    
     
});


// read data / get data
app.get('/api/movies', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM movies';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});



// read data / get data
app.get('/api/movies-specific/:id', (req, res) => {
    // buat query sql
    const querySql = 'SELECT judul,rating,deskripsi FROM movies where id=?';

    // jalankan query
    koneksi.query(querySql,req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});


// read data / get data
app.get('/api/movies/filter/:judul', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM movies where judul like '%' + req.params.judul + '%';';
    console.log(querySql);
    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});