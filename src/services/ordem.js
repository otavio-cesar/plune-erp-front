import { urlAPI } from "../util/constants"
import EnumPermissions from "../util/EnumPermissions"

export async function getOrdens() {
    const res = await fetch(`${urlAPI}ordem`, {
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

export async function getOrdensByLineProduction(LinhaProcessoProdutivoIds) {
    const res = await fetch(`${urlAPI}ordem/LineProduction`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Token-PCP": localStorage.getItem("token-pcp"),
            LinhaProcessoProdutivoIds
        },
    })
    if (res.status == 200)
        return res.json()
    else
        throw new Error((await res.json()).message)
}

export async function getOrdemById(id) {
    const res = await fetch(`${urlAPI}ordem/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Token-PCP": localStorage.getItem("token-pcp")
        },
    })
    return res.json()
}

export async function patchRefugarOrdem(OrdemId, ProdutoId, QuantidadeRefugada) {
    const res = await fetch(`${urlAPI}ordem/patchRefugar`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Token-PCP": localStorage.getItem("token-pcp")
        },
        body: JSON.stringify({ OrdemId: OrdemId, ProdutoId: ProdutoId, QuantidadeRefugada: QuantidadeRefugada })
    })
    if (res.status == 201)
        return res.json()
    else
        throw new Error((await res.json()).message)
}