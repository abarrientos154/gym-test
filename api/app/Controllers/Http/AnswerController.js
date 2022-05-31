'use strict'
const Answer = use("App/Models/Answer")
const User = use("App/Models/User")
var ObjectId = require('mongodb').ObjectId;


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with answers
 */
class AnswerController {
  /**
   * Show a list of all answers.
   * GET answers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  
  async getAnswersByFilter ({ request, response, params }) {
    const id = new ObjectId(params.id)
    var data = []
    let filter = request.all()
    if (filter.question) {
      data = (await Answer.query().where({ id_question: filter.question, course_id: id }).fetch()).toJSON()
    }
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
        if (data[i].isCorrect === true) {
          data[i].isCorrectL = 'Si'
        } else if (data[i].isCorrect === false) {
          data[i].isCorrectL = 'No'
        }
      }
    }
    response.send(data)
  }

  async showN ({ params, response }) {
    let data = (await Answer.find(params.id)).toJSON()
    response.send(data)
  }

  async storeN ({ request, response, auth }) {
    let data = request.body
    data.course_id = new ObjectId(data.course_id)
    data.id = (await Answer.query().where({}).count()) +1
    let save = await Answer.create(data)
    response.send(save)
  }

  async updateN ({ params, request, response }) {
    const body = request.all()
    body.course_id = new ObjectId(body.course_id)
    if (body.isCorrect === true) {
      let answers = (await Answer.query().where({ id_question: body.id_question }).fetch()).toJSON()
      for (const i in answers) {
        const answerUp = await Answer.query().where({ _id: answers[i]._id }).update({ isCorrect: false })
      }
    }
    const update = await Answer.where('_id', params.id).update(body)
    response.send(update)
  }

  async destroyN ({ params, response }) {
    const data = await Answer.where('_id', params.id).delete()
    response.send(data)
  }

  async destroyAll ({ response, params }) {
    let course_id = new ObjectId(params.id)
    const data = await Answer.where({course_id: course_id}).delete()
    response.send(data)
  }

  async indexAnswer ({ response }) {
    let data = await Answer.all()
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new answer.
   * GET answers/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new answer.
   * POST answers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      let answer = request.body
      let save = await Answer.create(answer)
      response.send(save)
    } catch (error) {
      console.error(error.name + 'store: ' + error.message);
    }
  }

  /**
   * Display a single answer.
   * GET answers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try {
      let test = (await Answer.with('course').find(params.id)).toJSON()
      for (let i in test.questions) {
        const correctAnswer = test.questions[i].correct_answer - 1
        for (let j in test.questions[i].answers) {
          if (test.questions[i].answers[j].isActive === true) {
            if (parseInt(correctAnswer) === parseInt(j)) {
              test.questions[i].answers[j].isRigth = true
            } else {
              test.questions[i].answers[j].isRigth = false
            }
          }
        }
      }
      response.send(test)
    } catch (error) {
      console.error(error.name + '1: ' + error.message)
    }
  }

  /**
   * Render a form to update an existing answer.
   * GET answers/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  /**
   * Update answer details.
   * PUT or PATCH answers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    try {
      const user = (await auth.getUser()).toJSON()
      let answer = request.body
      const update = await Answer.where('_id', params.id).update(answer)
      let result = (await Answer.query().where('_id', params.id).first()).toJSON()
      const updateUser = await User.where('_id', user._id).update({points: user.points + result.total_point})
      var otras = (await Answer.query().where({id: result.id, user_id: user._id}).fetch()).toJSON()
      if (otras.length > 1) {
        var largo = otras.length - 2
        result.anterior = otras[largo].total_point
      }
      response.send(result)
    } catch (error) {
      console.error(error.name + 'update:' + error.message);
    }
  }

  /**
   * Delete a answer with id.
   * DELETE answers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = AnswerController
