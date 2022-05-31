'use strict'
const Course = use('App/Models/Course')
const ObjectId = require('mongodb').ObjectId
const Category = use("App/Models/Category")
const Answer = use("App/Models/Answer")
const Audio = use('App/Models/Audio')
const Examen = use("App/Models/Examen")
const Forum = use('App/Models/Forum')
const GeneralTest = use("App/Models/GeneralTest")
const Question = use("App/Models/Question")
const Law = use("App/Models/Law")
const SubTopic = use("App/Models/SubTopic")
const Articulos = use("App/Models/Article")
const Parrafos = use("App/Models/Paragraph")
const Topic = use("App/Models/Topic")
const Type = use("App/Models/Type")
const News = use('App/Models/News')


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with courses
 */
class CourseController {
  /**
   * Show a list of all courses.
   * GET courses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    const data = await Course.all()
    response.send(data)
  }

  async courseById ({ response, params }) {
    const id = new ObjectId(params.id)
    let data = (await Course.find(id)).toJSON()
    response.send(data)
  }

  async indexClient ({ response }) {
    let allData = (await Category.query().where({}).with('courses').fetch()).toJSON()
    const data = []
    for (let i = 0; i < allData.length; i++) {
      let filterCour = allData[i].courses.filter(v => v.isEnabled)
      if (filterCour.length) {
        let catFilter = {
          ...allData[i],
          courses: allData[i].courses.filter(v => v.isEnabled)
        }
        data.push(catFilter)
      }
    }
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new course.
   * GET courses/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new course.
   * POST courses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const body = request.all()
    const course = await Course.create(body)
    response.send(course)
  }
  async update ({ params, request, response }) {
    let body = request.only(Course.fillable)
    const id = new ObjectId(params.id)
    let data = await Course.query().where('_id', id).update(body)
    response.send(data)
  }

  /**
   * Display a single course.
   * GET courses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing course.
   * GET courses/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async deleteAllCourse ({ params, request, response, view }) {
    var id = new ObjectId(params.id)
    const answers = await Answer.where('course_id', id).delete()
    const audios = await Audio.where('course_id', id).delete()
    const examenes = await Examen.where('course_id', id).delete()
    const foros = await Forum.where('course_id', id).delete()
    const generalTest = await GeneralTest.where('course_id', id).delete()
    const questions = await Question.where('course_id', id).delete()
    const sub_topics = await SubTopic.where('course_id', id).delete()
    const topics = await Topic.where('course_id', id).delete()
    const types = await Type.where('course_id', id).delete()
    const laws = await Law.where('course_id', id).delete()
    const parrafos = await Parrafos.where('course_id', id).delete()
    const articulos = await Articulos.where('course_id', id).delete()
    const noticias = await News.where('course_id', id).delete()
    const curso = await Course.where('_id', id).delete()
    response.send(true)
  }

  /**
   * Update course details.
   * PUT or PATCH courses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  /**
   * Delete a course with id.
   * DELETE courses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
}

module.exports = CourseController
