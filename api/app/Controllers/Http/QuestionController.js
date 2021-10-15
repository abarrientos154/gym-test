'use strict'
const Question = use("App/Models/Question")
const Answer = use("App/Models/Answer")
const Law = use("App/Models/Law")
// const Asignatura = use("App/Models/Asignatura")
// const Niveles = use("App/Models/Nivele")
const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
var ObjectId = require('mongodb').ObjectId;

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with questions
 */
class QuestionController {
  /**
   * Show a list of all questions.
   * GET questions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    let data = (await Question.query().where({}).fetch()).toJSON()
    if (data !== []) {
      for (const i in data) {
        let law = await Law.query().where({ id: data[i].law_id }).first()
        if (law !== null) {
          data[i].lawName = law.law_name
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
  async getQuestionsByFilter ({ request, response, params }) {
    let filter = request.all()
    var data = []
    const id = new ObjectId(params.id)
    if (filter.topic && filter.type === null) {
      data = (await Question.query().where({ topic: filter.topic, course_id: id }).fetch()).toJSON()
    } else if (filter.type && filter.topic === null) {
      data = (await Question.query().where({ type: filter.type, course_id: id }).fetch()).toJSON()
    } else if (filter.topic && filter.type) {
      data = (await Question.query().where({ type: filter.type, topic: filter.topic, course_id: id }).fetch()).toJSON()
    }
    if (data !== []) {
      for (const i in data) {
        let law = await Law.query().where({ id: data[i].law_id }).first()
        if (law !== null) {
          data[i].lawName = law.law_name
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
    if (data !== null && data !== undefined) {
      data = data.sort(function (a, b) {
        return a.id - b.id
      })
    }
    response.send(data)
  }

  async getQuestionsByTopic ({ params, response }) {
    const data = (await Question.query().where({ topic: params.id }).fetch()).toJSON()
    response.send(data)
  }

  /* async getQuestionsbyTest ({ response, params }) {
    const id = parseInt(params.id)
    try {
      const data = (await Question.query().where({ test_id: id }).fetch()).toJSON()
      response.send(data)
    } catch (e) {
      console.error(e.name + ': ' + e.message)
    }
  }
 */

  async getQuestionsbyExam ({ request, response, view, params }) {
    let data = (await Question.query().where({ examen_id: params.id }).fetch()).toJSON()
    response.send(data)
  }

  async getFullQuestions ({ response }) {
    /*try {
      let data = (await Asignatura.query().where({}).with('tests.questions').fetch()).toJSON()
      response.send(data)
    } catch (error) {
      console.error(error.name + 'fullQuestions: ' + error.message);
    }*/
  }

  /**
   * Render a form to be used for creating a new question.
   * GET questions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new question.
   * POST questions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    let body = request.body
    body.course_id = new ObjectId(body.course_id)
    const save = await Question.create(body)
    response.send(save)
  }

  async multiplesQuestions ({ request, response }) {
    /*try {
      let { multiple, id, _id } = request.all()
      let test = await Niveles.find(_id)
      test.hasExamId = true
      test.merge()
      await test.save()
      for (let i in multiple) {
        multiple[i].exam_id = id
        const update = await Question.where('_id', multiple[i]._id).update(multiple[i])
      }
      response.send(true)
    } catch (error) {
      console.error(error.name + ' multiplesQuestions: ' + error.message);
    }*/
  }

  /**
   * Display a single question.
   * GET questions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    let data = (await Question.find(params.id)).toJSON()
    response.send(data)
  }

  /**
   * Render a form to update an existing question.
   * GET questions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update question details.
   * PUT or PATCH questions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const body = request.all()
    body.course_id = new ObjectId(body.course_id)
    const update = await Question.where('_id', params.id).update(body)
    response.send(update)
  }

  /**
   * Delete a question with id.
   * DELETE questions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const id = (await Question.query().find(params.id)).id
    const questToDestroy = await Question.where('_id', params.id).delete()
    const answers = (await Answer.query().where('id_question', id).fetch()).toJSON()
    for (const i in answers) {
      const answToDestroy = await Answer.where({ _id: answers[i]._id }).delete()
    }
    response.send(questToDestroy)
  }
  async destroyAll ({ response }) {
    const data = await Question.where({}).delete()
    const data2 = await Answer.where({}).delete()
    response.send(data)
  }
}

module.exports = QuestionController
