'use strict'
const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
const ObjectId = require('mongodb').ObjectId
const News = use('App/Models/News')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with news
 */
class NewsController {
  /**
   * Show a list of all news.
   * GET news
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    let data = (await News.query().where({}).fetch()).toJSON()
    response.send(data)
  }

  async indexByCourse ({ response, params }) {
    const id = new ObjectId(params.id)
    let data = (await News.query().where({ course_id: id }).fetch()).toJSON()
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new news.
   * GET news/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new news.
   * POST news
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    let body = request.only(['data'])
    body = JSON.parse(body.data)
    const image = request.file('image', {
      types: ['image'],
      size: '20mb'
    })
    body.course_id = new ObjectId(body.course_id)
    let news = await News.create(body)
    const id = ObjectId(news._id).toString()
    if (Helpers.appRoot('storage/uploads/news')) {
      await image.move(Helpers.appRoot('storage/uploads/news'), {
        name: id,
        overwrite: true
      })
    } else {
      mkdirp.sync(`${__dirname}/storage/Excel`)
    }
    let updateNews = await News.query().where({ _id: id }).update({ image: image.fileName })
    response.send(news)
  }

  /**
   * Display a single news.
   * GET news/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    let data = (await News.find(params.id)).toJSON()
    response.send(data)
  }

  /**
   * Render a form to update an existing news.
   * GET news/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update news details.
   * PUT or PATCH news/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    let body = request.only(['data'])
    body = JSON.parse(body.data)
    const image = request.file('image', {
      types: ['image'],
      size: '20mb'
    })
    if (image !== null) {
      if (Helpers.appRoot('storage/uploads/news')) {
        await image.move(Helpers.appRoot('storage/uploads/news'), {
          name: params.id,
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }
      const fileName = image.fileName
      body.image = fileName
    }
    body.course_id = new ObjectId(body.course_id)
    const id = new ObjectId(params.id)
    let news = await News.query().where({ _id: id }).update(body)
    response.send(news)
  }

  /**
   * Delete a news with id.
   * DELETE news/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const data = await News.where('_id', params.id).delete()
    response.send(data)
  }
}

module.exports = NewsController
