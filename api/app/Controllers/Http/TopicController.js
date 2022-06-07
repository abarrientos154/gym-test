'use strict'
const Topic = use("App/Models/Topic")
const TopicTest = use("App/Models/TopicTest")
const ByTopicTest = use("App/Models/ByTopicTest")
const Question = use("App/Models/Question")
const Examen = use("App/Models/Examen")
const Articulos = use("App/Models/Article")
const Parrafos = use("App/Models/Paragraph")
const moment = require('moment')
var ObjectId = require('mongodb').ObjectId;
const Helpers = use('Helpers')
const mkdirp = use('mkdirp')

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
  async index ({ response }) {
    let data = (await Topic.query().where({}).fetch()).toJSON()
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
    let data = (await Topic.query().where({ course_id: id }).fetch()).toJSON()
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
          /* {
            color: "green",
            icon: "upload",
            url: "",
            action: "",
            title: "Cargar Imagen",
          } */
        ]
      }
    }
    data = data.sort(function(a, b) {
      return a.id - b.id
    })
    response.send(data)
  }

  async getTestByTopic ({ request, response, params }) {
    try {
      const course = new ObjectId(params.course)
      let test = (await ByTopicTest.query().where({_id: params.id}).first()).toJSON()
      let questions = []
      let cantQuest = Math.floor(test.cant_questions / test.temas.length)
      // traemos las preguntas que tendra el test general
      for (let i = 0; i < test.temas.length; i++) {
        let element = test.temas[i]
        let questByTopic = (await Question.query().where({ topic: element, course_id: course }).with('answers').with('leyInfo').fetch()).toJSON()
        questByTopic = questByTopic.sort(() => Math.random() - 0.5)
        let quests = []
        if (i === (test.temas.length - 1)) {
          let rest = test.cant_questions - questions.length
          quests = questByTopic.slice(0, rest)
        } else {
          quests= questByTopic.slice(0, cantQuest)
        }
        questions = questions.concat(quests)
      }
      questions = questions.sort(() => Math.random() - 0.5)

      // Ordenamos las preguntas
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].answers[0].order === null || questions[i].answers[0].order === '') {
          questions[i].answers = questions[i].answers.sort(() => Math.random() - 0.5)
        } else {
          var arrayAnswers = []
          arrayAnswers[0] = questions[i].answers.find(v => v.order.toLowerCase() === 'a')
          arrayAnswers[1] = questions[i].answers.find(v => v.order.toLowerCase() === 'b')
          arrayAnswers[2] = questions[i].answers.find(v => v.order.toLowerCase() === 'c')
          arrayAnswers[3] = questions[i].answers.find(v => v.order.toLowerCase() === 'd')
          questions[i].answers = arrayAnswers
        }
        questions[i].articuloInfo = (await Articulos.query().where({article_name: questions[i].article, law: questions[i].law_id}).first())
        if (questions[i].articuloInfo) {
          questions[i].parrafoInfo = (await Parrafos.query().where({article_id: Number(questions[i].articuloInfo.id)}).fetch()).toJSON()
        } else {
          questions[i].parrafoInfo = []
        }
        if (questions[i].parrafoInfo.length) {
          questions[i].parrafoInfo.sort(function(a, b) {
            return a.order - b.order;
          })
        }
        questions[i].answers = questions[i].answers.map(v => {
          questions[i].selected = false
          return {
            ...v,
            isActive: false
          }
        })
      }

      test.questions = questions
      response.send(test)
    } catch (error) {
      console.error('get by topic test:' + error.name + ':' + error.message);
    }
  }

  async getTopicById ({ request, response, params }) {
    const course = new ObjectId(params.course)
    let tema = (await Topic.query().where({_id: params.id}).with('subTemas').first()).toJSON()
    let arr = []
    for (const i in tema.subTemas) {
      let num = tema.subTemas[i].process.split(' ')
      arr.push(num)
    }
    arr = arr.sort()
    for (const j in arr) {
      arr[j] = arr[j].join(' ')
      tema.subTemas[j].process = arr[j]
    }
    let questions = (await Question.query().where({topic: tema.topic, course_id: course}).with('answers').fetch()).toJSON()
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

  async getTopicWithAudio ({ response, params }) {
    const id = new ObjectId(params.id)
    let topics = (await Topic.query().where({ course_id: id }).with('audios').fetch()).toJSON()
    let send = []
    for (const i in topics) {
      if (topics[i].audios.length > 0) {
        send.push(topics[i])
      }
    }
    response.send(send)
  }

  async getTestById ({ request, response, params }) {
    try {
      const course = new ObjectId(params.course)
      let tema = (await TopicTest.query().where({_id: params.id}).first()).toJSON()
      let allQuestions = (await Question.query().where({ topic: tema.tema_id, course_id: course }).with('answers').with('leyInfo').fetch()).toJSON()
      let questions = []
      if (tema.subTemas.length) {
        questions = allQuestions.filter(v => {
          if (tema.subTemas.find(x => x.process === v.process)) {
            return v
          } else {
            return false
          }
        })
      } else {
        questions = allQuestions
      }
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].exam !== '' && questions[i].exam !== null) {
          const id = Number(questions[i].exam)
          const exam = await Examen.query().where({ id: id }).first()
          if (exam !== null) {
            questions[i].examData = exam
          }
        }
        if (questions[i].answers[0].order === null || questions[i].answers[0].order === '') {
          questions[i].answers = questions[i].answers.sort(() => Math.random() - 0.5)
        } else {
          var arrayAnswers = []
          arrayAnswers[0] = questions[i].answers.find(v => v.order.toLowerCase() === 'a')
          arrayAnswers[1] = questions[i].answers.find(v => v.order.toLowerCase() === 'b')
          arrayAnswers[2] = questions[i].answers.find(v => v.order.toLowerCase() === 'c')
          arrayAnswers[3] = questions[i].answers.find(v => v.order.toLowerCase() === 'd')
          questions[i].answers = arrayAnswers
        }

        questions[i].articuloInfo = (await Articulos.query().where({article_name: questions[i].article, law: questions[i].law_id}).first())
        if (questions[i].articuloInfo) {
          questions[i].parrafoInfo = (await Parrafos.query().where({article_id: Number(questions[i].articuloInfo.id)}).fetch()).toJSON()
        } else {
          questions[i].parrafoInfo = []
        }
        if (questions[i].parrafoInfo.length) {
          questions[i].parrafoInfo.sort(function(a, b) {
            return a.order - b.order;
          })
        }
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
    } catch (error) {
      console.error('metodo store:' + error.name + ':' + error.message);
    }
  }

  async getTestResult ({ request, response, params, auth }) {
    const user = (await auth.getUser()).toJSON()
    let tests = (await TopicTest.query().where({tema_id: Number(params.id), user_id: user._id}).fetch()).toJSON()
    let totalQuest = 0
    let correctas = 0
    for (let i = 0; i < tests.length; i++) {
      totalQuest = totalQuest + tests[i].total_quest
      correctas = correctas + tests[i].correctas
    }
    let data = {
      total_quest: totalQuest,
      correctas: correctas,
      fecha: tests.length ? moment(tests[tests.length - 1].created_at).format('DD/MM/YYYY') : null
    }
    response.send(data)
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

  async testByTopicCreate ({ request, response, auth, params }) {
    try {
      const id = new ObjectId(params.id)
      const user = (await auth.getUser()).toJSON()
      var data = request.all()
      data.course_id = id
      data.user_id = user._id
      data.temas = data.temas.map(v => v.topic)
      let save = await ByTopicTest.create(data)

      response.send(save)
    } catch (error) {
      console.error('metodo store:' + error.name + ':' + error.message);
    }
  }

  async testCreate ({ request, response, view }) {
    try {
      var data = request.all()
      data.total_quest = 0
      data.correctas = 0
      let save = await TopicTest.create(data)

      response.send(save)
    } catch (error) {
      console.error('metodo store:' + error.name + ':' + error.message);
    }
  }

  async testUpdate ({ params, request, response }) {
    try {
      var respuesta = request.all()
      let tema = await TopicTest.find(params.id)
      tema.total_quest = tema.total_quest + 1
      if (respuesta.selected) {
        tema.correctas = tema.correctas + 1
      }
      tema.save()

      response.send(tema)
    } catch (error) {
      console.error('metodo store:' + error.name + ':' + error.message);
    }
  }

  async testByTemaUpdate ({ params, request, response }) {
    try {
      var correctas = request.all()
      let testBy = await ByTopicTest.query().where({_id: params.id}).update(correctas)

      response.send(testBy)
    } catch (error) {
      console.error('metodo testByTemaUpdate:' + error.name + ':' + error.message);
    }
  }

  async misTests ({ params, response, auth }) {
    let courseId = params.courseId
    const user = (await auth.getUser()).toJSON()
    let allData = (await TopicTest.query().where({user_id: user._id}).with('testInfo').fetch()).toJSON()
    let data = []
    if (allData.length) {
      allData = allData.filter(v => v.testInfo.course_id === courseId)
      data = allData.reverse()
      data = data.map(v => {
        return {
          ...v,
          fecha: moment(v.created_at).format('DD/MM/YYYY')
        }
      })
    }
    response.send(data)
  }

  async misTestByTopic ({ params, response, auth }) {
    let courseId = new ObjectId(params.courseId)
    const user = (await auth.getUser()).toJSON()
    let allData = (await ByTopicTest.query().where({user_id: user._id, course_id: courseId}).fetch()).toJSON()
    let data = []
    if (allData.length) {
      for (let i in allData) {
        let temasInfo = []
        for (let t in allData[i].temas) {
          let tema = (await Topic.findBy('id', allData[i].temas[t])).name
          temasInfo.push(tema)
        }
        allData[i].temasInfo = temasInfo
      }
      data = allData.reverse()
      data = data.map(v => {
        return {
          ...v,
          fecha: moment(v.created_at).format('DD/MM/YYYY')
        }
      })
    }
    response.send(data)
  }

  /**
   * Create/save a new test.
   * POST tests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  
  /**
   * Display a single test.
   * GET tests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  
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
  
  /**
   * Delete a test with id.
   * DELETE tests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  
  async show ({ params, response }) {
    let data = (await Topic.find(params.id)).toJSON()
    response.send(data)
  }

  async getTopicByNum ({ params, response }) {
    let data = (await Topic.where({topic: Number(params.id)}).first()).toJSON()
    response.send(data)
  }
  
  async store ({ request, response, auth }) {
    let body = request.only(['data'])
    body = JSON.parse(body.data)
    const image = request.file('image', {
      types: ['image'],
      size: '20mb'
    })
    body.id = (await Topic.query().where({}).count()) +1
    body.course_id = new ObjectId(body.course_id)
    let topic = await Topic.create(body)
    const id = ObjectId(topic._id).toString()
    if (Helpers.appRoot('storage/uploads/topics')) {
      await image.move(Helpers.appRoot('storage/uploads/topics'), {
        name: id,
        overwrite: true
      })
    } else {
      mkdirp.sync(`${__dirname}/storage/Excel`)
    }
    let updateTopic = await Topic.query().where({ _id: id }).update({ image: image.fileName })
    response.send(topic)
  }

  async update ({ params, request, response }) {
    let body = request.only(['data'])
    body = JSON.parse(body.data)
    const image = request.file('image', {
      types: ['image'],
      size: '20mb'
    })
    if (image !== null) {
      if (Helpers.appRoot('storage/uploads/topics')) {
        await image.move(Helpers.appRoot('storage/uploads/topics'), {
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
    const update = await Topic.where('_id', id).update(body)
    response.send(update)
  }

  async destroy ({ params, response }) {
    const data = await Topic.where('_id', params.id).delete()
    response.send(data)
  }
  async destroyAll ({ response, params }) {
    let course_id = new ObjectId(params.id)
    const data = await Topic.where({course_id: course_id}).delete()
    response.send(data)
  }
}

module.exports = TopicController
