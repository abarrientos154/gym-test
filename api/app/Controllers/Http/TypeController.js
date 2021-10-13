'use strict'
const Type = use("App/Models/Type")
const Question = use("App/Models/Question")
const Examen = use("App/Models/Examen")
const TypeTest = use("App/Models/TypeTest")
const Articulos = use("App/Models/Article")
const Parrafos = use("App/Models/Paragraph")
const moment = require('moment')
var ObjectId = require('mongodb').ObjectId;

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with types
 */
class TypeController {
  /**
   * Show a list of all types.
   * GET types
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    let data = (await Type.query().where({}).fetch()).toJSON()
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
    let data = (await Type.query().where({ course_id: id }).fetch()).toJSON()
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
    let data = (await Type.find(params.id)).toJSON()
    response.send(data)
  }

  async store ({ request, response, auth }) {
    let data = request.body
    data.course_id = new ObjectId(data.course_id)
    let save = await Type.create(data)
    response.send(save)
  }

  async update ({ params, request, response }) {
    const body = request.all()
    body.course_id = new ObjectId(body.course_id)
    const update = await Type.where('_id', params.id).update(body)
    response.send(update)
  }

  async destroy ({ params, response }) {
    const data = await Type.where('_id', params.id).delete()
    response.send(data)
  }

  async misRutinas ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let allData = (await TypeTest.query().where({user_id: user._id}).fetch()).toJSON()
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

  async getTypeById ({ request, response, view, params }) {
    let datos = (await Type.find(params.id)).toJSON()
    let questions = (await Question.query().where({type: datos.type_name}).with('answers').fetch()).toJSON()
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
      let type = (await TypeTest.query().where({_id: params.id}).first()).toJSON()
      let questions = (await Question.query().where({ type: type.type_name }).with('answers').with('leyInfo').fetch()).toJSON()
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].exam !== '') {
          const id = Number(questions[i].exam)
          const exam = (await Examen.query().where({ id: id }).first()).toJSON()
          questions[i].examData = exam
        }
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
      type.questions = questions
      response.send(type)
    } catch (error) {
      console.error('metodo store:' + error.name + ':' + error.message);
    }
  }

  async getTestResult ({ request, response, params, auth }) {
    const user = (await auth.getUser()).toJSON()
    let tests = (await TypeTest.query().where({type_id: Number(params.id), user_id: user._id}).fetch()).toJSON()
    let totalQuest = 0
    let correctas = 0
    for (let i = 0; i < tests.length; i++) {
      totalQuest = totalQuest + tests[i].total_quest
      correctas = correctas + tests[i].correctas
    }
    let data = {
      total_quest: totalQuest,
      correctas: correctas,
      fecha: tests.length ? moment(tests[tests.length - 1].created_at).format('DD/MM/YYYY') : null
    }
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new type.
   * GET types/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  async testCreate ({ request, response, view }) {
    try {
      var data = request.all()
      data.total_quest = 0
      data.correctas = 0
      let save = await TypeTest.create(data)

      response.send(save)
    } catch (error) {
      console.error('metodo store:' + error.name + ':' + error.message);
    }
  }

  async testUpdate ({ params, request, response }) {
    try {
      var respuesta = request.all()
      let tema = await TypeTest.find(params.id)
      tema.total_quest = tema.total_quest + 1
      if (respuesta.selected) {
        tema.correctas = tema.correctas + 1
      }
      tema.save()

      response.send(tema)
    } catch (error) {
      console.error('metodo store:' + error.name + ':' + error.message);
    }
  }

  /**
   * Create/save a new type.
   * POST types
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  /**
   * Display a single type.
   * GET types/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  /**
   * Render a form to update an existing type.
   * GET types/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update type details.
   * PUT or PATCH types/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  /**
   * Delete a type with id.
   * DELETE types/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
}

module.exports = TypeController
