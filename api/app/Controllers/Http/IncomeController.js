'use strict'
const User = use('App/Models/User')
const Income = use('App/Models/Income')
const License = use('App/Models/License')

class IncomeController {

  async index ({ request, response, view }) {
    const data = (await Income.query().where({}).fetch()).toJSON()
    let total = 0
    for (const i in data) {
      const license = await License.query().where('_id', data[i].license_id).first()
      const user = await User.query().where('_id', data[i].user_id).first()
      if (license !== null && user !== null) {
        data[i].licenseTitle = license.name
        data[i].months = license.months
        data[i].userName = user.name
        data[i].licenseExpirationDate = user.licenseExpirationDate
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
