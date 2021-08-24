'use strict'
const ExcelJS = require('exceljs');
const MoveFileService = use("App/Services/MoveFileService")
const Topic = use("App/Models/Topic")
const Question = use("App/Models/Question")
const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
var ObjectId = require('mongodb').ObjectId;

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tests
 */
class TopicController {
  /**
   * Show a list of all tests.
   * GET tests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    let data = await Topic.all()
    response.send(data)
  }

  async getTopicById ({ request, response, params }) {
    let tema = (await Topic.query().where({_id: params.id}).with('subTemas').first()).toJSON()
    let questions = (await Question.query().where({topic: tema.tema}).with('answers').fetch()).toJSON()
    for (let i = 0; i < questions.length; i++) {
      questions[i].answers = questions[i].answers.map(v => {
        questions[i].selected = false
        return {
          ...v,
          isActive: false
        }
      })
    }
    tema.questions = questions
    response.send(tema)
  }

  /**
   * Render a form to be used for creating a new test.
   * GET tests/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new test.
   * POST tests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    /* try {
      var data = request.only(['dat'])
      data = JSON.parse(data.dat)
      data.family_id = new ObjectId(data.family_id)
      var id = (await Nivele.query().where({}).fetch()).toJSON()
      if (id.length < 1) {
        data.id = 1
      } else {
        let lastT = id.length - 1
        id = parseInt(id[lastT].id) + 1
        data.id = id
      }
      let save = await Topic.create(data)

      const profilePic = request.file('files', {
        types: ['image']
      })
      if (Helpers.appRoot('storage/uploads/niveles')) {
        await profilePic.move(Helpers.appRoot('storage/uploads/niveles'), {
          name: save._id.toString(),
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }

      response.send(save)
    } catch (error) {
      console.error('metodo store:' + error.name + ':' + error.message);
    } */
  }

  async excelTopic ({request, response}) {
    let files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    let explanation = workbook.getWorksheet('Hoja1')
    let colComment = explanation.getColumn('B')
    colComment.eachCell(async (cell, rowNumber) => {
      if (rowNumber >= 2) {
        let topic = {}
        let id = explanation.getCell('A' + rowNumber).value
        let tema = explanation.getCell('B' + rowNumber).value
        let long_name = explanation.getCell('C' + rowNumber).value
        let name = explanation.getCell('D' + rowNumber).value
        if (id.result) { topic.id = id.result } else { topic.id = id }
        topic.tema = tema
        topic.long_name = long_name
        topic.name = name
        let save = await Topic.create(topic)
      }
    })
    response.send(true)
  }

  /**
   * Display a single test.
   * GET tests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing test.
   * GET tests/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update test details.
   * PUT or PATCH tests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    /* var data = request.only(['dat'])
    data = JSON.parse(data.dat)
    data.family_id = new ObjectId(data.family_id)
    if (data.file) {
      const profilePic = request.file('files', {
        types: ['image']
      })
      if (Helpers.appRoot('storage/uploads/niveles')) {
        await profilePic.move(Helpers.appRoot('storage/uploads/niveles'), {
          name: data._id.toString(),
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }
    }
    delete data.file
    let update = await Topic.query().where('_id', params.id).update(data)
    response.send(update) */
  }

  /**
   * Delete a test with id.
   * DELETE tests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    /* let test = await Topic.find(params.id)
    await test.delete()
    response.send(test) */
  }

  async testByCourse ({ request, response, params }) {
    /* let data = (await Nivele.query().where({ family_id: params.id }).fetch()).toJSON()
    response.send(data) */
  }

  async testById ({ request, response, params }) {
    try {
      let test = (await Nivele.with('course').with('questions').find(params.id)).toJSON()
      response.send(test)
    } catch (error) {
      console.error(error.name + '1: ' + error.message)
    }
  }

  async testByCourseId ({ request, response, params }) {
    try {
      const id = new ObjectId(params.id)
      const test = (await Nivele.query().where({ family_id: id }).fetch()).toJSON()
      response.send(test)
    } catch (error) {
      console.error(error.name + '1: ' + error.message)
    }
  }

  async testExamById ({ request, response, params }) {
    try {
      let test = (await Nivele.with('exam').with('questions').find(params.id)).toJSON()
      if (test.hasExamId) {
        const questionsFromExam = (await Question.query().where({ exam_id: test.id }).fetch()).toJSON()
        const questions = [...test.questions]
        test.questions = [...questions, ...questionsFromExam]
      }
      response.send(test)
    } catch (error) {
      console.error(error.name + '1: ' + error.message)
    }
  }
}

module.exports = TopicController
