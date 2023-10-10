import {Request, Response, NextFunction} from "express"
import ProvedorJwt from "./ProvedorJwt";
import Usuario from "@/core/usuario/model/Usuario";
import RepositorioUsuario from "@/core/usuario/service/RepositorioUsuario";

export default function UsuarioMiddleware(repositorio: RepositorioUsuario){
    return async (req: Request, res: Response, next : NextFunction) => {
        const acessoNegado = () => res.status(403).send('Token Inválido');
        
        const token = req.headers.authorization?.replace('Bearer ',"");
        if(!token) return acessoNegado();

        const provedorJWT = new ProvedorJwt(process.env.JWT_SECRET!);
        const usuarioToken = provedorJWT.obter(token) as Usuario;
        
        const usuario = await repositorio.buscarPorEmail(usuarioToken.email);

        if(!usuario) return acessoNegado();

        (req as any).usuario = usuario;
        next()
    }
}