const express = require('express');
const router = express.Router();
const {getHabits, getOneHabit, getHabitProgress, adoptHabit, dropHabit, updateMilestone, commentHabit, deleteComment, showComments, editComment} = require('../controllers/habitControllers.js');
const { validateToken } = require('../JWT');

// Rota para listar todos os hábitos
router.get('/', getHabits);

// Rota para listar o progresso dos hábitos
router.get('/progress', validateToken, getHabits);

router.route('/:id')
  .get(getOneHabit)
  .post(validateToken, adoptHabit)
  .delete(validateToken,dropHabit)

// Rota para obter o progresso de um hábito específico
router.get('/:id/progress', validateToken, getHabitProgress);

router.route('/:id/comment')
  .get(validateToken, showComments)
  .post(validateToken, commentHabit);

router.route('/:id/comment/:commentId')
  .put(validateToken, editComment)
  .delete(validateToken, deleteComment);

router.route('/:id/progress/:milestone')
.put(validateToken, updateMilestone)

module.exports = router;