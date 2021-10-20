'use strict'
const Paragraph = use('App/Models/Paragraph')
var ObjectId = require('mongodb').ObjectId;

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with paragraphs
 */
class ParagraphController {
  /**
   * Show a list of all paragraphs.
   * GET paragraphs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }
  
  async getParagraphsByArticle ({params, response}) {
    const data = (await Paragraph.query().where({ article_id: params.id }).fetch()).toJSON()
    response.send(data)
  }

  async getParagraphsByFilter ({ request, response, params }) {
    const id = new ObjectId(params.id)
    var data = []
    let filter = request.all()
    console.log('filter :>> ', filter);
    if (filter.article) {
      data = (await Paragraph.query().where({ article_id: filter.article, course_id: id }).fetch()).toJSON()
    }
    console.log('data :>> ', data);
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
    if (data !== null && data !== undefined) {
      data = data.sort(function (a, b) {
        return a.order - b.order
      })
    }
    response.send(data)
  }

  async show ({ params, response }) {
    let data = (await Paragraph.find(params.id)).toJSON()
    response.send(data)
  }

  async store ({ request, response, auth }) {
    let data = request.body
    data.course_id = new ObjectId(data.course_id)
    let save = await Paragraph.create(data)
    response.send(save)
  }

  async update ({ params, request, response }) {
    const body = request.all()
    body.course_id = new ObjectId(body.course_id)
    const update = await Paragraph.where('_id', params.id).update(body)
    response.send(update)
  }

  async destroy ({ params, response }) {
    const data = await Paragraph.where('_id', params.id).delete()
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new paragraph.
   * GET paragraphs/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new paragraph.
   * POST paragraphs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  /**
   * Display a single paragraph.
   * GET paragraphs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  /**
   * Render a form to update an existing paragraph.
   * GET paragraphs/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update paragraph details.
   * PUT or PATCH paragraphs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  /**
   * Delete a paragraph with id.
   * DELETE paragraphs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
}

module.exports = ParagraphController
