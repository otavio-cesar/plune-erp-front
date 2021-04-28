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

export async function convidar({ UserPCPId, email, nome, permissao, enviarEmail }) {
    const res = await fetch(`${urlAPI}usuario/convidar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Token-PCP": localStorage.getItem("token-pcp")
        },
        body: JSON.stringify({ UserPCPId, email, nome, permissao, enviarEmail })
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
    const res = await fetch(`https://api.linkedin.com/v2/emailAddress?oauth2_access_token=AQUynSRPE3-uuab1VkrxcLNhsn3ouiZ4G0w522ysQEhmw6HIkOYqmG6zOJ5iGgRX9RuOYcDINg3bUlrU4_mQ6NkSzYZ2QEqm0d8GN9qhNAN4kejKGga58LMATJbvtj_4bbpD-PY3jUWgr2YgrqrXJvD8hI-xKUsQJmKNrMPwV4e1YC4en1g_7eZCSKRID8ZsWkkTVD4vsw3SaGJMAf_-c920AxdtvPu1sNstFKZiqY3h2f8xK7A8tilo97YaH509nPl_eSSyIwRXXGXVSTPRGmG_EGnNO3XFIxNOA7iG5YHQLrSaVCuwGcJ8KWQNLEApIcskQTYqSx4tw61WvCW3w_xUHFpEyg&q=members&projection=(elements*(handle~))`, {
        method: "GET",

    })
    if (res.status == 200)
        return res.json()
    else
        throw new Error((await res.json()).message)
}