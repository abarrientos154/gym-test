'use strict'
const Law = use("App/Models/Law")
const Article = use("App/Models/Article")
const Paragraph = use("App/Models/Paragraph")
var ObjectId = require('mongodb').ObjectId;

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with laws
 */
class LawController {
  /**
   * Show a list of all laws.
   * GET laws
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    let data = (await Law.query().where({}).fetch()).toJSON()
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
    let data = (await Law.query().where({ course_id: id }).fetch()).toJSON()
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
    let data = (await Law.find(params.id)).toJSON()
    response.send(data)
  }

  async store ({ request, response, auth }) {
    let data = request.body
    data.course_id = new ObjectId(data.course_id)
    let save = await Law.create(data)
    response.send(save)
  }

  async update ({ params, request, response }) {
    const body = request.all()
    body.course_id = new ObjectId(body.course_id)
    const update = await Law.where('_id', params.id).update(body)
    response.send(update)
  }

  async destroy ({ params, response }) {
    console.log('params.id :>> ', params.id);
    const id = (await Law.query().find(params.id)).id
    console.log('id :>> ', id);
    const data = await Law.where('_id', params.id).delete()
    const articles = (await Article.query().where('law', id).fetch()).toJSON()
    for (const i in articles) {
      const paragraphs = (await Paragraph.query().where('article_id', articles[i]._id).fetch()).toJSON()
      const artToDestroy = await Article.where({ _id: articles[i]._id }).delete()
      for (const i in paragraphs) {
        const parToDestroy = await Paragraph.where({ _id: paragraphs[i]._id }).delete()
      }
    }
    response.send(data)
  }
  async destroyAll ({ response }) {
    const data = await Law.where({}).delete()
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new law.
   * GET laws/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new law.
   * POST laws
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  /**
   * Display a single law.
   * GET laws/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  /**
   * Render a form to update an existing law.
   * GET laws/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update law details.
   * PUT or PATCH laws/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  /**
   * Delete a law with id.
   * DELETE laws/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
}

module.exports = LawController
