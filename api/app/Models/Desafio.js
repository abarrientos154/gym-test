'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Desafio extends Model {
  static get objectIDs () { return [ '_id', 'creador_id', 'desafiado_id' ] }

  creadorInfo () {
    return this.hasOne('App/Models/User', 'creador_id', '_id')
  }
  desafiadoInfo () {
    return this.hasOne('App/Models/User', 'desafiado_id', '_id')
  }
}

module.exports = Desafio
