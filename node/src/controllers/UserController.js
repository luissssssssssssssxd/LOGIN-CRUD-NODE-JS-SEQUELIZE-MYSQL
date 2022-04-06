const { update } = require('../models/Users');
const User = require('../models/Users');

module.exports = {

    async index (req,res){
        const users = await User.findAll();
        if(users == '' || users  == null){
            return res.status(200).send({message:"Ningun usuario encontrado"});
        }
        return res.status(200).send({users});
    },

    async store(req,res){
        //DATOS A INGRESAR
        const {name,password,email} = req.body;

        //ESPERAR ASYNC PARA METODO CREATE
        const user =  await User.create({name,password,email});

        return  res.status(200).send({
            status:1,
            message: 'Usuario registrado correctamente',
            user
        });

    },
    async update(req,res){

        const {name,password,email} = req.body;

        const {user_id} = req.params;

      

        await User.update({
            name,password,email
        },{
            where:{
                id:user_id
            }
        });
      
        return res.status(200).send({
            status:1,
            message:"Usuario actualizado correctamente",
        })

    },
    async delete (req,res){

        const {user_id} = req.params;

        await User.destroy({
            where:{
                id:user_id
            }
        });

   return res.status(200).send({
            status:1,
            message:"Usuario Eliminado correctamente",
        })
    }
}