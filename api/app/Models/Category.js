'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
    static get fillable() {
        return ['name']
    }

    courses () {
        return this.hasMany('App/Models/Course', '_id', 'category_id')
    }
}

module.exports = Category
