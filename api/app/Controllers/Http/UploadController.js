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
    let courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    let files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    let explanation = workbook.getWorksheet('Hoja1')
    let colComment = explanation.getColumn('B')
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
        try {
          var existTopic = (await Topic.query().where({ id: topicDB.id }).first()).toJSON()
        } catch (error) {
          if (existTopic === null || existTopic === undefined) {
            let save = await Topic.create(topicDB)
          }
          console.error('error.message :>> ', error.message);
        }
      }
    })
    response.send(true)
  }

  async excelQuestion ({ request, response }) {
    let courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    let files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    let explanation = workbook.getWorksheet('Hoja1')
    let colComment = explanation.getColumn('B')
    colComment.eachCell(async (cell, rowNumber) => {
      if (rowNumber >= 2) {
        let question = {}
        let id = explanation.getCell('A' + rowNumber).value
        let title = explanation.getCell('B' + rowNumber).value
        let topic = explanation.getCell('C' + rowNumber).value
        let exam = explanation.getCell('D' + rowNumber).value
        let order = explanation.getCell('E' + rowNumber).value
        let law_id = explanation.getCell('F' + rowNumber).value
        let article = explanation.getCell('G' + rowNumber).value
        let article_id = explanation.getCell('H' + rowNumber).value
        let paragraph_id = explanation.getCell('I' + rowNumber).value
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
        try {
          var existQuestion = (await Question.query().where({ id: id }).first()).toJSON()
        } catch (error) {
          if (existQuestion === null || existQuestion === undefined) {
            let save = await Question.create(question)
          }
          console.error('error.message :>> ', error.message);
        }
      }
    })
    response.send(true)
  }

  async excelExam ({ request, response }) {
    let courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    let files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    let explanation = workbook.getWorksheet('Hoja1')
    let colComment = explanation.getColumn('D')
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
        try {
          var existExam = (await Exam.query().where({ id: exam.id }).first()).toJSON()
        } catch (error) {
          if (existExam === null || existExam === undefined) {
            let save = await Exam.create(exam)
          }
          console.error('error.message :>> ', error.message);
        }
      }
    })
    response.send(true)
  }

  async excelArticle ({ request, response }) {
    let courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    let files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    let explanation = workbook.getWorksheet('Hoja1')
    let colComment = explanation.getColumn('B')
    var articleNumber = ''
    var order = 0
    colComment.eachCell(async (cell, rowNumber) => {
      if (rowNumber >= 2) {
        var article = {}
        //var paragraph = explanation.getCell('A' + rowNumber).value
        var law = explanation.getCell('B' + rowNumber).value
        var article_name = explanation.getCell('C' + rowNumber).value
        var article_text = explanation.getCell('E' + rowNumber).value
        var paragraph_text = explanation.getCell('F' + rowNumber).value
        article.law = law
        article.article_name = article_name
        article.sub_title = article_text
        article.course_id = courseId
        
        if (article_name !== articleNumber) {
          articleNumber = article_name
          try {
            var existArticle = (await Article.query().where({ article_name: article_name, law: law }).first()).toJSON()
          } catch (error) {
            if (existArticle === null || existArticle === undefined) {
              var newArticle = await Article.create(article)
            }
            console.error('error.message :>> ', error.message);
          }
        }
      }
    })
    let setParagraph = async () => {
      colComment.eachCell(async (cell, rowNumber) => {
        if (rowNumber >= 2) {
          var paragraphDB = {}
          var id = explanation.getCell('A' + rowNumber).value
          var law = explanation.getCell('B' + rowNumber).value
          var article_name = explanation.getCell('C' + rowNumber).value
          var article_text = explanation.getCell('E' + rowNumber).value
          var paragraph_text = explanation.getCell('F' + rowNumber).value
          try {
            
            if (article_name !== articleNumber) {
              articleNumber = article_name
              order = 0
            }
            // Creacion de los registros de la colección de parrafos de los articulos //
            paragraphDB.paragraph_text = paragraph_text
            paragraphDB.order = order
            paragraphDB.id = id
            paragraphDB.course_id = courseId
            
            if (paragraphDB.paragraph_text.length > 0) {
              order++
              var articleCreated = (await Article.query().where({ law: law, article_name: article_name }).first()).toJSON()
              paragraphDB.article_id = articleCreated._id
              try {
                var existParagraph = (await Paragraph.query().where({ paragraph_text: paragraph_text }).first()).toJSON()
              } catch (error) {
                if (existParagraph === null || existParagraph === undefined) {
                  var newParagrahp = await Paragraph.create(paragraphDB)
                }
                console.error('error.message :>> ', error.message);
              }
            }
          } catch (error) {
            console.error('fallo: ' + error.message)
          }
        }
      })
    }
    setTimeout(setParagraph, 8000);
    response.send(true)
  }
  async excelLaw ({ request, response }) {
    let courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    let files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    let explanation = workbook.getWorksheet('Hoja1')
    let colComment = explanation.getColumn('B')
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
        try {
          var existLaw = (await Law.query().where({ id: id }).first()).toJSON()
        } catch (error) {
          if (existLaw === null || existLaw === undefined) {
            let save = await Law.create(law)
          }
          console.error('error.message :>> ', error.message);
        }
      }
    })
    response.send(true)
  }
  async excelAnswer ({ request, response }) {
    let courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    let files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    let explanation = workbook.getWorksheet('Hoja1')
    let colComment = explanation.getColumn('B')
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
        try {
          var existAnswer = (await Answer.query().where({ id: id }).first()).toJSON()
        } catch (error) {
          if (existAnswer === null || existAnswer === undefined) {
            let save = await Answer.create(answer)
          }
          console.error('error.message :>> ', error.message);
        }
      }
    })
    response.send(true)
  }
  async excelSubTopic ({ request, response }) {
    let courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    let files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    let explanation = workbook.getWorksheet('Hoja1')
    let colComment = explanation.getColumn('B')
    colComment.eachCell(async (cell, rowNumber) => {
      if (rowNumber >= 2) {
        let subTopic = {}
        let id = explanation.getCell('A' + rowNumber).value
        let topic_id = explanation.getCell('B' + rowNumber).value
        let process = explanation.getCell('C' + rowNumber).value
        subTopic.id = id 
        subTopic.topic_id = topic_id
        subTopic.process = process
        subTopic.course_id = courseId
        try {
          var existSubTopic = (await SubTopic.query().where({ id: id }).first()).toJSON()
        } catch (error) {
          if (existSubTopic === null || existSubTopic === undefined) {
            let save = await SubTopic.create(subTopic)
          }
          console.error('error.message :>> ', error.message);
        }
      }
    })
    response.send(true)
  }
  async excelType ({ request, response }) {
    let courseId = request.only(['courseId'])
    courseId = new ObjectId(courseId.courseId)
    let files = request.file('fileExcel')
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    let explanation = workbook.getWorksheet('Hoja1')
    let colComment = explanation.getColumn('B')
    colComment.eachCell(async (cell, rowNumber) => {
      if (rowNumber >= 2) {
        let type = {}
        let id = explanation.getCell('A' + rowNumber).value
        let type_name = explanation.getCell('B' + rowNumber).value
        type.id = id 
        type.type_name = type_name
        type.course_id = courseId
        try {
          var existType = (await Type.query().where({ id: id }).first()).toJSON()
        } catch (error) {
          if (existType === null || existType === undefined) {
            let save = await Type.create(type)
          }
          console.error('error.message :>> ', error.message);
        }
      }
    })
    response.send(true)
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
}

module.exports = UploadController
