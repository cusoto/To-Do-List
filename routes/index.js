var express = require('express');
var router = express.Router();

// Require controllers
const projectController = require('../controllers/projectController');
const userController = require('../controllers/userController');

//Project Routes
router.get('/', projectController.homePage);
router.get('/dashboard', projectController.dashboard);
router.get('/add_project', projectController.addProjectGet);
router.post('/add_project', projectController.addProjectPost);
router.get('/completed_projects', projectController.completedProjectsGet);
router.get('/project/:id', projectController.projectInfoGet);
router.post('/project/:id', projectController.projectInfoPost);
router.get('/add_subproject/:id', projectController.add_subprojectGet);
router.post('/add_subproject/:id', projectController.add_subprojectPost);
router.get('/delete_project/:id', projectController.delete_project);
router.get('/complete_project/:id', projectController.complete_project);
router.get('/revert_project/:id', projectController.revertProjectGet);
router.get('/delete_subproject/:projectId/:subprojectId', projectController.delete_subprojectGet);
router.get('/complete_subproject/:projectId/:subprojectId', projectController.complete_subprojectGet);


//User routes
router.get('/signup', userController.signupGet);
router.post('/signup', userController.signupPost, userController.loginPost);
router.get('/login', userController.loginGet);
router.post('/login', userController.loginPost);
router.get('/logout', userController.logout);

module.exports = router;
