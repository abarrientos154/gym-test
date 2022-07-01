'use strict'
const Category = use("App/Models/Category")
const Course = use('App/Models/Course')
var ObjectId = require('mongodb').ObjectId;

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    let data = (await Category.query().where({}).fetch()).toJSON()
    response.send(data)
  }

  async catByCourses ({ request, response, view }) {
    try {
      let categories = (await Category.query().where({}).with('courses').fetch()).toJSON()

      // Traer el orden mayor de categorias
      let mayor = 0
      for (let i in categories) {
        if (categories[i].order && categories[i].order > mayor) {
          mayor = categories[i].order
        }
      }

      // Asigniar un orden a toda categoria
      let acu = 1
      for (let i in categories) {
        if (!categories[i].order) {
          let upd = await Category.query().where('_id', categories[i]._id).update({order: mayor + acu})
          categories[i].order = mayor + acu
          acu += 1
        }

        // Traer el orden mayor de los cursos de esa categoria
        let mayorCourse = 0
        for (let x in categories[i].courses) {
          if (categories[i].courses[x].order && categories[i].courses[x].order > mayorCourse) {
            mayorCourse = categories[i].courses[x].order
          }
        }

        // Asignar orden a los cursos de la categoria
        let acuCouse = 1
        for (let x in categories[i].courses) {
          if (!categories[i].courses[x].order) {
            const id = new ObjectId(categories[i].courses[x]._id)
            let upd = await Course.query().where('_id', id).update({order: mayorCourse + acuCouse})
            categories[i].courses[x].order = mayorCourse + acuCouse
            acuCouse += 1
          }
        }

        // Ordenar cursos de esta categoria
        categories[i].courses = categories[i].courses.sort(function (a, b) {
          if (a.order < b.order) {
            return -1
          }
          if (a.order > b.order) {
            return 1
          }
          return 0
        })
      }

      // Ordenar categorias
      categories = categories.sort(function (a, b) {
        if (a.order < b.order) {
          return -1
        }
        if (a.order > b.order) {
          return 1
        }
        return 0
      })

      response.send(categories)
    } catch (error) {
      console.error(error.name + 'store: ' + error.message);
    }
  }

  /**
   * Render a form to be used for creating a new category.
   * GET categories/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    let dat = request.all()
    let categories = (await Category.query().where({}).fetch()).toJSON()

    let body = dat

    let mayor = 0
    for (let i in categories) {
			if (categories[i].order && categories[i].order > mayor) {
				mayor = categories[i].order
			}
		}
    body.order = mayor + 1

    const cat = await Category.create(body)
    response.send(cat)
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing category.
   * GET categories/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
   async orderCategory ({ params, request, response, view }) {
    try {
      let data = request.all()
      const id1 = new ObjectId(data.id1)
      const id2 = new ObjectId(data.id2)
      let updC1 = await Category.query().where('_id', id1).update({order: data.order1})
      let updC2 = await Category.query().where('_id', id2).update({order: data.order2})
      response.send(true)
    } catch (error) {
      console.error(error.name + 'store: ' + error.message);
    }
  }

  async orderCourse ({ params, request, response, view }) {
    try {
      let data = request.all()
      const id1 = new ObjectId(data.id1)
      const id2 = new ObjectId(data.id2)
      let updC1 = await Course.query().where('_id', id1).update({order: data.order1})
      let updC2 = await Course.query().where('_id', id2).update({order: data.order2})
      response.send(true)
    } catch (error) {
      console.error(error.name + 'store: ' + error.message);
    }
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    let body = request.only(Category.fillable)
    let cat = await Category.query().where('_id', params.id).update(body)
    response.send(cat)
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    let data = await Category.find(params.id)
    data.delete()
    response.send(data)
  }
}

module.exports = CategoryController
