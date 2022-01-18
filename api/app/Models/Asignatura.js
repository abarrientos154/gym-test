'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Asignatura extends Model {
    static get fillable() {
        return ['name','status']
    }
    tests () {
        return this.hasMany('App/Models/Nivele', '_id', 'family_id')
    }
}

module.exports = Asignatura
