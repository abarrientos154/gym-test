'use strict'
const Article = use("App/Models/Article")
const Paragraph = use("App/Models/Paragraph")
var ObjectId = require('mongodb').ObjectId;

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with articles
 */
class ArticleController {
  /**
   * Show a list of all articles.
   * GET articles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    let data = (await Article.query().where({}).fetch()).toJSON()
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

  async getArticlesByFilter ({ request, response, params }) {
    const id = new ObjectId(params.id)
    var data = []
    let filter = request.all()
    if (filter.law) {
      data = (await Article.query().where({ law: filter.law, course_id: id }).fetch()).toJSON()
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
      }
    }
    if (data !== null && data !== undefined) {
      data = data.sort(function (a, b) {
        return a.id - b.id
      })
    }
    response.send(data)
  }

  async show ({ params, response }) {
    let data = (await Article.find(params.id)).toJSON()
    response.send(data)
  }

  async store ({ request, response, auth }) {
    let data = request.body
    data.course_id = new ObjectId(data.course_id)
    let save = await Article.create(data)
    response.send(save)
  }

  async update ({ params, request, response }) {
    const body = request.all()
    body.course_id = new ObjectId(body.course_id)
    const update = await Article.where('_id', params.id).update(body)
    response.send(update)
  }

  async destroy ({ params, response }) {
    const data = await Article.where('_id', params.id).delete()
    response.send(data)
  }

  async destroyAll ({ response }) {
    const data = await Article.where({}).delete()
    response.send(data)
  }

  async getArticlesByLaw ({ params, response }) {
    const id = parseInt(params.id)
    let data = (await Article.query().where({ law: id }).fetch()).toJSON()
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new article.
   * GET articles/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new article.
   * POST articles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  
  /**
   * Display a single article.
   * GET articles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  
  /**
   * Render a form to update an existing article.
   * GET articles/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update article details.
   * PUT or PATCH articles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  
  /**
   * Delete a article with id.
   * DELETE articles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
}

module.exports = ArticleController
