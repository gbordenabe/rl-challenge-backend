const { Router } = require('express')
const { check } = require('express-validator')
const {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
  userGetById,
} = require('../controllers/users')
const {
  isValidRole,
  emailExists,
  userExistsById,
} = require('../helpers/db-validators')
const { validateFields, validateJWT, isTeacherRole } = require('../middlewares')

const router = Router()

router.get('/', usersGet)

router.get('/:id', userGetById)

router.post(
  '/',
  [
    //validateJWT,
    //isTeacherRole,
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
    check('email', 'Email is not valid').isEmail(),
    check('email').custom(emailExists),
    check('role', 'Role is required').not().isEmpty(),
    check('role').custom(isValidRole),
    check('rooms').optional().isArray().isMongoId(),
    validateFields,
  ],
  usersPost
)

router.put(
  '/:id',
  [
    validateJWT,
    isTeacherRole,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(userExistsById),
    check('role').optional().custom(isValidRole),
    check('rooms').optional().isArray().isMongoId(),
    check('siblings').optional().isArray().isMongoId(),
    validateFields,
  ],
  usersPut
)

router.delete(
  '/:id',
  [
    validateJWT,
    isTeacherRole,
    check('id', 'Is not valid id').isMongoId(),
    check('id').custom(userExistsById),
    validateFields,
  ],
  usersDelete
)

module.exports = router
