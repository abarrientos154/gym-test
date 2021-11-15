"use strict";

const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
// const fs = require('fs')
const User = use("App/Models/User")
const License = use("App/Models/License")
const Role = use("App/Models/Role")
const moment = require('moment')
var ObjectId = require('mongodb').ObjectId;
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
      body.license_id = new ObjectId('6187fd1aff8458493d558f4c')
      let date = moment().format('YYYY-MM-DD')
      console.log('date :>> ', date);
      body.licenseExpirationDate = moment(date).add(1, 'months').format('YYYY-MM-DD')
      body.roles = [rol]
      const user = await User.create(body)
      response.send(user)
    }
  }

  async userInfo({ response, auth }) {
    const user = (await auth.getUser()).toJSON()
    response.send(user)
  }
  async userInfoLicense({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    if (user.roles[0] === 2) {
      let license = (await License.query().find(user.license_id)).toJSON()
      let date = moment().format('YYYY-MM-DD')
      let days = moment(user.licenseExpirationDate).diff(date , 'days')
      user.days = days
    }
    response.send(user)
  }

  async setBuy({ response, auth, params }) {
    const user = (await auth.getUser()).toJSON()
    let license = (await License.query().find(params.id)).toJSON()
    let date = moment().format('YYYY-MM-DD')
    let days = moment(user.licenseExpirationDate).diff(date , 'days')
    if (days <= 0) {
      days = 0
    }
    const update = {
      licenseExpirationDate: moment(date).add(days, 'days').add(license.months, 'months').format('YYYY-MM-DD'),
      license_id: new ObjectId(params.id)
    }
    const updateUser = await User.query().where('_id', user._id).update(update)
    console.log('update :>> ', update);

    response.send(updateUser)
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
    // const validation = await validate(dat, Asignatura.fieldValidationRules())
    // if (validation.fails()) {
    //   response.unprocessableEntity(validation.messages())
    // } else {
    // }
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
}

module.exports = UserController;
