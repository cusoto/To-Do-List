const { findByIdAndUpdate } = require('../models/project');
const project = require('../models/project');
const Project = require('../models/project');

exports.homePage = (req, res, next) => {
    res.render('index', { title: 'To Do' });
};

exports.dashboard = async (req, res, next) => {
    try{
        const allProjects = await Project.find({ user_id: req.user._id, completed: 'false'});
        res.render('dashboard', { title: 'Dashboard', allProjects });
    } catch(error) {
        next(error);
    }
};

exports.addProjectGet = (req, res) => {
    res.render('add_project', { title: 'Add New Project'});
};

exports.addProjectPost = async (req, res, next) => {
    try {
        const project = new Project({
            user_id: req.user._id,
            project_name: req.body.project_name,
            subprojects: [],
            completed: 'false'
        });
         await project.save();
         res.redirect('/dashboard')

    } catch(error) {
        next(error);
    }
};

exports.completedProjectsGet = async (req, res, next) => {
    try{
        const allProjects = await Project.find({ user_id: req.user._id, completed: 'true'});
        res.render('completed', { title: 'Completed', allProjects });
    } catch(error){
        next(error);
    }
};

exports.projectInfoGet = async (req, res, next) => {
    try{
        const projectId = req.params.id;
        const project = await Project.find({ 
            user_id: req.user._id, 
            _id: projectId
        });
        res.render('projectInfo', { project });

        
    } catch(error){
        next(error)
    }
};

exports.projectInfoPost = async (req, res, next) => {
    try{
        const projectId = req.params.id;
        const project = req.body;
        const old_project = await Project.findById(projectId);
        const len = Object.keys(project).length;
        
        for(let i = 1; i< len; i++) {
            var key = "project.description" + (i-1);
            var parsed_key = JSON.parse(JSON.stringify(key));
            old_project.subprojects[i-1].description = eval(parsed_key);
        }
        await Project. findByIdAndUpdate( projectId, old_project);

        res.redirect('/dashboard');

    } catch(error){
        next(error);
    }
};

exports.add_subprojectGet = async (req, res, next) => {
    try{
        const projectId = req.params.id;
        const project = await Project.find({ 
            user_id: req.user._id, 
            _id: projectId
        });
        res.render('add_subproject', { project });
    } catch(error){
        next(error)
    }
};

exports.add_subprojectPost = async (req, res, next) => {
    try{
        const projectId = req.params.id;
        const subproject = req.body;
        const project = await Project.findByIdAndUpdate(
            projectId, 
            { $push: { subprojects : { description: subproject.description}}}
        );
        res.redirect(`/project/${projectId}`);
        // res.json(project)
    } catch(error){
        next(error);
    }
};

exports.delete_project = async (req, res, next) => {
    try{
        const projectId = req.params.id;
        const project = await Project.findByIdAndDelete( projectId );
        res.redirect('/dashboard');
    } catch(error){
        next(error)
    }
};

exports.complete_project = async (req, res, next) => {
    try{
        const projectId = req.params.id;
        const project = await Project.findByIdAndUpdate(
            projectId,
            { completed: 'true'}
        );
        res.redirect('/dashboard');
    } catch(error){
        next(error)
    }
};

exports.revertProjectGet = async (req, res, next) => {
    try{
        const projectId = req.params.id;
        const project = await Project.findByIdAndUpdate(
            projectId,
            { completed: 'false'}
        );
        res.redirect('/dashboard');

    } catch(error){
        next(error)
    }
};

exports.delete_subprojectGet = async (req, res, next) => {
    try{
        const projectId = req.params.projectId;
        const subprojectId = req.params.subprojectId;
        if (!req.user ) {
            req.flash('info', 'You are now logged out');
            res.redirect(`/project/${projectId}`);
        }
        await Project.findByIdAndUpdate(
            projectId,
            { $pull: { subprojects : { _id: subprojectId } } }
        );
        res.redirect(`/project/${projectId}`);

    } catch(error) {
        next(error)
    }
}
exports.complete_subprojectGet = async (req, res, next) => {
    try{
        const projectId = req.params.projectId;
        const subprojectId = req.params.subprojectId;
        if (!req.user ) {
            req.flash('info', 'You are now logged out');
            res.redirect(`/project/${projectId}`);
        }
        const subproject = await Project.findById(projectId);
        console.log(subproject.subprojects.length);
        var des = ''
        for( let i=0; i< subproject.subprojects.length; i++){
            if (subproject.subprojects[i]._id = subprojectId){
                des = subproject.subprojects[i].description
            }
        }

        const project = await Project.findByIdAndUpdate(
            projectId, 
            { $push: { completed_subprojects : { description: des }}}
        );
        res.redirect(`/delete_subproject/${projectId}/${subprojectId}`);

    } catch(error) {
        next(error)
    }
}