import { urlAPI } from "../util/constants"

export async function login(username, password) {
    const res = await fetch(`${urlAPI}usuario/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Token-PCP": localStorage.getItem("token-pcp")
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
            "Token-PCP": localStorage.getItem("token-pcp")
        },
    })
    if (res.status == 200)
        return res.json()
    else
        throw new Error((await res.json()).message)
}

export async function convidar({ UserPCPId, email, nome, permissao, senha }) {
    const res = await fetch(`${urlAPI}usuario/convidar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Token-PCP": localStorage.getItem("token-pcp")
        },
        body: JSON.stringify({ UserPCPId, email, nome, permissao, senha })
    })
    if (res.status == 201)
        return res.json()
    else
        throw new Error((await res.json()).message)
}

export async function alteraToken({ token }) {
    const res = await fetch(`${urlAPI}usuario/alteraToken`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Token-PCP": localStorage.getItem("token-pcp")
        },
        body: JSON.stringify({ token })
    })
    if (res.status == 201)
        return res.json()
    else
        throw new Error((await res.json()).message)
}

export async function getToken() {
    const res = await fetch(`${urlAPI}usuario/getToken`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Token-PCP": localStorage.getItem("token-pcp")
        },
    })
    if (res.status == 200)
        return res.json()
    else
        throw new Error((await res.json()).message)
}