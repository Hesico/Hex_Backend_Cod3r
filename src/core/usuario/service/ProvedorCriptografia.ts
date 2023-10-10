// Na arquitetura haxagonal: Porta
// faz parte do core
export default interface ProvedorCriptografia {
    criptografar(texto: string) : string
    comparar(senha: string, senhaCriptografada: string): boolean
}