"use strict";

const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
// const fs = require('fs')
const User = use("App/Models/User")
const Role = use("App/Models/Role")
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

    // console.log(permissions, 'permissions')
    token.email = user.email
    token.estatus = user.estatus
    token.full_name = user.full_name ? user.full_name : null
    token.last_name = user.last_name
    token._id = user._id
    let data = {}
    data.SESSION_INFO = token
    return data
  }

  async register({ request, response }) {
    var dat = request.all()
    if (((await User.where({email: dat.email}).fetch()).toJSON()).length) {
      response.unprocessableEntity([{
        message: 'Correo ya registrado en el sistema!'
      }])
    } else {
      let body = dat
      const rol = body.roles
      body.roles = [rol]
      const user = await User.create(body)
      response.send(user)
    }
  }

  async userInfo({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    response.send(user)
  }

  async update ({ params, request, response }) {
    var dat = request.only(['dat'])
    dat = JSON.parse(dat.dat)
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
    // const validation = await validate(dat, Asignatura.fieldValidationRules())
    // if (validation.fails()) {
    //   response.unprocessableEntity(validation.messages())
    // } else {
    // }
    let modificar = await User.query().where('_id', params.id).update(dat)
    response.send(modificar)
  }
}

module.exports = UserController;
