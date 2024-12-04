const expresss=require("express")
const Router=expresss.Router();

const {loginController,registerController,fetchAllUsersController}=require('../Controller/userController')

const {protect}=require('../middleware/authMiddleware')

Router.post('/login',loginController)
Router.post('/register',registerController)
Router.get('/fetchUsers',protect,fetchAllUsersController)

module.exports=Router;