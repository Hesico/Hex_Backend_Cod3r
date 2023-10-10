import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import RepositorioUsuarioPg from './external/db/RepositorioUsuarioPg';
import SenhaCripto from './external/auth/SenhaCripto';
import RegistrarUsuario from './core/usuario/service/RegistrarUsuario';
import RegistrarUsuarioController from './external/api/RegistrarUsuarioController';
import LoginUsuario from './core/usuario/service/LoginUsuario';
import LoginUsuarioController from './external/api/LoginUsuarioController';
import ObterProdutoPorId from './core/produto/service/ObterProdutoPorId';
import ObterProdutoPorIdController from './external/api/ObterProdutoPorIdController';
import UsuarioMiddleware from './external/api/UsuarioMiddleware';

const app = express();
const port = process.env.API_PORT ?? 4000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(port, () => {
    console.log("Iniciado");
});

// ---------------- ROTAS ABERTAS ---------------------

// Adaptadores
const repositorioUsuario = new RepositorioUsuarioPg();
const provedorCripto = new SenhaCripto();

// Casos de uso
const registrarUsuario = new RegistrarUsuario(repositorioUsuario, provedorCripto);
const loginUsuario = new LoginUsuario(repositorioUsuario, provedorCripto);

// Controllers
new RegistrarUsuarioController(app, registrarUsuario);
new LoginUsuarioController(app, loginUsuario);

// ---------------- ROTAS PROTEGIDAS ---------------------

const usuarioMid = UsuarioMiddleware(repositorioUsuario);

// Casos de uso
const obterProdutoPorId = new ObterProdutoPorId()

// Controllers
new ObterProdutoPorIdController(app,obterProdutoPorId, usuarioMid);