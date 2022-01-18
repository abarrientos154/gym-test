'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TypeTest extends Model {
    typeInfo () {
        return this.hasOne('App/Models/Type', 'type_id', 'id')
    }
}

module.exports = TypeTest
