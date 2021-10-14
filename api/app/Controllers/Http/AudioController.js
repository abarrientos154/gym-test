'use strict'
const Audio = use('App/Models/Audio')
const ObjectId = require('mongodb').ObjectId
const Helpers = use('Helpers')
const mkdirp = use('mkdirp')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with audio
 */
class AudioController {
  /**
   * Show a list of all audio.
   * GET audio
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
    let data = (await Audio.query().where({ course_id: id }).fetch()).toJSON()
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
          },
          {
            color: "green",
            icon: "headphones",
            url: "",
            action: "",
            title: "Reproducir",
          }
        ]
      }
    }
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new audio.
   * GET audio/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new audio.
   * POST audio
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    let body = request.only(['data'])
    body = JSON.parse(body.data)
    const file = request.file('audio', {
      types: ['audio'],
      size: '200mb'
    })
    body.course_id = new ObjectId(body.course_id)
    let audio = await Audio.create(body)
    const id = ObjectId(audio._id).toString()
    if (Helpers.appRoot('storage/uploads/audios')) {
      await file.move(Helpers.appRoot('storage/uploads/audios'), {
        name: id,
        overwrite: true
      })
    } else {
      mkdirp.sync(`${__dirname}/storage/Excel`)
    }
    let updateAudio = await Audio.query().where({ _id: id }).update({ file: file.fileName })
    response.send(audio)
  }

  /**
   * Display a single audio.
   * GET audio/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    let data = (await Audio.find(params.id)).toJSON()
    response.send(data)
  }

  /**
   * Render a form to update an existing audio.
   * GET audio/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update audio details.
   * PUT or PATCH audio/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    let body = request.only(['data'])
    body = JSON.parse(body.data)
    const file = request.file('audio', {
      types: ['audio'],
      size: '200mb'
    })
    if (file !== null) {
      if (Helpers.appRoot('storage/uploads/audios')) {
        await file.move(Helpers.appRoot('storage/uploads/audios'), {
          name: params.id,
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }
      const fileName = file.fileName
      body.file = fileName
    }
    body.course_id = new ObjectId(body.course_id)
    const id = new ObjectId(params.id)
    let audio = await Audio.query().where({ _id: id }).update(body)
    response.send(audio)
  }

  /**
   * Delete a audio with id.
   * DELETE audio/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const data = await Audio.where('_id', params.id).delete()
    response.send(data)
  }
}

module.exports = AudioController
