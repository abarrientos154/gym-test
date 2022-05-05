'use strict'
const User = use('App/Models/User')
const Income = use('App/Models/Income')
const License = use('App/Models/License')
const Course = use('App/Models/Course')
const ObjectId = require('mongodb').ObjectId

class IncomeController {

  async index ({ request, response, view }) {
    const data = (await Income.query().where({}).fetch()).toJSON()
    let total = 0
    for (const i in data) {
      let idCour = new ObjectId(data[i].course_id)
      let idUser = new ObjectId(data[i].user_id)
      let course = (await Course.find(idCour))
      let user = (await User.find(idUser))
      if (course !== null && user !== null) {
        data[i].courseName = course.name
        data[i].userName = user.name
        data[i].days = data[i].type === 'price30' ? '30 días' : data[i].type === 'price60' ? '60 días' : '90  días'
      }
      total = total + data[i].amount
    }
    total = new Intl.NumberFormat().format(total)
    const send = {
      data,
      total
    }
    response.send(send)
  }

  async create ({ request, response, view }) {
  }

  async store ({ request, response }) {
  }

  async show ({ params, request, response, view }) {
  }

  async edit ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }

}

module.exports = IncomeController
