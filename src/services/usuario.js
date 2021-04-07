import { urlAPI } from "../util/constants"

export async function login(username, password) {
    const res = await fetch(`${urlAPI}usuario/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password })
    })
    return res
}

export async function getPCPUsers() {
    const res = await fetch(`${urlAPI}usuario`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    return res.json()
}

export async function convidar({ UserPCPId, email, nome, permissao, enviarEmail }) {
    const res = await fetch(`${urlAPI}usuario/convidar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserPCPId, email, nome, permissao, enviarEmail })
    })
    if (res.status == 201)
        return res.json()
    else
        throw new Error((await res.json()).message)
}