'use strict'
const License = use('App/Models/License')
const Env = use('Env')
const View = use('View')
const StripeKey = Env.get('STRIPE_KEY')
const StripeKeyPrivate = Env.get('STRIPE_KEY_PRIVATE')
console.log(StripeKey, 'stripekey')
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
  async index ({ response }) {
    const data = (await License.query().where({}).fetch()).toJSON()
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
    console.log(body, 'soy un body testStripe')
    View.global('ruta', function () {
      return `/api/procesador_pagos/${body.user_id}/${body.montoTotal}/${body.ref}`
    })
    return view.render('paytoshop')
  }

  async procesarPago ({ request, params, view, response }) {
    let body = params
    console.log(body, 'soy un body')
    let totalPagar = body.montoTotal * 100
    console.log(totalPagar, 'total')
    var url1, url2
    url1 = 'https://eiche.gymtest.app/pago_apro'
    url2 = 'https://eiche.gymtest.app/pago_cance'
    console.log(url1, url2)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Productos',
            },
            unit_amount: totalPagar,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${url1}?user_id=${params.user_id}&ref=${params.ref}`,
      cancel_url: `${url2}?user_id=${params.user_id}&ref=${params.ref}&cancel=${0}`,
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
