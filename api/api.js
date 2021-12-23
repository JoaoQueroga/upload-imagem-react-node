const express = require('express');
const cors = require('cors');
const multer = require('multer');

const conexao = require('./mysql');

const app = express();

app.use(express.static(__dirname + '/files'));

const storage = multer.diskStorage({ //midw
    destination: function (req, file, cb) {
        cb(null, './files')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    },
});

const upload = multer({storage: storage});

app.use(cors());
app.use(express.json());

function executaSql(query,dados, res){ // executa a query e responde
    conexao.query(query,dados, function(error, results){
        if(error){ 
            res.json(error);
        }else{
            res.json(results);
        }
    });
}

app.post('/foto', upload.single('file') , (req, res)=>{

    if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });
    } else {
        let query = `INSERT INTO facesfmm.imagens (url) VALUES (?)`;
        let dados = [req.file.filename];
        executaSql(query,dados, res);
    }
    
})

app.get('/baixar-fotos', (req, res)=>{
    let query = `SELECT * FROM facesfmm.imagens`;
    let dados = [];
    executaSql(query,dados, res);
})

app.listen(8080, ()=>{
    console.log('api on');
})