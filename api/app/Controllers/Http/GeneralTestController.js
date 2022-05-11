'use strict'
const GeneralTest = use("App/Models/GeneralTest")
const Topic = use("App/Models/Topic")
const Question = use("App/Models/Question")
var ObjectId = require('mongodb').ObjectId
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

  /**
   * Render a form to be used for creating a new generaltest.
   * GET generaltests/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }
  async verifyQuestions ({ response, params }) {
    const id = new ObjectId(params.id)
    let data = (await Question.query().where({ course_id: id }).fetch()).toJSON()
    var isValid = false
    if (data.length >= 100) {
      isValid = true
    }
    isValid = true
    response.send(isValid)
  }

  async topicsWithQuestions ({ response, params }) {
    const id = new ObjectId(params.id)
    let data = (await Topic.query().where({ course_id: id }).with('questions').fetch()).toJSON()
    let config = (await GeneralTest.query().where({ course_id: id }).first()).toJSON()
    if (config) {
      for (let x = 0; x < data.length; x++) {
        const element = data[x]
        const conf = config.config.find(v => v.topic == element._id)
        if (conf) {
          data[x].cant = conf.number
        }
      }
     
    }
    data = data.sort(function(a, b) {
      return a.id - b.id
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
    body.data = body.data.filter(v => v.cant || v.cant != 0)
    for (let x = 0; x < body.data.length; x++) {
      const element = body.data[x]
      data.push({
        topic: element._id,
        number: element.cant
      })
    }
    guardar.config = data
    let general 
    let config = (await GeneralTest.query().where({ course_id: guardar.course_id }).first()).toJSON()
    if (config) {
      general = await GeneralTest.where({ course_id: guardar.course_id }).update(guardar)
    } else {
      general = await GeneralTest.create(guardar)
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
