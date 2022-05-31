'use strict'
const General = use("App/Models/General")
const GeneralTest = use("App/Models/GeneralTest")
const Topic = use("App/Models/Topic")
const Question = use("App/Models/Question")
const Articulos = use("App/Models/Article")
const Parrafos = use("App/Models/Paragraph")
var ObjectId = require('mongodb').ObjectId
const moment = require('moment')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with generaltests
 */
class GeneralTestController {
  /**
   * Show a list of all generaltests.
   * GET generaltests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  async getTestGeneral ({ request, response, params }) {
    try {
      const id = new ObjectId(params.idCourse)
      let test = (await General.findBy('course_id', id)).toJSON()
      if (test) {
        let questions = []
        // traemos las preguntas que tendra el test general
        for (let i = 0; i < test.config.length; i++) {
          let element = test.config[i]
          let questByTopic = (await Question.query().where({ topic: element.topic, course_id: id }).with('answers').with('leyInfo').fetch()).toJSON()
          questByTopic = questByTopic.sort(() => Math.random() - 0.5)
          let length = questByTopic.length >= element.number ? element.number : questByTopic.length
          for (let q = 0; q < length; q++) {
            questions.push(questByTopic[q])
          }
        }

        // Ordenamos las preguntas
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
            questions[i].parrafoInfo = (await Parrafos.query().where({article_id: Number(questions[i].articuloInfo.id)}).fetch()).toJSON()
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

        if (questions.length < 100) {
          response.send(false)
        } else {
          response.send(questions)
        }
      } else {
        response.send(false)
      }
    } catch (error) {
      console.error('get general test:' + error.name + ':' + error.message);
    }
  }

  /**
   * Render a form to be used for creating a new generaltest.
   * GET generaltests/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ params, request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let data = request.all()
    data.user_id = user._id
    data.course_id = new ObjectId(params.idCourse)
    let test = await GeneralTest.create(data)
    response.send(test)
  }

  async misTestGeneral({ params, response, auth }) {
    let courseId = new ObjectId(params.courseId)
    const user = (await auth.getUser()).toJSON()
    let allData = (await GeneralTest.query().where({user_id: user._id, course_id: courseId}).fetch()).toJSON()
    let data = []
    data = allData.reverse()
    data = data.map(v => {
      return {
        ...v,
        fecha: moment(v.created_at).format('DD/MM/YYYY')
      }
    })
    response.send(data)
  }

  async verifyQuestions ({ response, params }) {
    const id = new ObjectId(params.id)
    let data = await Question.where('course_id', id ).count()
    var isValid = false
    if (data >= 100) {
      isValid = true
    }
    isValid = true
    response.send(isValid)
  }

  async topicsWithQuestions ({ response, params }) {
    const id = new ObjectId(params.id)
    let data = (await Topic.query().where({ course_id: id }).with('questions').fetch()).toJSON()
    let config = (await General.query().where({ course_id: id }).first())
    if (config) {
      for (let x = 0; x < data.length; x++) {
        const element = data[x]
        const conf = config.config.find(v => v.topic == element.topic)
        if (conf) {
          data[x].cant = conf.number
        }
      }
     
    }
    data = data.sort(function(a, b) {
      return a.id - b.id
    }).map(v=> {
      return {
        cant: v.cant ? v.cant : 0,
        _id: v._id,
        topic: v.topic,
        questions: v.questions.length,
        name: v.name
      }
    })
    response.send(data)
  }

  /**
   * Create/save a new generaltest.
   * POST generaltests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    let body = request.all()
    let guardar = {}
    guardar.course_id = new ObjectId(body.course_id)
    let data = []
    body.data = body.data.filter(v => v.cant && v.cant != 0)
    for (let x = 0; x < body.data.length; x++) {
      const element = body.data[x]
      data.push({
        topic: element.topic,
        number: element.cant
      })
    }
    guardar.config = data
    let general 
    let config = (await General.query().where({ course_id: guardar.course_id }).first())
    if (config) {
      general = await General.where({ course_id: guardar.course_id }).update(guardar)
    } else {
      general = await General.create(guardar)
    }
    response.send(general)
  }
  /**
   * Display a single generaltest.
   * GET generaltests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing generaltest.
   * GET generaltests/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update generaltest details.
   * PUT or PATCH generaltests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a generaltest with id.
   * DELETE generaltests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = GeneralTestController
