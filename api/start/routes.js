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
    Route.get('topic_by_id/:id', 'TopicController.getTopicById')
    Route.post('topic_test', 'TopicController.testCreate')
    Route.put('topic_test/:id', 'TopicController.testUpdate')
    Route.get('topic_test_by_id/:id', 'TopicController.getTestById')
    Route.get('topic_result_by_id/:id', 'TopicController.getTestResult')
    Route.post('excel_topic', 'UploadController.excelTopic')

    Route.post('excel_law', 'UploadController.excelLaw')
    Route.get('getLaws', 'LawController.index')

    Route.post('excel_answer', 'UploadController.excelAnswer')
    Route.get('answers', 'AnswerController.indexAnswer')

    Route.post('excel_subTopic', 'UploadController.excelSubTopic')
    Route.get('subTopics', 'SubTopicController.index')

    Route.post('excel_type', 'UploadController.excelType')
    Route.get('types', 'TypeController.index')
    Route.get('mis_rutinas', 'TypeController.misRutinas')
    Route.post('type_test', 'TypeController.testCreate')
    Route.put('type_test/:id', 'TypeController.testUpdate')
    Route.get('type_by_id/:id', 'TypeController.getTypeById')
    Route.get('type_test_by_id/:id', 'TypeController.getTestById')
    Route.get('type_result_by_id/:id', 'TypeController.getTestResult')

    Route.post('excel_article', 'UploadController.excelArticle')
    Route.get('articles', 'ArticleController.index')
    Route.get('getArticlesByLaw/:id', 'ArticleController.getArticlesByLaw')

    Route.get('examen', 'ExamenController.index')
    Route.get('mis_examenes', 'ExamenController.misExamenes')
    Route.get('ExamById/:id', 'ExamenController.examById')
    Route.post('examen_test', 'ExamenController.testCreate')
    Route.put('examen_test/:id', 'ExamenController.testUpdate')
    Route.get('examen_test_by_id/:id', 'ExamenController.getTestById')
    Route.get('examen_result_by_id/:id', 'ExamenController.getTestResult')
    Route.post('examen', 'ExamenController.store')
    Route.post('excel_exam', 'UploadController.excelExam')
    Route.get('getExamWithTest/:id', 'ExamenController.getExamWithTest')
    Route.put('examen/:id', 'ExamenController.update')
    Route.delete('examen/:id', 'ExamenController.destroy')

    Route.get('titles', 'TitleController.index')

    Route.get('placesByCommunityId/:id', 'PlaceController.show')


    Route.post('newQuest', 'QuestionController.store')
    Route.post('excel_question', 'UploadController.excelQuestion')
    Route.put('multiplesQuestions', 'QuestionController.multiplesQuestions')
    Route.get('getQuestions', 'QuestionController.index')
    Route.get('getQuestionsbyTest/:id', 'QuestionController.getQuestionsbyTest')
    Route.get('getQuestionsbyExam/:id', 'QuestionController.getQuestionsbyExam')
    Route.get('getFullQuestions/', 'QuestionController.getFullQuestions')
    Route.put('updateQuest/:id', 'QuestionController.update')
    Route.get('getQuestionById/:id', 'QuestionController.show')
    Route.delete('destroyQuest/:id', 'QuestionController.destroy')

    Route.post('newBlog', 'BlogController.store')
    Route.put('updateBlog/:id', 'BlogController.update')
    Route.get('blogs', 'BlogController.index')
    // Route.get('dateExamUser', 'DateExamController.dateExamUser')
    Route.delete('destroyBlog/:id', 'BlogController.destroy')
    Route.get('blogById/:id', 'BlogController.show')

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

  }).middleware("auth")
);
