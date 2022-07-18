"use strict";

const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
// const fs = require('fs')
const User = use("App/Models/User")
const Community = use("App/Models/Community")
const ExamenTest = use("App/Models/ExamenTest")
const TypeTest = use("App/Models/TypeTest")
const Place = use("App/Models/Place")
const Email = use("App/Functions/Email")
const Role = use("App/Models/Role")
const GeneralTest = use("App/Models/GeneralTest")
const TopicTest = use("App/Models/TopicTest")
const Topic = use("App/Models/Topic")
const ByTopicTest = use("App/Models/ByTopicTest")
var randomize = require('randomatic');
const Mail = use("App/Functions/Email")
var ObjectId = require('mongodb').ObjectId;
const moment = require('moment')
const Course = use('App/Models/Course')
// const { validate } = use("Validator")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let users = (await User.query().where({roles: [2]}).fetch()).toJSON()
    users = users.filter(v => v._id !== user._id)
    response.send(users);
  }

  async statisticUsers({ request, response, auth }) {
    let users = (await User.query().where({roles: [2]}).fetch()).toJSON()
    for (let i = 0; i < users.length; i++) {
      let tests = (await TopicTest.query().where({user_id: users[i]._id}).with('testInfo').fetch()).toJSON()
      let testByTema = (await ByTopicTest.query().where({user_id: users[i]._id}).fetch()).toJSON()
      let testGeneral = (await GeneralTest.query().where({user_id: users[i]._id}).fetch()).toJSON()
      let examenes = (await ExamenTest.query().where({user_id: users[i]._id}).with('examenInfo').fetch()).toJSON()
      let gym = (await TypeTest.query().where({user_id: users[i]._id}).with('typeInfo').fetch()).toJSON()

      tests = tests.map(v => {
        return {
          ...v,
          type_data: 'Test',
          fecha: moment(v.created_at).format('DD/MM/YYYY')
        }
      })
      for (let i in testByTema) {
        let temasInfo = []
        for (let t in testByTema[i].temas) {
          let tema = (await Topic.findBy('id', testByTema[i].temas[t]))
          if (tema) {
            temasInfo.push(tema.name)
          }
        }
        testByTema[i].temasInfo = temasInfo
        testByTema[i].type_data = 'Test por tema'
        testByTema[i].fecha = moment(testByTema[i].created_at).format('DD/MM/YYYY')
      }
      for (let i in testGeneral) {
        testGeneral[i].type_data = 'Test general'
        let idC = new ObjectId(testGeneral[i].course_id)
        testGeneral[i].test_name = (await Course.query().find(idC)).name
        testGeneral[i].fecha = moment(testGeneral[i].created_at).format('DD/MM/YYYY')
      }
      examenes = examenes.map(v => {
        return {
          ...v,
          type_data: 'Examen',
          fecha: moment(v.created_at).format('DD/MM/YYYY')
        }
      })
      gym = gym.map(v => {
        return {
          ...v,
          type_data: 'Rutina de entrenamiento',
          fecha: moment(v.created_at).format('DD/MM/YYYY')
        }
      })

      let allData = tests.concat(testByTema, testGeneral, examenes, gym)

      users[i].data = allData.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1
        } else if (a.created_at < b.created_at) {
          return 1
        }
        return 0
      })
    }
    response.send(users);
  }

  async indexListable ({ response }) {
    let data = (await User.query().where({ roles: { $eq: [2] }}).fetch()).toJSON()
    if (data !== []) {
      for (const i in data) {
        data[i].actions = [
          {
            color: "primary",
            icon: "edit",
            url: "",
            action: "",
            title: "Editar",
          },
          {
            color: data[i].disabled === true ? "green" : "red",
            icon: data[i].disabled === true ? "toggle_on" : "toggle_off",
            url: "",
            action: "",
            title: data[i].disabled === true ? "Habilitar" : "Deshabilitar",
          }
        ]
        data[i].communityName = (await Community.query().find(data[i].community)).name
        data[i].placeName = (await Place.query().find(data[i].place)).name
      }
    }
    response.send(data)
  }

  async show ({ params, response }) {
    let data = (await User.find(params.id)).toJSON()
    response.send(data)
  }

  async login({ auth, request }) {
    const { email, password } = request.all();
    let token = await auth.attempt(email, password)
    const user = (await User.findBy('email', email)).toJSON()
    let isUser = false
    token.roles = user.roles.map(roleMap => {
      if (roleMap === 2) {
        isUser = true
      }
      return roleMap
    })
    let userRoles = await Role.whereIn('id', token.roles).fetch()
    let permissions = userRoles.toJSON()
    token.permissions = []
    permissions.forEach(element => {
      element.permissions.forEach(element2 => {
        token.permissions.push(element2)
      })
    })

    if (user.roles[0] === 2 && !user.isChecked) {
      user.checkCode = randomize('0', 4)
      const updateCode = await User.query().where({_id: user._id}).update({checkCode: user.checkCode})
      let mail = await Mail.sendMail(user.email, `Código de vericación para la cuenta de ${user.name}`,
        `Tu codigo de verificación es ${user.checkCode}. Por favor, introducelo para verificar tu cuenta`)
    }

    token.email = user.email
    token.estatus = user.estatus
    token.full_name = user.full_name ? user.full_name : null
    token.last_name = user.last_name
    token._id = user._id
    token.isChecked = user.isChecked ? user.isChecked : false
    token.disabled = user.disabled
    let data = {}
    data.SESSION_INFO = token
    return data
  }

  async register({ request, response }) {
    var dat = request.only(['dat'])
    dat = JSON.parse(dat.dat)
    if (((await User.where({email: dat.email}).fetch()).toJSON()).length) {
      response.unprocessableEntity([{
        message: 'Correo ya registrado en el sistema!'
      }])
    } else {
      let body = dat
      const rol = body.roles
      body.roles = [rol]
      body.checkCode = randomize('0', 4)
      /* let mail = await Mail.sendMail(body.email, `Código de vericación para la cuenta de ${body.name}`,
        `Tu codigo de verificación es ${body.checkCode}. Por favor, introducelo para verificar tu cuenta`)

 */      const user = await User.create(body)

      if (request.file('files', { types: ['image'] })) {
        const profilePic = request.file('files', {
          types: ['image']
        })
        if (Helpers.appRoot('storage/uploads/perfil')) {
          await profilePic.move(Helpers.appRoot('storage/uploads/perfil'), {
            name: String(user._id),
            overwrite: true
          })
        } else {
          mkdirp.sync(`${__dirname}/storage/Excel`)
        }
      }
      response.send(user)
    }
  }

  async verifyAccount ({ response, auth }) {
    const user = (await auth.getUser()).toJSON()
    const userVerified = await User.query().where({_id: user._id}).update({isChecked: true, checkCode: null})
    response.send(userVerified)
  }

  async userInfo({ response, auth }) {
    const user = (await auth.getUser()).toJSON()
    response.send(user)
  }

  async logueoSinContrasena ({ auth, response, params, request }) {
    let body = request.only(['user_id'])
    let user = await User.find(body.user_id)
    let tokeng = await auth.generate(user)

    let token = { ...tokeng, ...user }
    let isUser = false
    token.roles = user.roles.map(roleMap => {
      if (roleMap === 3) {
        isUser = true
      }
      return roleMap
    })
    let userRoles = await Role.whereIn('id', token.roles).fetch()
    let permissions = userRoles.toJSON()
    token.permissions = []
    permissions.forEach(element => {
      element.permissions.forEach(element2 => {
        token.permissions.push(element2)
      })
    })
    token._id = user._id
    token.email = user.email
    let data = {}
    data.SESSION_INFO = token
    return data

  }

  async update ({ params, request, response }) {
    var dat = request.only(['dat'])
    dat = JSON.parse(dat.dat)
    if (request.file('files', { types: ['image'] })) {
      const profilePic = request.file('files', {
        types: ['image']
      })
      if (Helpers.appRoot('storage/uploads/perfil')) {
        await profilePic.move(Helpers.appRoot('storage/uploads/perfil'), {
          name: params.id,
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }
    }
    let modificar = await User.query().where('_id', params.id).update(dat)
    response.send(modificar)
  }
  async updateUserInfo ({ params, request, response }) {
    var dat = request.all()
    let modificar = await User.query().where('_id', params.id).update(dat)
    response.send(modificar)
  }

  async updatePerfilImg ({ request, response, auth }) {
    let user = (await auth.getUser()).toJSON()
    var profilePic = request.file('files', {
      types: ['image'],
      size: '25mb'
    })
    if (profilePic) {
      if (Helpers.appRoot('storage/uploads/perfil')) {
        await profilePic.move(Helpers.appRoot('storage/uploads/perfil'), {
          name: user._id.toString(),
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }

      if (!profilePic.moved()) {
        return profilePic.error()
      } else {
        await User.query().where('_id', user._id.toString()).update({ perfile: true })
        response.send(user)
      }
    }
  }
  async update ({ params, request, response }) {
    const body = request.all()
    const update = await User.where('_id', params.id).update(body)
    response.send(update)
  }
  async recuperacionapp ({ request, response, params }) {
    if (((await User.where({email: params.email}).fetch()).toJSON()).length) {
      let codigo = randomize('Aa0', 30)
      await User.query().where({email: params.email}).update({codigoRecuperacion: codigo})
      let mail = await Email.sendMail(params.email, 'Recuperación de Correo', `
          <center>
            <img src="https://gymtest.eichechile.com/old/logo.png" alt="logo" />
          </center>
          <h2 style="text-align:center">
            Haz solicitado restablecer tu contraseña
          </h2>
          <div style="text-align:center">
            Ingrese al link https://app.gymrecuperacion.com/recuperacion?codigo=${codigo} para restablecer su contraseña
          </div>
          `)
        response.send(mail)
    } else {
      response.unprocessableEntity([{
        message: 'Correo no registrado en el sistema!',
        error: true
      }])
    }
  }

  async actualizarPass({ request, response, params }) {
    let user = await User.findBy('codigoRecuperacion', params.code)
    let data = request.only(['password'])
    user.password = data.password
    user.codigoRecuperacion = null
    await user.save()
    response.send(user)
  }
  async toDisable ({ params, response, request }) {
    const { action } = request.all()
    if (action === 1) {
      const update = await User.where('_id', params.id).update({ disabled: true })
      response.send(true)
    } else if (action === 0) {
      const update = await User.where('_id', params.id).update({ disabled: false })
      response.send(false)
    }
  }

  async destroyAll ({ response }) {
    const data = await User.where({ roles: { $eq: [2] } }).delete()
    response.send(data)
  }
}

module.exports = UserController;
