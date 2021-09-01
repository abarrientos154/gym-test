'use strict'
const Examen = use("App/Models/Examen")
const MoveFileService = use("App/Services/MoveFileService")
const Question = use("App/Models/Question")
const ExamenTest = use("App/Models/ExamenTest")
const moment = require('moment')
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

  async misExamenes ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let allData = (await ExamenTest.query().where({user_id: user._id}).fetch()).toJSON()
    let data = []
    if (allData.length) {
      data = allData.reverse().slice(0, 4)
      data = data.map(v => {
        return {
          ...v,
          fecha: moment(v.created_at).format('DD/MM/YYYY')
        }
      })
    }
    response.send(data)
  }
  
  async examById ({ request, response, view, params }) {
    let datos = (await Examen.find(params.id)).toJSON()
    let questions = (await Question.query().where({exam: String(datos.id)}).with('answers').fetch()).toJSON()
    for (let i = 0; i < questions.length; i++) {
      questions[i].answers = questions[i].answers.map(v => {
        questions[i].selected = false
        return {
          ...v,
          isActive: false
        }
      })
    }
    datos.questions = questions
    response.send(datos)
  }

  async getTestById ({ request, response, params }) {
    try {
      let examen = (await ExamenTest.query().where({_id: params.id}).first()).toJSON()
      let questions = (await Question.query().where({exam: String(examen.examen_id)}).with('answers').with('leyInfo').with('articuloInfo').fetch()).toJSON()
      for (let i = 0; i < questions.length; i++) {
        questions[i].answers = questions[i].answers.map(v => {
          questions[i].selected = false
          return {
            ...v,
            isActive: false
          }
        })
      }
      examen.questions = questions
      response.send(examen)
    } catch (error) {
      console.error('metodo store:' + error.name + ':' + error.message);
    }
  }

  async getTestResult ({ request, response, params, auth }) {
    const user = (await auth.getUser()).toJSON()
    let tests = (await ExamenTest.query().where({examen_id: Number(params.id), user_id: user._id}).fetch()).toJSON()
    let data = {
      total_quest: tests.length ? tests[tests.length - 1].all_quest : 0,
      correctas: tests.length ? tests[tests.length - 1].correctas : 0,
      incorrectas: tests.length ? tests[tests.length - 1].incorrectas : 0,
      vacias: tests.length ? tests[tests.length - 1].all_quest - tests[tests.length - 1].total_quest : 0,
      fecha: tests.length ? moment(tests[tests.length - 1].created_at).format('DD/MM/YYYY') : null
    }
    response.send(data)
  }

  async testCreate ({ request, response, view }) {
    try {
      var data = request.all()
      data.total_quest = 0
      data.correctas = 0
      data.incorrectas = 0
      let save = await ExamenTest.create(data)

      response.send(save)
    } catch (error) {
      console.error('metodo store:' + error.name + ':' + error.message);
    }
  }

  async testUpdate ({ params, request, response }) {
    try {
      var respuesta = request.all()
      let tema = await ExamenTest.find(params.id)
      tema.total_quest = tema.total_quest + 1
      if (respuesta.selected) {
        tema.correctas = tema.correctas + 1
      } else {
        tema.incorrectas = tema.incorrectas + 1
      }
      tema.save()

      response.send(tema)
    } catch (error) {
      console.error('metodo store:' + error.name + ':' + error.message);
    }
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
      response.send(Exam)
    } catch (error) {
      console.error(error.name + 'tests: ' + error.message);
    }
  }
}

module.exports = ExamenController
