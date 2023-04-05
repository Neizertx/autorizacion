import { usersModel } from "../../models/users.models.js";
import { hashPassword, comparePassword } from "../../../utils.js";

export default class UsersManager {

  async createUser(user) {
    const { email, password } = user;
    try {
      const existeUsuario = await usersModel.find({ email });
      if (existeUsuario.length === 0) {
        const hashNewPassword = await hashPassword(password); 
        const newUser = { ...user, password: hashNewPassword , rol: 'user'}; 
        await usersModel.create(newUser);
        return newUser;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async loginUser(user) {
    const { email, password } = user;
    const usuario = await usersModel.findOne({ email });

    if (usuario) {
      const isPassword = await comparePassword(password, usuario.password); 

      if (isPassword) {
        return usuario;
      }
    } else {
      return null;
    }
  }
}
