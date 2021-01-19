//Carregando os módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express();
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
require("./config/auth")(passport)

//Configurações 
//Sessão
app.use(session({
    secret: 'celkeonesession',
    resave: true,
    saveUninitialized: true
}))
//Passport
app.use(passport.initialize())
app.use(passport.session())
//Flash
app.use(flash())

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//handlebars
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))
app.set("view engine", 'handlebars');

//Conxection DB
//connexão Umbler com banco de dados MongoDB
//mongoose.connect('mongodb://anderson:Genova31@mongo_celke:27017/celke', {
 //connexão Localhot com banco de dados MongoDB   
mongoose.connect('mongodb://localhost:27017/celke', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conexão com BD MongoDB realizado com sucesso!");
}).catch((err) => {
    console.log("Erro: Conexão com o BD MongoDB não realizado com sucesso: " + err);
});

//Archives statics
app.use(express.static(path.join(__dirname,"public")))

//Routes
app.use('/admin', admin);

//model de conection in the Umbler
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Servidor iniciado na porta " + port + ": http://anderson.souza.nom.br");
});