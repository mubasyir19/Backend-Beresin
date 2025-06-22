import { Router } from 'express';
import { login } from '../controllers/auth/auth.controller';
import {
  addMemberProject,
  addProject,
  getProjects,
  updateProjectPriority,
  updateProjectStatus,
} from '../controllers/project/project.controller';
import { addTask, getTasks, updateTaskPriority, updateTaskStatus } from '../controllers/task/task.controller';
import { addUser } from '../controllers/user/user.controller';
import { verifyAuth } from '../middleware/auth';
import { authorizeRole } from '../middleware/role';
import {
  addCommentProject,
  addCommentTask,
  getCommentsProject,
  getCommentsTask,
} from '../controllers/comment/comment.controller';
const router = Router();

router.post('/auth/login', login);
router.post('/user/add', addUser);

router.get('/projects', verifyAuth, getProjects);
router.post('/project/add', verifyAuth, authorizeRole(['Admin', 'Manager']), addProject);
router.post('/project/member/add', addMemberProject);
router.put('/project/status/:id/edit', verifyAuth, updateProjectStatus);
router.put('/project/priority/edit', verifyAuth, updateProjectPriority);

router.get('/tasks', verifyAuth, getTasks);
router.post('/task/add', verifyAuth, addTask);
router.put('/task/status/:id/edit', verifyAuth, updateTaskStatus);
router.put('/task/priority/edit', verifyAuth, updateTaskPriority);

router.get('/project/:projectId/comments', verifyAuth, getCommentsProject);
router.get('/task/:projectId/:taskId/comments', verifyAuth, getCommentsTask);
router.post('/project/:projectId/comment', verifyAuth, addCommentProject);
router.post('/project/:projectId/task/:taskId/comment', verifyAuth, addCommentTask);

export default router;
