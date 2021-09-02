'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Question extends Model {
    answers () {
        return this.hasMany('App/Models/Answer', 'id', 'id_question')
    }

    leyInfo () {
        return this.hasOne('App/Models/Law', 'law_id', 'id')
    }

    articuloInfo () {
        return this.hasOne('App/Models/Article', 'article', 'article_name')
    }
}

module.exports = Question
