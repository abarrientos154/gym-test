'use strict'
const ExcelJS = require('exceljs');
const Question = use("App/Models/Question")
const Exam = use("App/Models/Examen")
const Article = use("App/Models/Article")
const Paragraph = use("App/Models/Paragraph")
const Law = use("App/Models/Law")
const SubTopic = use("App/Models/SubTopic")
const Topic = use("App/Models/Topic")
const Type = use("App/Models/Type")
const Answer = use("App/Models/Answer")
const MoveFileService = use("App/Services/MoveFileService")
const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
var ObjectId = require('mongodb').ObjectId;


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with uploads
 */
class UploadController {
  /**
   * Show a list of all uploads.
   * GET uploads
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new upload.
   * GET uploads/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new upload.
   * POST uploads
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single upload.
   * GET uploads/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing upload.
   * GET uploads/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update upload details.
   * PUT or PATCH uploads/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a upload with id.
   * DELETE uploads/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async excelTopic ({ request, response }) {
    var courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    var files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    var explanation = workbook.getWorksheet('Hoja1')
    var colComment = explanation.getColumn('B')
    var end = 0
    return new Promise((resolve, reject) => {
      colComment.eachCell(async (cell, rowNumber) => {
        if (rowNumber >= 2) {
          let topicDB = {}
          let id = explanation.getCell('A' + rowNumber).value
          let topic = explanation.getCell('B' + rowNumber).value
          let long_name = explanation.getCell('C' + rowNumber).value
          let name = explanation.getCell('D' + rowNumber).value
          if (id.result) { topicDB.id = id.result } else { topicDB.id = id }
          topicDB.topic = topic
          topicDB.long_name = long_name
          topicDB.name = name
          topicDB.course_id = courseId
          if (rowNumber >= end) {
            end = rowNumber
          }
          var existTopic = (await Topic.query().where({ id: topicDB.id, course_id: courseId }).first())
          if (existTopic === null || existTopic === undefined) {
            let save = await Topic.create(topicDB)
            if (rowNumber === end) {
              resolve(response.send(true))
            }
          } else {
            if (rowNumber === end) {
              resolve(response.send(true))
            }
          }
        }
      })
    })
  }
  
  async excelQuestion ({ request, response }) {
    var courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    var files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    var explanation = workbook.getWorksheet('Hoja1')
    var colComment = explanation.getColumn('B')
    var end = 0
    var questions = []
    return new Promise((resolve, reject) => {
      colComment.eachCell(async (cell, rowNumber) => {
        if (rowNumber >= 2) {
          let question = {}
          let id = explanation.getCell('A' + rowNumber).value
          let title = explanation.getCell('B' + rowNumber).value
          let topic = Number(explanation.getCell('C' + rowNumber).value)
          let exam = Number(explanation.getCell('D' + rowNumber).value)
          let order = Number(explanation.getCell('E' + rowNumber).value)
          let law_id = Number(explanation.getCell('F' + rowNumber).value)
          let article = explanation.getCell('G' + rowNumber).value
          let article_id = Number(explanation.getCell('H' + rowNumber).value)
          let paragraph_id = Number(explanation.getCell('I' + rowNumber).value)
          let type = explanation.getCell('J' + rowNumber).value
          let process = explanation.getCell('K' + rowNumber).value
          question.id = parseInt(id)
          question.title = title
          question.topic = topic
          question.exam = exam
          question.order = order
          question.law_id = law_id
          question.article = article
          question.article_id = article_id
          question.paragraph_id = paragraph_id
          question.type = type
          question.course_id = courseId
          question.process = process
          if (rowNumber >= end) {
            end = rowNumber
          }
          var existQuestion = (await Question.query().where({ id: id, course_id: courseId }).first())
          if (existQuestion === null || existQuestion === undefined) {
            questions.push(question)
          }
          if (rowNumber === end) {
            let s = Question.createMany(questions).then(v => {
              resolve(response.send(true))
            })
          }
        }
      })
    })
  }

  async excelExam ({ request, response }) {
    var courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    var files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    var explanation = workbook.getWorksheet('Hoja1')
    var colComment = explanation.getColumn('D')
    var end = 0
    return new Promise((resolve, reject) => {
      colComment.eachCell(async (cell, rowNumber) => {
        if (rowNumber >= 2) {
          let exam = {}
          let id = explanation.getCell('A' + rowNumber).value
          let date = explanation.getCell('B' + rowNumber).value
          let convocatoria = explanation.getCell('C' + rowNumber).value
          let name = explanation.getCell('D' + rowNumber).value
          if (id.result) {
            exam.id = id.result
          } else {
            exam.id = id
          }
          exam.date = date
          exam.convocatoria = convocatoria
          exam.name = name
          exam.course_id = courseId
          if (rowNumber >= end) {
            end = rowNumber
          }
          var existExam = (await Exam.query().where({ id: exam.id, course_id: courseId }).first())
          if (existExam === null || existExam === undefined) {
            let save = await Exam.create(exam)
            if (rowNumber === end) {
              resolve(response.send(true))
            }
          } else {
            if (rowNumber === end) {
              resolve(response.send(true))
            }
          }
        }
      })
    })
  }
  
  async excelArticle ({ request, response }) {
    var courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    var files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    var explanation = workbook.getWorksheet('Hoja1')
    var colComment = explanation.getColumn('B')
    var end = 0
    var articles = []
    return new Promise((resolve, reject) => {
      colComment.eachCell(async (cell, rowNumber) => {
      if (rowNumber >= 2) {
        var article = {}
          var id = explanation.getCell('A' + rowNumber).value
          var article_name = explanation.getCell('B' + rowNumber).value
          var law = explanation.getCell('C' + rowNumber).value
          var article_text = explanation.getCell('D' + rowNumber).value
          article.id = id
          article.law = law
          article.article_name = article_name
          article.sub_title = article_text !== null ? article_text : ''
          article.course_id = courseId
          if (rowNumber >= end) {
            end = rowNumber
          }
          var existArticle = (await Article.query().where({ article_name: article_name, law: law, course_id: courseId }).first())
          if (existArticle === null || existArticle === undefined) {
            parrafos.push(article)
          }
          if (rowNumber === end) {
            let s = Article.createMany(articles).then(v => {
              resolve(response.send(true))
            })
          }
        }
      })
    })
  }
  async excelParagraph ({ request, response }) {
    var courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    var files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    var explanation = workbook.getWorksheet('Hoja1')
    var colComment = explanation.getColumn('B')
    var end = 0
    var parrafos = []
    return new Promise((resolve, reject) => {
      colComment.eachCell(async (cell, rowNumber) => {
        if (rowNumber >= 2) {
          var paragraphDB = {}
          var id = explanation.getCell('A' + rowNumber).value
          var article_id = explanation.getCell('B' + rowNumber).value
          var paragraph_text = explanation.getCell('C' + rowNumber).value
          var order = explanation.getCell('D' + rowNumber).value
          // Creacion de los registros de la colección de parrafos de los articulos //
          paragraphDB.id = id
          paragraphDB.article_id = article_id
          paragraphDB.paragraph_text = paragraph_text !== null ? paragraph_text : ''
          paragraphDB.order = order
          paragraphDB.course_id = courseId
          if (rowNumber >= end) {
            end = rowNumber
          }
          var existParagraph = (await Paragraph.query().where({ id: id, course_id: courseId }).first())
          if (existParagraph === null || existParagraph === undefined) {
            parrafos.push(paragraphDB)
          }
          if (rowNumber === end) {
            let s = Paragraph.createMany(parrafos).then(v => {
              resolve(response.send(true))
            })
          }
        }
      })
    })
  }
  async excelLaw ({ request, response }) {
    var courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    var files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    var explanation = workbook.getWorksheet('Hoja1')
    var colComment = explanation.getColumn('B')
    var end = 0
    var laws = []
    return new Promise((resolve, reject) => {
      colComment.eachCell(async (cell, rowNumber) => {
        if (rowNumber >= 2) {
          let law = {}
          let id = explanation.getCell('A' + rowNumber).value
          let law_name = explanation.getCell('B' + rowNumber).value
          let acronym_law = explanation.getCell('C' + rowNumber).value
          let last_update = explanation.getCell('D' + rowNumber).value
          let revision = explanation.getCell('E' + rowNumber).value
          let mark = explanation.getCell('F' + rowNumber).value
          let note = explanation.getCell('G' + rowNumber).value
          law.id = id
          law.law_name = law_name
          law.acronym_law = acronym_law
          law.last_update = last_update
          law.revision = revision
          law.mark = mark
          law.note = note
          law.course_id = courseId
          if (rowNumber >= end) {
            end = rowNumber
          }
          var existLaw = (await Law.query().where({ id: id, course_id: courseId }).first())
          if (existLaw === null || existLaw === undefined) {
            laws.push(law)
          }
          if (rowNumber === end) {
            let s = Law.createMany(laws).then(v => {
              resolve(response.send(true))
            })
          }
        }
      })
    })
  }
  async excelAnswer ({ request, response }) {
    var courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    var files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    var explanation = workbook.getWorksheet('Hoja1')
    var colComment = explanation.getColumn('B')
    var end = 0
    var answers = []
    return new Promise((resolve, reject) => {
      colComment.eachCell(async (cell, rowNumber) => {
        if (rowNumber >= 2) {
          let answer = {}
          let id = explanation.getCell('A' + rowNumber).value
          let id_question = explanation.getCell('B' + rowNumber).value
          let answer_name = explanation.getCell('C' + rowNumber).value
          let isCorrect = explanation.getCell('D' + rowNumber).value
          let order = explanation.getCell('E' + rowNumber).value
          answer.id_question = parseInt(id_question)
          answer.id = id 
          answer.answer_name = answer_name
          answer.isCorrect = isCorrect === 'N' ? false : true 
          answer.order = order
          answer.course_id = courseId
          if (rowNumber >= end) {
            end = rowNumber
          }
          var existAnswer = (await Answer.query().where({ id: id, course_id: courseId }).first())
          if (existAnswer === null || existAnswer === undefined) {
            answers.push(answer)
          }
          if (rowNumber === end) {
            let s = Answer.createMany(answers).then(v => {
              resolve(response.send(true))
            })
          }
        }
      })
      // resolve(response.send(true))
    })
  }
  async excelSubTopic ({ request, response }) {
    var courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    var files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    var explanation = workbook.getWorksheet('Hoja1')
    var colComment = explanation.getColumn('B')
    var end = 0
    return new Promise((resolve, reject) => {
      colComment.eachCell(async (cell, rowNumber) => {
        if (rowNumber >= 2) {
          let subTopic = {}
          let id = explanation.getCell('A' + rowNumber).value
          let topic_id = explanation.getCell('B' + rowNumber).value
          let process = explanation.getCell('C' + rowNumber).value
          subTopic.id = id.result ? id.result : id 
          subTopic.topic_id = topic_id
          subTopic.process = process
          subTopic.course_id = courseId
          if (rowNumber >= end) {
            end = rowNumber
          }
          var existSubTopic = (await SubTopic.query().where({ id: id, course_id: courseId }).first())
          if (existSubTopic === null || existSubTopic === undefined) {
            let save = await SubTopic.create(subTopic)
            if (rowNumber === end) {
              resolve(response.send(true))
            }
          } else {
            if (rowNumber === end) {
              resolve(response.send(true))
            }
          }
        }
      })
    })
  }
  async excelType ({ request, response }) {
    var courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    var files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    var explanation = workbook.getWorksheet('Hoja1')
    var colComment = explanation.getColumn('B')
    var end = 0
    return new Promise((resolve, reject) => {
      colComment.eachCell(async (cell, rowNumber) => {
        if (rowNumber >= 2) {
          let type = {}
          let id = explanation.getCell('A' + rowNumber).value
          let type_name = explanation.getCell('B' + rowNumber).value
          type.id = id 
          type.type_name = type_name
          type.course_id = courseId
          if (rowNumber >= end) {
            end = rowNumber
          }
          var existType = (await Type.query().where({ id: id, course_id: courseId }).first())
          if (existType === null || existType === undefined) {
            let save = await Type.create(type)
            if (rowNumber === end) {
              resolve(response.send(true))
            }
          } else {
            if (rowNumber === end) {
              resolve(response.send(true))
            }
          }
        }
      })

    })
  }

  async getFileByDirectoryPerfil ({ params, response }) {
    const dir = params.file
    response.download(Helpers.appRoot('storage/uploads/perfil') + `/${dir}`)
  }

  async getFileByDirectoryNiveles ({ params, response }) {
    const dir = params.file
    response.download(Helpers.appRoot('storage/uploads/niveles') + `/${dir}`)
  }

  async getFileByDirectoryPreguntas ({ params, response }) {
    const dir = params.file
    response.download(Helpers.appRoot('storage/uploads/preguntas') + `/${dir}`)
  }
  async getFileByDirectoryNews ({ params, request, response }) {
    const dir = params.file
    response.download(Helpers.appRoot('storage/uploads/news') + `/${dir}`)
  }
  async getFileByDirectoryTopics ({ params, request, response }) {
    const dir = params.file
    response.download(Helpers.appRoot('storage/uploads/topics') + `/${dir}`)
  }
  async getFileByDirectoryExams ({ params, request, response }) {
    const dir = params.file
    response.download(Helpers.appRoot('storage/uploads/exams') + `/${dir}`)
  }
  async getFileByDirectoryTypes ({ params, request, response }) {
    const dir = params.file
    response.download(Helpers.appRoot('storage/uploads/types') + `/${dir}`)
  }
  async getFileByDirectoryAudios ({ params, request, response }) {
    const dir = params.file
    response.download(Helpers.appRoot('storage/uploads/audios') + `/${dir}`)
  }
}

module.exports = UploadController
