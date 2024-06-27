const { error } = require('console');
const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/' , (req, res) => {
    fs.readdir('./hisaab', (err, files) => {
        if(err) return res.status(500).send(err);
        res.render('index', { files: files });
    })
})

app.get('/create', (req, res) => {
    res.render('createhisaab');    
})

app.post('/createhisaab', (req, res) => {    
    let filename;

    if(req.body.date != "on"){
        filename = req.body.filename;
    } else {
        const today = new Date();
        const date = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        filename = `${date}-${month}-${year}`;
    }

    let counter = 1;
    let fullPath = `./hisaab/${filename}.txt`;

    while(fs.existsSync(fullPath)){
        fullPath = `./hisaab/${filename}(${counter}).txt`;
        counter++;
    }

    fs.writeFile(fullPath, req.body.content, (err) => {
        if(err) return res.status(500).send(err);
        res.redirect('/');
    });
});

app.get('/delete/:filename', (req, res) => {
    fs.unlink(`./hisaab/${req.params.filename}`, (err) => {
        if(err) return res.status(500).send(err);
        res.redirect('/');
    })
})

app.get('/edit/:filename', (req, res) => {
    fs.readFile(`./hisaab/${req.params.filename}`, (err, data) => {
        if(err) return res.status(500).send(err);
        res.render('edit', {filename : req.params.filename, content : data});
    })
    // res.render('edit', {filename: req.params.filename});
})

app.post('/update/:filename', (req, res) => {
    fs.writeFile(`./hisaab/${req.params.filename}`, req.body.content, (err) =>{
        if(err) return res.status(500).send(err);
        res.redirect('/'); 
    })
})

app.get('/view/:filename', (req, res) => {
    fs.readFile(`./hisaab/${req.params.filename}`, (err, data) => {
        if(err) return res.status(500).send(err);
        res.render('view.ejs', {filename : req.params.filename, content: data});
    })
})

app.listen(3000);
