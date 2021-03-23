import { urlAPI } from "../util/constants"

export async function getStagesByIdOrder(id) {
    const res = await fetch(`${urlAPI}stage/order/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    return res.json()
}

export async function patchStageSituation(OrdemId, ProcessoId, ProdutoId, Status, MotivoParadaId = null, QuantidadeProduzida = null, IsInspecao = false) {
    const res = await fetch(`${urlAPI}stage/pathStageSituation`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ OrdemId: OrdemId, ProcessoId: ProcessoId, ProdutoId: ProdutoId, Status: Status, MotivoParadaId: MotivoParadaId, QuantidadeProduzida: QuantidadeProduzida, IsInspecao: IsInspecao })
    })
    if (res.status == 201)
        return res.json()
    else
        throw new Error((await res.json()).message)
}

export async function getPossibleStageSituation() {
    const res = await fetch(`${urlAPI}stage/getPossibleStageSituation`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if (res.status == 200)
        return res.json()
    else
        throw new Error((await res.json()).message)
}