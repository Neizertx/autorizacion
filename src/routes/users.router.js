import { Router } from "express";
import passport from "passport";
import UsersManager from "../persistencia/daos/mongoManager/UsersManager.js";


const router = Router();

const usersManager = new UsersManager(); 




router.post("/registro", 
  passport.authenticate('registro', {
    failureRedirect: '/users/errorRegistro', 
    successRedirect: '/users/perfil',
    passReqToCallback: true, 
}));


router.get('/registroGitHub', passport.authenticate('github', { scope: [ 'user:email' ] }) )// 
router.get('/github', passport.authenticate('github'), (req, res)=>{
  req.session.first_name = req.user.first_name; 
  res.redirect('/users/perfil')
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersManager.loginUser(req.body);
  
  if (user) {
    req.session.email = email;
    req.session.password = password;
    res.cookie('userInfo', user);
    res.redirect('/users/perfil');
  } else {
    res.redirect('/users/errorLogin');
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie('userInfo'); // 
  
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/users/login");
    }
  });
  res.redirect("/users/login");
});

router.get("/perfil", (req , res) => { 
    const {usuario} = req.cookies.userInfo;


})


export default router;
