const { Router } = require('express')
const { check } = require('express-validator')
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require('../controllers/rooms')
const { roomExists } = require('../helpers/db-validators')
const { validateJWT, isTeacherRole } = require('../middlewares')
const { validateFields } = require('../middlewares/validate-fields')

const router = Router()

router.get('/', getRooms)

router.get(
  '/:id',
  [
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(roomExists),
    validateFields,
  ],
  getRoomById
)

router.post(
  '/',
  [
    validateJWT,
    isTeacherRole,
    check('name', 'Name is required').not().isEmpty(),
    check('number', 'Number is required').not().isEmpty(),
    check('members').optional().isArray().isMongoId(),
    validateFields,
  ],
  createRoom
)

router.put(
  '/:id',
  [
    validateJWT,
    isTeacherRole,
    check('name', 'Name is required').optional().not().isEmpty(),
    check('number', 'Number is required').optional().not().isEmpty(),
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(roomExists),
    check('members').optional().isArray().isMongoId(),
    validateFields,
  ],
  updateRoom
)

router.delete(
  '/:id',
  [
    validateJWT,
    isTeacherRole,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(roomExists),
    validateFields,
  ],
  deleteRoom
)

module.exports = router
