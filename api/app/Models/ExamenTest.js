'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ExamenTest extends Model {
    examenInfo () {
        return this.hasOne('App/Models/Examen', 'examen_id', 'id')
    }
}

module.exports = ExamenTest
