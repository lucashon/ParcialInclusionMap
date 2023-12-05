const express = require('express')
const router = express.Router()

const infoController = require('../controllers/infoController')

//Localhost:3000/?/add

// Cadastrar e Login pós cadastro de usuarios
router.get('/home', infoController.createCadastro)
router.post('/home' , infoController.addCadastro)


// Login e Logout
router.post('/login', infoController.loginPost)
router.get('/logout', infoController.logout)
router.get('/login/:id', infoController.perfilCitizen)


// Prefeitura - ver dados e quantidade, detalhes das contas e pode excluir
router.get('/dados', infoController.mostrarInfo)
router.get('/mostrar', infoController.detalhes)
router.get('/perfil/:id', infoController.perfil)
router.post('/delete/:id',infoController.excluir)

// Usuario edita e volta do perfil
router.post('/edit', infoController.update)
router.get('/edit/:id', infoController.update1 )
router.get('/song/:id', infoController.voltarMostrar)


module.exports = router