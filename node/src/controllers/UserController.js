const { update } = require('../models/Users');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');


function generateToken(params={}){
    return jwt.sign(params,authConfig.secret,{
        expiresIn:78300,
    })
}
module.exports = {

    async login(req,res){
        const {password,email,islogged } = req.body;
        const user = await User.findOne({where:{email}});
        if(!user){
            return res.status(400).send({
                status:0,
                message: 'Email o contraseña incorrecto'
            });
        }
        if(!bcrypt.compareSync(password,user.password)){
            return res.status(400).send({
                status:0,
                message:'Email o contraseña incorrecto'
            });
        }

        const user_id = user.id;

        await User.update({
            islogged
        },{
            where:{
                id:user_id
            }
        });
        user.password = undefined

        const token = generateToken({id:user.id});


        return res.status(200).send({
            status:1,
            message:"Usuario logeado correctamente",
            user,token
        });
    },


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
        const token = generateToken({id:user.id});

        return  res.status(200).send({
            status:1,
            message: 'Usuario registrado correctamente',
            user,token
        });

    },
    async update(req,res){
        const id = req.params.id;
        const {name,password,email} = req.body;

        const {user_id} = req.params;
        try {
            const user = await User.findByPk(id);
            if(user){
                await User.update({ name,password,email}),{where:{id}};

                return res.status(200).json({
                    status:1,
                    message:"Usuario Actualizado correctamente",
                });
            }else{
                return res.status(400).json({
                    status:0,
                    message:'Usuario no encontrado'
                });
            }
        } catch (error) {
            return res.status(400).json({
                status: 0,
                message: 'Error al actualizar Usuario!' + error
            });
        }
    

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