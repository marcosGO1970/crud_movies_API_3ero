const { Movie, Genre } = require("../../database/models");
const { Op } = require("sequelize");
const fetch = require('node-fetch');

const moment = require("moment");
const { request } = require("express");

const formatDate = (fecha) => {
    return moment(fecha).format('YYYY-MM-DD');
}

const moviesController = {

    list: async (req, res) => {
        try {
            const movies = await Movie.findAll();
            return res.json({
                meta: {
                    status: 200,
                    total: movies.length,
                    url: '/api/movies'                
                },
                data: {movies}
            })                   

        } catch (error) {
            res.json(error.message)
        }
    },


    new: async (req, res) => {
        try {
            const movies = await Movie.findAll({
                order: [["release_date", "DESC"]],
                limit: 5
            });
            return res.json({
                meta: {
                    status: 200,
                    total: movies.length,
                    url: '/api/movies/new'                
                },
                data: {movies}
            })                   
        } catch (error) {
            res.json(error.message)
        }           
    },


    recommended: async (req, res) => {
        try {
            const movies = await Movie.findAll({
                where: {
                    rating: {
                        [Op.gte]: 8
                    }
                },
                order: [["rating", "DESC"]],
                limit: 10
            });
            return res.json({
                meta: {
                    status: 200,
                    total: movies.length,
                    url: '/api/movies/recommended'                
                },
                data: {movies}
            })                   
        } catch (error) {
            res.json(error.message)
        }  
    },


    detail: async (req, res) => {
        try {
            const { id } = req.params
            const movie = await Movie.findByPk(id, {
                include: ['genre','actors']
            });
            return res.json({
                meta: {
                    status: 200,
                    url: '/api/movies/detail/id'                
                },
                data: {movie}
            })
        } catch (error) {
            res.json(error.message)
        }
    },

    //Aquí debemos modificar y completar lo necesario para trabajar con el CRUD

    // add: async (req, res) => {
    //     try {
    //         const generos = await Genre.findAll()
    //         res.render("./movies/moviesAdd", { generos })

    //     } catch (error) {
    //         res.json(error.message)
    //     } 
    // },


    create: async (req, res) => { 
        try {
            const { body } = req;
            const movie = await Movie.create({
                ...body
            });
            return res.json({
                meta: {
                    status: 200,
                    url: '/api/movies/create'                
                },
                data: {movie}
            })
        } catch (error) {
            res.json(error.message)
        }
    },


    // edit: async (req, res) => { 
    //     try {
    //         const { id } = req.params
    //         const movie = await Movie.findByPk(id);
    //         const generos = await Genre.findAll()
    //         return res.render("./movies/moviesEdit", { 
    //             movie,
    //             date: formatDate(movie.release_date),
    //             generos  
    //         })
    //     } catch (error) {
    //         res.json(error.message)
    //     }
    // },


    update: async (req, res) => { 
        try {
            const { body } = req;
            const { id } = req.params;
            await Movie.update({
                ...body
            }, {
                where: {
                    id: id
                }
            });
            const movie = await Movie.findByPk(id, {
                include: ['genre','actors']
            });
            return res.json({
                meta: {
                    status: 200,
                    url: '/api/movies/update/id'                
                },
                data: {movie}
            })                   
        } catch (error) {
            res.json(error.message)
        }
    },


    // delete: async (req, res) => { 
    //     try {
    //         const { id } = req.params;
    //         const movie = await Movie.findByPk(id);
    //         return res.render(`./movies/moviesDelete`, { movie })
    //     } catch (error) {
    //         res.json(error.message)
    //     }
    // },


    destroy: async (req, res) => { 
        try {
            const { id } = req.params;
            const movie = await Movie.findByPk(id, {
                include: ['genre','actors']
            });
            await Movie.destroy({
                where: {
                    id
                }
            }, {
                force: true
            });
            return res.json({
                meta: {
                    status: 200,
                    url: '/api/movies/delete/id'                
                },
                data: {movie}
            })
        } catch (error) {
            res.json(error.message)
        }
    },

    search: async (req, res) => {
        try {
            const { title } = req.body;
            const api = "http://www.omdbapi.com/?apikey=a93897b9&t=";
            const movie = await fetch( api + title)
                .then(res => res.json());
            let respuesta = {
                meta: {
                    status: 200,
                    url: '/api/movies/search'                
                },
                data: {movie}
            }
            return res.json(respuesta);
        } catch (error) {
            res.json(error.message)
        }
    },
};

module.exports = moviesController;
