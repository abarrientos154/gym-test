'use strict'
const Examen = use("App/Models/Examen")
const MoveFileService = use("App/Services/MoveFileService")
const Question = use("App/Models/Question")
const ExamenTest = use("App/Models/ExamenTest")
const Articulos = use("App/Models/Article")
const Parrafos = use("App/Models/Paragraph")
const moment = require('moment')
var ObjectId = require('mongodb').ObjectId;

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
    let data = (await Examen.query().where({}).fetch()).toJSON()
    if (data !== []) {
      for (const i in data) {
        if (data[i].date === null) {
          data[i].date = ''
        } else {
          data[i].date = moment(data[i].date).format('DD/MM/YYYY')
        }
        data[i].actions = [
          {
            color: "primary",
            icon: "edit",
            url: "",
            action: "",
            title: "Editar",
          },
          {
            color: "red",
            icon: "delete",
            url: "",
            action: "",
            title: "Eliminar",
          }
        ]
      }
    }
    response.send(data)
  }
  async indexByCourse ({ response, params }) {
    const id = new ObjectId(params.id)
    let data = (await Examen.query().where({ course_id: id }).fetch()).toJSON()
    if (data !== []) {
      for (const i in data) {
        if (data[i].date === null) {
          data[i].date = ''
        } else {
          data[i].date = moment(data[i].date).format('DD/MM/YYYY')
        }
        data[i].actions = [
          {
            color: "primary",
            icon: "edit",
            url: "",
            action: "",
            title: "Editar",
          },
          {
            color: "red",
            icon: "delete",
            url: "",
            action: "",
            title: "Eliminar",
          }
        ]
      }
    }
    data = data.sort(function (a, b) {
      return a.id - b.id
    })
    response.send(data)
  }

  async show ({ params, response }) {
    let data = (await Examen.find(params.id)).toJSON()
    response.send(data)
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
      let questions = (await Question.query().where({exam: String(examen.examen_id)}).with('answers').with('leyInfo').fetch()).toJSON()
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].answers[0].order === null || questions[i].answers[0].order === '') {
          questions[i].answers = questions[i].answers.sort(() => Math.random() - 0.5)
        } else {
          var arrayAnswers = []
          arrayAnswers[0] = questions[i].answers.find(v => v.order.toLowerCase() === 'a')
          arrayAnswers[1] = questions[i].answers.find(v => v.order.toLowerCase() === 'b')
          arrayAnswers[2] = questions[i].answers.find(v => v.order.toLowerCase() === 'c')
          arrayAnswers[3] = questions[i].answers.find(v => v.order.toLowerCase() === 'd')
          questions[i].answers = arrayAnswers
        }
        questions[i].articuloInfo = (await Articulos.query().where({article_name: questions[i].article, law: questions[i].law_id}).first())
        if (questions[i].articuloInfo) {
          questions[i].parrafoInfo = (await Parrafos.query().where({article_id: String(questions[i].articuloInfo._id)}).fetch()).toJSON()
        } else {
          questions[i].parrafoInfo = []
        }
        if (questions[i].parrafoInfo.length) {
          questions[i].parrafoInfo.sort(function(a, b) {
            return a.order - b.order;
          })
        }
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
    let data = request.body
    data.course_id = new ObjectId(data.course_id)
    let guardar = await Examen.create(data)
    response.send(guardar)
  }

  async update ({ params, request, response }) {
    var dat = request.body
    // const validation = await validate(dat, Examen.fieldValidationRules())
    // if (validation.fails()) {
    //   response.unprocessableEntity(validation.messages())
    // } else {
    // }
    dat.course_id = new ObjectId(dat.course_id)
    let modificar = await Examen.query().where('_id', params.id).update(dat)
    response.send(modificar)
  }

  async destroy ({ params, response }) {
    const data = await Examen.where('_id', params.id).delete()
    response.send(data)
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
