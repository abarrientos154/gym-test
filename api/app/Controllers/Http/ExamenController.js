'use strict'
const Examen = use("App/Models/Examen")
// const { validate } = use("Validator")
// const Helpers = use('Helpers')
// const mkdirp = use('mkdirp')
// const fs = require('fs')
// var randomize = require('randomatic');
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with productos
 */
class ExamenController {
  /**
   * Show a list of all Examenes.
   * GET examenes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    let datos = await Examen.all()
    response.send(datos)
  }
  
  async examById ({ request, response, view, params }) {
    let datos = (await Examen.find(params.id)).toJSON()
    response.send(datos)
  }

  async store ({ request, response, auth }) {
    var dat = request.body
    // const validation = await validate(dat, Examen.fieldValidationRules())
    // if (validation.fails()) {
    //   response.unprocessableEntity(validation.messages())
    // } else {
    // }
    let guardar = await Examen.create(dat)
    response.send(guardar)
  }

  async update ({ params, request, response }) {
    var dat = request.body
    // const validation = await validate(dat, Examen.fieldValidationRules())
    // if (validation.fails()) {
    //   response.unprocessableEntity(validation.messages())
    // } else {
    // }
    let modificar = await Examen.query().where('_id', params.id).update(dat)
    response.send(modificar)
  }

  async destroy ({ params, request, response }) {
    let examen = await Examen.find(params.id)
    await examen.delete()
    response.send(examen)
  }
  async getExamWithTest ({ request, response, params }) {
    try {
      let Exam = await Examen.with('tests').find(params.id)
      console.log('Exam :>> ', Exam);
      response.send(Exam)
    } catch (error) {
      console.error(error.name + 'tests: ' + error.message);
    }
  }
}

module.exports = ExamenController
