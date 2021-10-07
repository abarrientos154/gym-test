'use strict'
const Fault = use('App/Models/Fault')
const Community = use('App/Models/Community')
const Place = use('App/Models/Place')
const ObjectId = require('mongodb').ObjectId

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with faults
 */
class FaultController {
  /**
   * Show a list of all faults.
   * GET faults
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  async indexByCourse ({ response, params }) {
    const id = new ObjectId(params.id)
    let data = (await Fault.query().where({ course_id: id }).with('question.answers').with('user').fetch()).toJSON()
    if (data !== []) {
      for (const i in data) {
        const community = (await Community.query().find(data[i].user.community)).toJSON()
        const place = (await Place.query().find(data[i].user.place)).toJSON()
        data[i].questionButton = [
          {
            color: "primary",
            icon: "quiz",
            url: "",
            action: "",
            title: "Pregunta",
            question: data[i].question.title
          }
        ]
        data[i].userButton = [
          {
            color: "primary",
            icon: "person",
            url: "",
            action: "",
            title: "Usuario",
            user: data[i].user.name
          }
        ]
        data[i].user.communityName = community.name
        data[i].user.placeName = place.name
      }
    }
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new fault.
   * GET faults/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new fault.
   * POST faults
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    let body = request.body
    body.course_id = new ObjectId(body.course_id)
    body.user_id = new ObjectId(body.user_id)
    body.question_id = new ObjectId(body.question_id)
    const fault = await Fault.create(body)
    response.send(fault)
  }

  /**
   * Display a single fault.
   * GET faults/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing fault.
   * GET faults/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update fault details.
   * PUT or PATCH faults/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a fault with id.
   * DELETE faults/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = FaultController
