'use strict'
const Answer = use("App/Models/Answer")
const Desafios = use("App/Models/Desafio")
const User = use("App/Models/User")

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
  async indexAnswer ({ response }) {
    let data = await Answer.all()
    response.send(data)
  }
  async index ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let desafio = (await Desafios.query().where({status2: 0, desafiado_id: user._id}).first())
    response.send(desafio)
  }

  async indexDesafiado ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let desafios = (await Desafios.query().where({desafiado_id: user._id}).with('creadorInfo').with('desafiadoInfo').fetch()).toJSON()
    response.send(desafios)
  }

  async indexCreador ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let desafios = (await Desafios.query().where({creador_id: user._id}).with('creadorInfo').with('desafiadoInfo').fetch()).toJSON()
    response.send(desafios)
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

  async storeDesafio ({ request, response }) {
    try {
      let desafio = request.body
      let save = await Desafios.create(desafio)
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

  async showDesafio ({ params, request, response, view }) {
    try {
      let desafio = (await Desafios.query().where({_id: params.id}).first()).toJSON()
      desafio.creadorInfo = (await User.query().where({_id: desafio.creador_id}).first()).toJSON()
      desafio.desafiadoInfo = (await User.query().where({_id: desafio.desafiado_id}).first()).toJSON()
      response.send(desafio)
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
  async edit ({ params, request, response, view }) {
    let data = request.all()
    const update = await Desafios.where('_id', params.id).update(data)
    response.send(update)
  }

  async editDesafio ({ params, request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let recibido = request.all()
    let id = (await Desafios.query().where('_id', params.id).first()).toJSON()
    var data = {}
    let user1 = (await User.find(id.creador_id))
    let user2 = (await User.find(id.desafiado_id))
    if (user._id === id.creador_id) {
      data = {
        total_point1: recibido.total_point,
        correctas1: recibido.correctas,
        omitidas1: recibido.omitidas,
        status1: 2
      }
      if (id.status2 === 2) {
        if (id.total_point2 > data.total_point1) {
          data.ganador = 2
          user2.points = user2.points + id.total_point2
          if (user1.points >= id.total_point2) {
            user1.points = user1.points - id.total_point2
          } else {
            user1.points = 0
          }
          user1.save()
          user2.save()
        } else {
          data.ganador = 1
          user1.points = user1.points + data.total_point1
          if (user2.points >= data.total_point1) {
            user2.points = user2.points - data.total_point1
          } else {
            user2.points = 0
          }
          user1.save()
          user2.save()
        }
      }
    } else {
      data = {
        total_point2: recibido.total_point,
        correctas2: recibido.correctas,
        omitidas2: recibido.omitidas,
        status2: 2
      }
      if (id.status1 === 2) {
        if (id.total_point1 > data.total_point2) {
          data.ganador = 1
          user1.points = user1.points + id.total_point1
          if (user2.points >= id.total_point1) {
            user2.points = user2.points - id.total_point1
          } else {
            user2.points = 0
          }
          user1.save()
          user2.save()
        } else {
          data.ganador = 2
          user2.points = user2.points + data.total_point2
          if (user1.points >= data.total_point2) {
            user1.points = user1.points - data.total_point2
          } else {
            user1.points = 0
          }
          user1.save()
          user2.save()
        }
      }
    }
    const update = await Desafios.where('_id', params.id).update(data)
    response.send(update)
  }

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
