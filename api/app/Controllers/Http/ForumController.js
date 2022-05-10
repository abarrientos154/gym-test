'use strict'

const ObjectId = require('mongodb').ObjectId
const Forum = use('App/Models/Forum')
const Question = use('App/Models/QuestionForum')
const Respon = use('App/Models/ResponseForum')
const moment = require('moment')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with forums
 */
class ForumController {
  /**
   * Show a list of all forums.
   * GET forums
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    let data = (await Forum.query().where({}).fetch()).toJSON()
    data = data.sort((a, b) => a.created_at < b.created_at)
    response.send(data)
  }
  async indexByCourse ({ response, params }) {
    const id = new ObjectId(params.id)
    let data = (await Forum.query().where({ course_id: id }).fetch()).toJSON()
    data = data.sort((a, b) => a.created_at < b.created_at)
    response.send(data)
  }
  async QuestionsForum ({ response, params }) {
    const id = (params.id)
    let data = (await Question.query().where({ forum_id: id }).with('user').fetch()).toJSON()
    data = data.sort((a, b) => a.created_at < b.created_at)
    data = data.map(v => {
      return {
        ...v,
        date: moment(v.created_at).format('DD/MM/YYYY')
      }
    })
    response.send(data)
  }
  async questionAndResponses ({ response, params }) {
    const id = (params.id)
    let data = (await Question.query().where({ _id: id }).with(['user', 'forum']).with('responses.user').first()).toJSON()
    data.date = moment(data.created_at).format('DD/MM/YYYY')
    data.responses = data.responses.map(v => {
      return {
        ...v,
        date: moment(v.created_at).format('DD/MM/YYYY')
      }
    })
    response.send(data)
  }
  

  /**
   * Render a form to be used for creating a new forum.
   * GET forums/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new forum.
   * POST forums
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    let body = request.all()
    body.course_id = new ObjectId(body.course_id)
    let forum = await Forum.create(body)
    response.send(forum)
  }
  async setQuestion ({ request, response, auth }) {
    let body = request.all()
    const user = (await auth.getUser()).toJSON()
    body.user_id = user._id
    let question = await Question.create(body)
    response.send(question)
  }
  async setResponse ({ request, response, auth }) {
    let body = request.all()
    const user = (await auth.getUser()).toJSON()
    body.user_id = user._id
    let respon = await Respon.create(body)
    response.send(respon)
  }

  /**
   * Display a single forum.
   * GET forums/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    let data = (await Forum.find(params.id)).toJSON()
    response.send(data)
  }
  /**
   * Render a form to update an existing forum.
   * GET forums/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update forum details.
   * PUT or PATCH forums/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
 async update ({ params, request, response }) {
    let body = request.all()
    body.course_id = new ObjectId(body.course_id)
    const id = new ObjectId(params.id)
    let forum = await Forum.query().where({ _id: id }).update(body)
    response.send(forum)
  }

  /**
   * Delete a forum with id.
   * DELETE forums/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
   async destroy ({ params, response }) {
    const data = await Forum.where('_id', params.id).delete()
    response.send(data)
  }
}

module.exports = ForumController
