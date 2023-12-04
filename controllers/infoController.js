const { Router } = require('express')
const Cidadaos = require('../models/cidadaos')

module.exports = class infoController {

    //////// rota home
    static createCadastro(request, response) {
        return response.render('home')
    }



    /////// cadastrar usuarios
    static async addCadastro(request, response) {
        const { nome, email, senha, cpf, descricao, dificuldade } = request.body



        const checkIfUserExist = await Cidadaos.findOne({ where: { email: email } })
        console.log(checkIfUserExist)
        if (checkIfUserExist) {
            return
        }

        const cadastro = {
            nome,
            email,
            senha,
            cpf,
            descricao,
            dificuldade
        }
        const checkIf = request.body.email

        try {
            const createUser = await Cidadaos.create(cadastro)
            request.session.userId = createUser.id
            // contar cadastros
            const count = await Cidadaos.count()
            // Mostrar o perfil de quem fez o cadastro
            const user = await Cidadaos.findOne({ raw: true, where: { email: checkIf } })
            const id = user.id
            console.log(checkIf)


            request.session.save(() => {
                response.render('dados', { count, id })
                return;
            })
        } catch (error) {
            console.log(error)
        }
    }

    ////////////////// Quantidade
    static async mostrarInfo(request, response) {

        try {
            const count = await Cidadaos.count()
            return response.render('dadosPrefeitura', { count })

        } catch (error) {
            console.log(error)
            return response.status(500).send('Erro interno do servidor ')
        }

    }


    ///////////////////////// mostrar Para prefeitura
    static async detalhes(request, response) {
        const count = await Cidadaos.count()
        const info = await Cidadaos.findAll({ raw: true })
        return response.render('info', { info, count })
    }

    //////////////////////// // Perfil - prefeitura
    static async perfil(request, response) {
        const id = request.params.id
        const perfil = await Cidadaos.findOne({ raw: true, where: { id: id } })

        return response.render('individual', { perfil })
    }

    //////////////// Excluir perfil - Prefeitura 
    static async excluir(request, response) {
        const id = request.params.id
        await Cidadaos.destroy({ where: { id: id } })

        return response.redirect('/inclusion/mostrar')
    }



    // Mostrar dados antes do update //UPDATE etapa 01

    static async update1(request, response) {
        const id = request.params.id
        const perfilCitizen = await Cidadaos.findOne({ raw: true, where: { id: id } })
        return response.render('edit', { perfilCitizen })
    }

    // Fazer o UPDATE

    static async update(request, response) {
        const id = request.body.id
        const novosDados = {
            nome: request.body.nome,
            email: request.body.email,
            senha: request.body.senha,
            cpf: request.body.cpf,
            deficiencia: request.body.deficiencia,
            dificuldade: request.body.dificuldade
        }
        await Cidadaos.update(novosDados, { where: { id: id } })

        return response.redirect(`/inclusion/login/${id}`)
    }


    // PERFIL
    static async perfilCitizen(request, response) {
        const id = request.params.id
        const perfilCitizen = await Cidadaos.findOne({ raw: true, where: { id: id } })


        return response.render('user', { perfilCitizen })
    }
    //  Voltar do perfil 
    static async voltarMostrar(request, response) {
        const id = request.params.id

        console.log(id)
        try {
            const count = await Cidadaos.count()
            const user = await Cidadaos.findOne({ raw: true, where: { id: id } })

            response.render('dados', { count, id })
            return;

        } catch (error) {
            console.log(error)
        }

    }




    // Rota para Login Cidadão

    static async loginPost(request, response) {
        const { email, senha } = request.body

        const user = await Cidadaos.findOne({ where: { email: email } })

        // Validar email
        if (!user) {
            request.flash('message', 'Usuário não encontrado')
            response.redirect('/')
        }


        request.session.userId = user.id

        request.flash('message', 'Autenticação realizado com sucesso!')
        request.session.save(() => {
            response.redirect('/')
        })

    }

    static async logout(request, response) {
        request.session.destroy()
        response.redirect('/')
    }
}



