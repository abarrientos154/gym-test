'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return {
    greeting: 'Hello world in JSON'
  }
})

const addPrefixToGroup = group => {
  // Grupo para rutas con prefijo /api/
  group.prefix("api");
  return group;
};


addPrefixToGroup(
  Route.group(() => {
    // Insertar rutas sin protección de autenticación aquí
    Route.post("login", "UserController.login");
    Route.post("register", "UserController.register")

    Route.get('communities', 'CommunityController.index')

    Route.get('perfil_img/:file', 'UploadController.getFileByDirectoryPerfil')
    Route.get('nivel_img/:file', 'UploadController.getFileByDirectoryNiveles')
    Route.get('pregunta_img/:file', 'UploadController.getFileByDirectoryPreguntas')
    Route.get('news_img/:file', 'UploadController.getFileByDirectoryNews')
    Route.get('topics_img/:file', 'UploadController.getFileByDirectoryTopics')

  })
);

addPrefixToGroup(
  Route.group(() => {
    // Insertar rutas con protección de autenticación aquí
    Route.get("user_info", "UserController.userInfo")
    Route.get("all_user", "UserController.index")
    Route.put('updateUser/:id', 'UserController.update')
    Route.put('update_user_info/:id', 'UserController.updateUserInfo')
    Route.put('update_perfilImg', 'UserController.updatePerfilImg')
    Route.get('course', 'AsignaturaController.index')
    Route.get('asignatura_by_id/:id', 'AsignaturaController.getAsignaturaById')
    Route.get('getCourseWithTest/:id', 'AsignaturaController.getCourseWithTest')
    Route.put('updateAsignatura/:id', 'AsignaturaController.update')

    Route.get('getTopics', 'TopicController.index')
    Route.get('getTopicsByCourse/:id', 'TopicController.indexByCourse')
    Route.get('topic_by_id/:id', 'TopicController.getTopicById')
    Route.post('topic_test', 'TopicController.testCreate')
    Route.put('topic_test/:id', 'TopicController.testUpdate')
    Route.get('topic_test_by_id/:id', 'TopicController.getTestById')
    Route.get('topic_result_by_id/:id', 'TopicController.getTestResult')
    Route.post('excel_topic', 'UploadController.excelTopic')
    Route.get('getTopicById/:id', 'TopicController.show')
    Route.post('setTopic', 'TopicController.store')
    Route.put('updateTopic/:id', 'TopicController.update')
    Route.delete('deleteTopic/:id', 'TopicController.destroy')

    Route.post('excel_law', 'UploadController.excelLaw')
    Route.get('getLaws', 'LawController.index')
    Route.get('getLawsByCourse/:id', 'LawController.indexByCourse')
    Route.get('getLawById/:id', 'LawController.show')
    Route.post('setLaw', 'LawController.store')
    Route.put('updateLaw/:id', 'LawController.update')
    Route.delete('deleteLaw/:id', 'LawController.destroy')

    Route.post('excel_answer', 'UploadController.excelAnswer')
    Route.get('answers', 'AnswerController.indexAnswer')
    Route.get('getAnswerById/:id', 'AnswerController.showN')
    Route.post('setAnswer', 'AnswerController.storeN')
    Route.put('updateAnswer/:id', 'AnswerController.updateN')
    Route.delete('deleteAnswer/:id', 'AnswerController.destroyN')
    Route.post('getAnswersByFilter/:id', 'AnswerController.getAnswersByFilter')

    Route.post('excel_subTopic', 'UploadController.excelSubTopic')
    Route.get('subTopics', 'SubTopicController.index')
    Route.get('getSubTopicsByCourse/:id', 'SubTopicController.indexByCourse')
    Route.get('getSubTopicById/:id', 'SubTopicController.show')
    Route.post('setSubTopic', 'SubTopicController.store')
    Route.put('updateSubTopic/:id', 'SubTopicController.update')
    Route.delete('deleteSubTopic/:id', 'SubTopicController.destroy')

    Route.post('excel_type', 'UploadController.excelType')
    Route.get('types', 'TypeController.index')
    Route.get('getTypesByCourse/:id', 'TypeController.indexByCourse')
    Route.get('mis_rutinas', 'TypeController.misRutinas')
    Route.post('type_test', 'TypeController.testCreate')
    Route.put('type_test/:id', 'TypeController.testUpdate')
    Route.get('type_by_id/:id', 'TypeController.getTypeById')
    Route.get('type_test_by_id/:id', 'TypeController.getTestById')
    Route.get('type_result_by_id/:id', 'TypeController.getTestResult')
    Route.get('getTypeById/:id', 'TypeController.show')
    Route.post('setType', 'TypeController.store')
    Route.put('updateType/:id', 'TypeController.update')
    Route.delete('deleteType/:id', 'TypeController.destroy')

    Route.post('excel_article', 'UploadController.excelArticle')
    Route.get('articles', 'ArticleController.index')
    Route.get('getArticlesByLaw/:id', 'ArticleController.getArticlesByLaw')
    Route.get('getArticleById/:id', 'ArticleController.show')
    Route.post('setArticle', 'ArticleController.store')
    Route.put('updateArticle/:id', 'ArticleController.update')
    Route.delete('deleteArticle/:id', 'ArticleController.destroy')
    Route.post('getArticlesByFilter/:id', 'ArticleController.getArticlesByFilter')
    
  
    Route.get('getParagraphsByArticle/:id', 'ParagraphController.getParagraphsByArticle')
    Route.get('getParagraphById/:id', 'ParagraphController.show')
    Route.post('setParagraph', 'ParagraphController.store')
    Route.put('updateParagraph/:id', 'ParagraphController.update')
    Route.delete('deleteParagraph/:id', 'ParagraphController.destroy')
    Route.post('getParagraphsByFilter/:id', 'ParagraphController.getParagraphsByFilter')

    Route.get('examen', 'ExamenController.index')
    Route.get('getExamByCourse/:id', 'ExamenController.indexByCourse')
    Route.get('mis_examenes', 'ExamenController.misExamenes')
    Route.get('ExamById/:id', 'ExamenController.examById')
    Route.post('examen_test', 'ExamenController.testCreate')
    Route.put('examen_test/:id', 'ExamenController.testUpdate')
    Route.get('examen_test_by_id/:id', 'ExamenController.getTestById')
    Route.get('examen_result_by_id/:id', 'ExamenController.getTestResult')
    Route.post('examen', 'ExamenController.store')
    Route.post('excel_exam', 'UploadController.excelExam')
    Route.get('getExamWithTest/:id', 'ExamenController.getExamWithTest')
    Route.get('getExamById/:id', 'ExamenController.show')
    Route.put('examen/:id', 'ExamenController.update')
    Route.delete('examen/:id', 'ExamenController.destroy')

    Route.get('titles', 'TitleController.index')

    Route.get('placesByCommunityId/:id', 'PlaceController.show')


    Route.post('newQuest', 'QuestionController.store')
    Route.post('excel_question', 'UploadController.excelQuestion')
    Route.put('multiplesQuestions', 'QuestionController.multiplesQuestions')
    Route.get('getQuestions', 'QuestionController.index')
    Route.post('getQuestionsByFilter/:id', 'QuestionController.getQuestionsByFilter')
    Route.get('getQuestionsbyTest/:id', 'QuestionController.getQuestionsbyTest')
    Route.get('getQuestionsByTopic/:id', 'QuestionController.getQuestionsByTopic')
    Route.get('getQuestionsbyExam/:id', 'QuestionController.getQuestionsbyExam')
    Route.get('getFullQuestions/', 'QuestionController.getFullQuestions')
    Route.put('updateQuest/:id', 'QuestionController.update')
    Route.get('getQuestionById/:id', 'QuestionController.show')
    Route.delete('destroyQuest/:id', 'QuestionController.destroy')

    // Route.get('dateExamUser', 'DateExamController.dateExamUser')

    Route.post('answer', 'AnswerController.store')
    Route.put('answer/:id', 'AnswerController.update')
    Route.get('answerById/:id', 'AnswerController.show')

    Route.post('desafio', 'AnswerController.storeDesafio')
    Route.get('desafio', 'AnswerController.index')
    Route.get('desafiado_desafios', 'AnswerController.indexDesafiado')
    Route.get('creador_desafios', 'AnswerController.indexCreador')
    Route.get('desafioById/:id', 'AnswerController.showDesafio')
    Route.put('desafio/:id', 'AnswerController.edit')
    Route.put('desafio_value/:id', 'AnswerController.editDesafio')

    Route.get('getCourses', 'CourseController.index')
    Route.post('setCourse', 'CourseController.store')
    Route.put('updateCourse/:id', 'CourseController.update')
    
    
    Route.get('news', 'NewsController.index')
    Route.get('newsByCourse/:id', 'NewsController.indexByCourse')
    Route.get('newsById/:id', 'NewsController.show')
    Route.post('setNews', 'NewsController.store')
    Route.put('updateNews/:id', 'NewsController.update')
    Route.delete('deleteNews/:id', 'NewsController.destroy')
    
    Route.post('setFault', 'FaultController.store')
    Route.get('faultsByCourse/:id', 'FaultController.indexByCourse')
    Route.put('checkFault/:id', 'FaultController.checkFault')
    

  }).middleware("auth")
);
