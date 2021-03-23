import { urlAPI } from "../util/constants"
import EnumPermissions from "../util/EnumPermissions"

export async function getOrdens() {
    const res = await fetch(`${urlAPI}ordem`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    return res.json()
}

export async function getOrdensByLineProduction(LinhaProcessoProdutivoIds) {
    const res = await fetch(`${urlAPI}ordem/LineProduction`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            LinhaProcessoProdutivoIds
        },
    })
    return res.json()
}

export async function patchRefugarOrdem(OrdemId, ProdutoId, QuantidadeRefugada) {
    const res = await fetch(`${urlAPI}ordem/patchRefugar`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ OrdemId: OrdemId, ProdutoId: ProdutoId, QuantidadeRefugada: QuantidadeRefugada })
    })
    if (res.status == 201)
        return res.json()
    else
        throw new Error((await res.json()).message)
}