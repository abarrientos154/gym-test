'use strict'

const Asignatura = use("App/Models/Asignatura")
const Answer = use("App/Models/Answer")
// const { validate } = use("Validator")
// const Helpers = use('Helpers')
// const mkdirp = use('mkdirp')
// const fs = require('fs')
// var randomize = require('randomatic');
const moment = require('moment')
const User = use("App/Models/User")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AsignaturaController {
  async index ({ request, response, view }) {
    let datos = (await Asignatura.query().where({}).with('tests').fetch()).toJSON()
    response.send(datos)
  }

  async getAsignaturaById ({ request, response, params }) {
    let asignatura = await Asignatura.find(params.id)
    response.send(asignatura)
  }
  async getCourseWithTest ({ auth, response, params }) {
    try {
      const user = (await auth.getUser()).toJSON()
      let course = (await Asignatura.query().where('_id', params.id).with('tests').first()).toJSON()
      if (user.roles[0] === 2) {
        for (let i = 0; i < course.tests.length; i++) {
          var datos = (await Answer.query().where({id: course.tests[i].id, user_id: user._id}).fetch()).toJSON()
          if (datos.length) {
            var mayor = 0
            var fecha = ''
            for (let j = 0; j < datos.length; j++) {
              if (datos[j].total_point > mayor) {
                mayor = datos[j].total_point
                fecha = moment(datos[j].created_at).format('DD/MM/YYYY')
              }
            }
            course.tests[i].fecha_test = fecha
            course.tests[i].total_point = mayor
          } else {
            course.tests[i].fecha_test = moment(course.tests[i].created_at).format('DD/MM/YYYY')
            course.tests[i].total_point = 0
          }
        }
      }
      response.send(course)
    } catch (error) {
      console.error(error.name + 'tests: ' + error.message);
    }
  }

  async update ({ params, request, response }) {
    var dat = request.body
    // const validation = await validate(dat, Asignatura.fieldValidationRules())
    // if (validation.fails()) {
    //   response.unprocessableEntity(validation.messages())
    // } else {
    // }
    let modificar = await Asignatura.query().where('_id', params.id).update(dat)
    response.send(modificar)
  }
}


module.exports = AsignaturaController
