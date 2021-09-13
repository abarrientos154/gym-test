'use strict'
const SubTopic = use("App/Models/SubTopic")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with subtopics
 */
class SubTopicController {
  /**
   * Show a list of all subtopics.
   * GET subtopics
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    let data = (await SubTopic.query().where({}).fetch()).toJSON()
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

  async show ({ params, response }) {
    let data = (await SubTopic.find(params.id)).toJSON()
    response.send(data)
  }

  async store ({ request, response, auth }) {
    let data = request.body
    data.course_id = new ObjectId(data.course_id)
    let save = await SubTopic.create(data)
    response.send(save)
  }

  async update ({ params, request, response }) {
    const body = request.all()
    const update = await SubTopic.where('_id', params.id).update(body)
    response.send(update)
  }

  async destroy ({ params, response }) {
    const data = await SubTopic.where('_id', params.id).delete()
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new subtopic.
   * GET subtopics/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new subtopic.
   * POST subtopics
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  /**
   * Display a single subtopic.
   * GET subtopics/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  /**
   * Render a form to update an existing subtopic.
   * GET subtopics/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update subtopic details.
   * PUT or PATCH subtopics/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  /**
   * Delete a subtopic with id.
   * DELETE subtopics/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
}

module.exports = SubTopicController
