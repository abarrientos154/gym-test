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
    Route.post('login_by_mail', 'UserController.logueoSinContrasena')
    Route.post("login", "UserController.login");
    Route.post("register", "UserController.register")
    Route.put("verifyAccount", "UserController.verifyAccount")

    Route.get('getCoursesClient', 'CourseController.indexClient')

    Route.get('news', 'NewsController.index')
    Route.get('newsById/:id', 'NewsController.show')

    Route.get('forums', 'ForumController.index')
    Route.get('forumById/:id', 'ForumController.show')
    Route.get('QuestionsForum/:id', 'ForumController.QuestionsForum')
    Route.get('questionAndResponses/:id', 'ForumController.questionAndResponses')

    Route.get('get_License_course/:id', 'LicenseController.index')

    Route.get('communities', 'CommunityController.index')
    Route.get("email_send_app/:email", "UserController.recuperacionapp")
    Route.put("actualizar_pass/:code", "UserController.actualizarPass")
    Route.get('perfil_img/:file', 'UploadController.getFileByDirectoryPerfil')
    Route.get('nivel_img/:file', 'UploadController.getFileByDirectoryNiveles')
    Route.get('pregunta_img/:file', 'UploadController.getFileByDirectoryPreguntas')
    Route.get('news_img/:file', 'UploadController.getFileByDirectoryNews')
    Route.get('topics_img/:file', 'UploadController.getFileByDirectoryTopics')
    Route.get('exams_img/:file', 'UploadController.getFileByDirectoryExams')
    Route.get('types_img/:file', 'UploadController.getFileByDirectoryTypes')
    Route.get('audios/:file', 'UploadController.getFileByDirectoryAudios')


    Route.get("pagar", "LicenseController.create")
    Route.post("procesador_pagos/:user_id/:montoTotal/:ref/:dias", "LicenseController.procesarPago");
    // Route.get("buy", "LicenseController.create")
  })
  );
  
  addPrefixToGroup(
  Route.group(() => {
    // Insertar rutas con protección de autenticación aquí
    Route.get("user_info", "UserController.userInfo")
    Route.get("all_user", "UserController.index")
    Route.get("getUsers", "UserController.indexListable")
    Route.put('updateUser/:id', 'UserController.update')
    Route.put('update_user_info/:id', 'UserController.updateUserInfo')
    Route.put('update_perfilImg', 'UserController.updatePerfilImg')
    Route.put('toDisable/:id', 'UserController.toDisable')
    Route.delete('deleteAllUsers', 'UserController.destroyAll')
    Route.get('getUserById/:id', 'UserController.show')
    
    /* Temas */
    Route.get('getTopics', 'TopicController.index')
    Route.get('getTopicsByCourse/:id', 'TopicController.indexByCourse')
    Route.get('topic_by_id/:id/:course', 'TopicController.getTopicById')
    Route.post('topic_test', 'TopicController.testCreate')
    Route.put('topic_test/:id', 'TopicController.testUpdate')
    Route.get('topic_test_by_id/:id/:course', 'TopicController.getTestById')
    Route.get('topic_result_by_id/:id', 'TopicController.getTestResult')
    Route.post('excel_topic', 'UploadController.excelTopic')
    Route.get('getTopicById/:id', 'TopicController.show')
    Route.post('setTopic', 'TopicController.store')
    Route.put('updateTopic/:id', 'TopicController.update')
    Route.delete('deleteTopic/:id', 'TopicController.destroy')
    Route.delete('deleteAllTopics/:id', 'TopicController.destroyAll')
    Route.get('getTopicWithAudio/:id', 'TopicController.getTopicWithAudio')
    Route.get('getTopicByNum/:id', 'TopicController.getTopicByNum')

    Route.post('test_by_tema/:id', 'TopicController.testByTopicCreate')
    Route.get('test_by_topic_by_id/:id/:course', 'TopicController.getTestByTopic')
    
    /* Leyes */
    Route.post('excel_law', 'UploadController.excelLaw')
    Route.get('getLaws', 'LawController.index')
    Route.get('getLawsByCourse/:id', 'LawController.indexByCourse')
    Route.get('getLawById/:id', 'LawController.show')
    Route.post('setLaw', 'LawController.store')
    Route.put('updateLaw/:id', 'LawController.update')
    Route.delete('deleteLaw/:id', 'LawController.destroy')
    Route.delete('deleteAllLaws/:id', 'LawController.destroyAll')
    
    /* SubTemas */
    Route.post('excel_subTopic', 'UploadController.excelSubTopic')
    Route.get('subTopics', 'SubTopicController.index')
    Route.get('getSubTopicsByCourse/:id', 'SubTopicController.indexByCourse')
    Route.get('getSubTopicById/:id', 'SubTopicController.show')
    Route.post('setSubTopic', 'SubTopicController.store')
    Route.put('updateSubTopic/:id', 'SubTopicController.update')
    Route.delete('deleteSubTopic/:id', 'SubTopicController.destroy')
    Route.delete('deleteAllSubTopics/:id', 'SubTopicController.destroyAll')
    
    /* Tipos (Gym) */
    Route.post('excel_type', 'UploadController.excelType')
    Route.get('types', 'TypeController.index')
    Route.get('getTypesByCourse/:id', 'TypeController.indexByCourse')
    Route.post('type_test', 'TypeController.testCreate')
    Route.put('type_test/:id', 'TypeController.testUpdate')
    Route.get('type_by_id/:id/:course', 'TypeController.getTypeById')
    Route.get('type_test_by_id/:id/:course', 'TypeController.getTestById')
    Route.get('type_result_by_id/:id', 'TypeController.getTestResult')
    Route.get('getTypeById/:id', 'TypeController.show')
    Route.post('setType', 'TypeController.store')
    Route.put('updateType/:id', 'TypeController.update')
    Route.delete('deleteType/:id', 'TypeController.destroy')
    Route.delete('deleteAllTypes/:id', 'TypeController.destroyAll')
    
    /* Artículos */
    Route.post('excel_article', 'UploadController.excelArticle')
    Route.get('articles', 'ArticleController.index')
    Route.get('getArticlesByLaw/:id', 'ArticleController.getArticlesByLaw')
    Route.get('getArticleById/:id', 'ArticleController.show')
    Route.post('setArticle', 'ArticleController.store')
    Route.put('updateArticle/:id', 'ArticleController.update')
    Route.delete('deleteArticle/:id', 'ArticleController.destroy')
    Route.post('getArticlesByFilter/:id', 'ArticleController.getArticlesByFilter')
    Route.delete('deleteAllArticles/;id', 'ArticleController.destroyAll')
    
    /* Párrafos */
    Route.post('excel_paragraph', 'UploadController.excelParagraph')
    Route.get('getParagraphsByArticle/:id', 'ParagraphController.getParagraphsByArticle')
    Route.get('getParagraphById/:id', 'ParagraphController.show')
    Route.post('setParagraph', 'ParagraphController.store')
    Route.put('updateParagraph/:id', 'ParagraphController.update')
    Route.delete('deleteParagraph/:id', 'ParagraphController.destroy')
    Route.post('getParagraphsByFilter/:id', 'ParagraphController.getParagraphsByFilter')
    Route.delete('deleteAllParagraphs/:id', 'ParagraphController.destroyAll')
    
    /* Exámenes */
    Route.get('examen', 'ExamenController.index')
    Route.get('getExamByCourse/:id', 'ExamenController.indexByCourse')
    Route.get('ExamById/:id/:course', 'ExamenController.examById')
    Route.post('examen_test', 'ExamenController.testCreate')
    Route.put('examen_test/:id', 'ExamenController.testUpdate')
    Route.get('examen_test_by_id/:id/:course', 'ExamenController.getTestById')
    Route.get('examen_result_by_id/:id', 'ExamenController.getTestResult')
    Route.post('examen', 'ExamenController.store')
    Route.post('excel_exam', 'UploadController.excelExam')
    Route.get('getExamWithTest/:id', 'ExamenController.getExamWithTest')
    Route.get('getExamById/:id', 'ExamenController.show')
    Route.put('examen/:id', 'ExamenController.update')
    Route.delete('examen/:id', 'ExamenController.destroy')
    Route.delete('deleteAllExams/:id', 'ExamenController.destroyAll')
    
    Route.get('titles', 'TitleController.index')
    
    Route.get('placesByCommunityId/:id', 'PlaceController.show')
    
    /* Preguntas */
    Route.post('newQuest', 'QuestionController.store')
    Route.post('excel_question', 'UploadController.excelQuestion')
    Route.get('getQuestions', 'QuestionController.index')
    Route.post('getQuestionsByFilter/:id', 'QuestionController.getQuestionsByFilter')
    Route.get('getQuestionsbyTest/:id', 'QuestionController.getQuestionsbyTest')
    Route.get('getQuestionsByTopic/:id/:course', 'QuestionController.getQuestionsByTopic')
    Route.put('updateQuest/:id', 'QuestionController.update')
    Route.get('getQuestionById/:id', 'QuestionController.show')
    Route.delete('destroyQuest/:id', 'QuestionController.destroy')
    Route.delete('deleteAllQuestions/:id', 'QuestionController.destroyAll')
    
    /* Respuestas */
    Route.post('answer', 'AnswerController.store')
    Route.put('answer/:id', 'AnswerController.update')
    Route.get('answerById/:id', 'AnswerController.show')
    Route.delete('deleteAllAnswers/:id', 'AnswerController.destroyAll')

    Route.post('excel_answer', 'UploadController.excelAnswer')
    Route.get('answers', 'AnswerController.indexAnswer')
    Route.get('getAnswerById/:id', 'AnswerController.showN')
    Route.post('setAnswer', 'AnswerController.storeN')
    Route.put('updateAnswer/:id', 'AnswerController.updateN')
    Route.delete('deleteAnswer/:id', 'AnswerController.destroyN')
    Route.post('getAnswersByFilter/:id', 'AnswerController.getAnswersByFilter')
    Route.delete('deleteAllAnswers', 'AnswerController.destroyAll')

    /* Cursos */
    Route.get('getCourses', 'CourseController.index')
    Route.get('course_by_id/:id', 'CourseController.courseById')
    Route.post('setCourse', 'CourseController.store')
    Route.put('updateCourse/:id', 'CourseController.update')

    /* Categorías */
    Route.resource("category", "CategoryController").apiOnly()
    Route.get('cat_by_courses', 'CategoryController.catByCourses')

    /* Noticias */
    Route.get('newsByCourse/:id', 'NewsController.indexByCourse')
    Route.post('setNews', 'NewsController.store')
    Route.put('updateNews/:id', 'NewsController.update')
    Route.delete('deleteNews/:id', 'NewsController.destroy')

    /* Foros */
    Route.get('forumByCourse/:id', 'ForumController.indexByCourse')
    Route.post('setForum', 'ForumController.store')
    Route.put('updateForum/:id', 'ForumController.update')
    Route.delete('deleteForum/:id', 'ForumController.destroy')
    Route.post('setQuestion', 'ForumController.setQuestion')
    Route.post('setResponse', 'ForumController.setResponse')
    Route.put('deleteQuestionForum/:id', 'ForumController.deleteQuestionForum')
    Route.put('deleteResponseQuestion/:id', 'ForumController.deleteResponseQuestion')

    /* Fallos */
    Route.post('setFault', 'FaultController.store')
    Route.get('faultsByCourse/:id', 'FaultController.indexByCourse')
    Route.put('checkFault/:id', 'FaultController.checkFault')

    /* Audios */
    Route.get('audiosByCourse/:id', 'AudioController.indexByCourse')
    Route.get('audioById/:id', 'AudioController.show')
    Route.post('setAudio', 'AudioController.store')
    Route.put('updateAudio/:id', 'AudioController.update')
    Route.delete('deleteAudio/:id', 'AudioController.destroy')
    Route.delete('deleteAllAudios', 'AudioController.destroyAll')
    Route.get('audiosByTopic/:id', 'AudioController.audiosByTopic')

    /* Licencias de los cursos */
    Route.put('setBuy/:type/:id', 'LicenseController.setBuy')
    Route.get('getSubscriptions', 'LicenseController.getSubscriptions')
    Route.put('add_days/:id', 'LicenseController.edit')

    /* Ingresos */
    Route.get('getIncomes', 'IncomeController.index')

    /* Test General */
    Route.get('topicsWithQuestions/:id', 'GeneralTestController.topicsWithQuestions')
    Route.get('verifyQuestions/:id', 'GeneralTestController.verifyQuestions')
    Route.post('setConfig', 'GeneralTestController.store')
    Route.get('test_general/:idCourse', 'GeneralTestController.getTestGeneral')
    Route.post('test_general/:idCourse', 'GeneralTestController.create')

    /* Estadisticas */
    Route.get('mis_rutinas/:courseId', 'TypeController.misRutinas')
    Route.get('mis_examenes/:courseId', 'ExamenController.misExamenes')
    Route.get('mis_test/:courseId', 'TopicController.misTests')
    Route.get('mis_test_by_temas/:courseId', 'TopicController.misTestByTopic')
    Route.put('test_by_tema/:id', 'TopicController.testByTemaUpdate')
    Route.get('mis_test_general/:courseId', 'GeneralTestController.misTestGeneral')

    Route.get("estadistic_users", "UserController.statisticUsers")

    Route.delete('deleteAllCourse/:id', 'CourseController.deleteAllCourse')
    
  }).middleware("auth")
  );
  