'use strict'
const License = use('App/Models/License')
const Income = use("App/Models/Income")
const Course = use('App/Models/Course')
const ObjectId = require('mongodb').ObjectId
const moment = require('moment')
const Env = use('Env')
const View = use('View')
const StripeKey = Env.get('STRIPE_KEY')
const StripeKeyPrivate = Env.get('STRIPE_KEY_PRIVATE')
const Stripe = require('stripe')
const stripe = Stripe(StripeKeyPrivate)

View.global('stripekey', function () {
  return StripeKey
})

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with licenses
 */
class LicenseController {
  /**
   * Show a list of all licenses.
   * GET licenses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response, params, auth }) {
    const user = (await auth.getUser()).toJSON()
    const data = (await License.query().where({user_id: user._id, course_id: params.id}).first())
    if (data) {
      let date = moment().format('YYYY-MM-DD')
      let days = moment(data.expirationDate).diff(date , 'days')
      if (days <= 0) {
        data.disable = true
        days = 0
      }
      data.days = days
    }
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new license.
   * GET licenses/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    let body = request.get()
    View.global('ruta', function () {
      return `/api/procesador_pagos/${body.user_id}/${body.montoTotal}/${body.ref}/${body.dias}`
    })
    return view.render('paytoshop')
  }

  async setBuy({ response, auth, params }) {
    const user = (await auth.getUser()).toJSON()
    const id = new ObjectId(params.id)
    let course = (await Course.query().find(id)).toJSON()
    const income = {
      course_id: course._id,
      user_id: user._id,
      type: params.type,
      amount: course[params.type]
    }
    const newIncome = await Income.create(income)

    const data = (await License.query().where({user_id: user._id, course_id: params.id}).first())
    let date = moment().format('YYYY-MM-DD')
    let days = params.type === 'price30' ? 30 : params.type === 'price60' ? 60 : 90
    if (data) {
      let daysRes = moment(data.expirationDate).diff(date , 'days')
      if (daysRes > 0) {
        days = days + daysRes
      }
    }
    income.expirationDate = moment(date).add(days, 'days').format('YYYY-MM-DD')
    if (data) {
      let updata = await License.query().where({user_id: user._id, course_id: params.id}).update(income)
    } else {
      const newLicense = await License.create(income)
    }

    response.send(true)
  }

  async procesarPago ({ request, params, view, response }) {
    let body = params
    let totalPagar = body.montoTotal * 100
    var url1, url2
    url1 = 'https://eiche.gymtest.app/pago_apro'
    url2 = 'https://eiche.gymtest.app/pago_cance'
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Membresia',
            },
            unit_amount: totalPagar,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${url1}?user_id=${params.user_id}&ref=${params.ref}&dias=${params.dias}`,
      cancel_url: `${url2}?user_id=${params.user_id}&ref=${params.ref}&cancel=${0}&dias=${params.dias}`,
    })
    response.send({ id: session.id })
  }

  /**
   * Create/save a new license.
   * POST licenses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single license.
   * GET licenses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing license.
   * GET licenses/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update license details.
   * PUT or PATCH licenses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a license with id.
   * DELETE licenses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = LicenseController
