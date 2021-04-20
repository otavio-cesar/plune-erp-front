import { Button } from "@material-ui/core";
import './styles.css';
import { FiArrowLeft } from 'react-icons/fi';
import { useEffect, useState } from "react";
import { getStagesByIdOrder, patchStageSituation } from "../../services/stage";
import { MeuAlerta } from "../../components/meuAlerta";
import { Link, useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import { viewPort } from "../../util/responsive";
import Loading from "../../components/loading";
import { stageSituation } from "../../util/constants";
import React from 'react';
import { MeuDialog } from "../../components/dialog";

export default function EtapaPage(props) {
    const screenWidth = viewPort()
    const [enableApontamento, setEnableApontamento] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [enableStart, setEnableStart] = useState(false);
    const [enablePause, setEnablePause] = useState(false);
    const [enableFinish, setEnableFinish] = useState(false);
    const [selectedRow, setSelectedRow] = useState();
    const [showDialog, setShowDialog] = useState(<></>);
    const history = useHistory();

    const idOrder = props.location.state.idOrder
    const idEtapa = props.location.state.idEtapa
    const statusOrder = props.location.state.situacao

    const columns = [
        { field: 'id', hide: true },
        { field: 'ordem', headerName: 'Ordem', width: screenWidth * (0.175) },
        { field: 'processo', headerName: 'Processo', width: screenWidth * (0.5) },
        { field: 'situacao', headerName: 'Situação', width: screenWidth * (0.25) }
    ];

    useEffect(() => {
        console.log(idOrder)
        if (!idOrder)
            history.push('/')
        else {
            showStages(idOrder)
        }
    }, [])

    async function showStages(idOrder) {
        setLoading(true)
        const data = await getStagesByIdOrder(idOrder);
        setLoading(false)

        const _rows = data.data.row.map(o => {
            return {
                id: o.ProcessoId.value,
                ordem: o.OrdemProcessoId.value,
                processo: o.ProcessoId.resolved,
                situacao: o.Status.resolved,
                metadata: { ...o }
            }
        })
        setRows(_rows)
        if (idEtapa) {
            setSelectedRow(_rows.find(r => r.id == idEtapa))
        }
    }

    async function handleStartStage() {
        if (selectedRow.id == stageSituation.inspect.id) {
            handleInspecionarStage()
            return
        }
        setShowDialog(
            <MeuDialog
                open={true}
                setOpen={setShowDialog}
                title={'Iniciar etapa'}
                message={`Deseja iniciar o processo: ${selectedRow.metadata.ProcessoId.resolved}?`}
                action={async () => {
                    setLoading(true)
                    await patchStageSituation(idOrder, selectedRow.metadata.ProcessoId.value, selectedRow.metadata.ProdutoId.value, stageSituation.started.id)
                        .then((data) => {
                            console.log(data)
                            rows.forEach((el, i) => {
                                if (el.id == selectedRow.metadata.ProcessoId.value) {
                                    rows[i] = { ...el, situacao: data.Field.Status.resolved, metadata: { ...data.Field } }
                                    setSelectedRow(rows[i])
                                    return
                                }
                            })
                            setRows([...rows])
                            setLoading(false)
                            showMeuAlert('Etapa iniciada', 'success')
                        })
                        .catch(e => {
                            setLoading(false)
                            showMeuAlert(e.message, 'error')
                        })
                }}>
            </MeuDialog>
        )
    }

    async function handlePauseStage() {
        setShowDialog(
            <MeuDialog
                open={true}
                setOpen={setShowDialog}
                title={'Pausar etapa'}
                message={`Deseja interromper o processo: ${selectedRow.metadata.ProcessoId.resolved}?`}
                askReason
                action={async (motivo) => {
                    console.log(motivo)
                    setLoading(true)
                    await patchStageSituation(idOrder, selectedRow.metadata.ProcessoId.value, selectedRow.metadata.ProdutoId.value, stageSituation.paused.id, motivo)
                        .then((data) => {
                            console.log(data)
                            rows.forEach((el, i) => {
                                if (el.id == selectedRow.metadata.ProcessoId.value) {
                                    rows[i] = { ...el, situacao: data.Field.Status.resolved, metadata: { ...data.Field } }
                                    setSelectedRow(rows[i])
                                    return
                                }
                            })
                            setRows([...rows])
                            setLoading(false)
                            showMeuAlert('Etapa pausada', 'success')
                        })
                        .catch(e => {
                            setLoading(false)
                            showMeuAlert(e.message, 'error')
                        })
                }}>
            </MeuDialog>
        )
    }

    async function handleFinishStage() {
        setShowDialog(
            <MeuDialog
                open={true}
                setOpen={setShowDialog}
                title={'Finalizar etapa'}
                message={`Deseja finalizar o processo: ${selectedRow.metadata.ProcessoId.resolved}?`}
                action={async (quantidade) => {
                    setLoading(true)
                    console.log(quantidade)
                    await patchStageSituation(idOrder, selectedRow.metadata.ProcessoId.value, selectedRow.metadata.ProdutoId.value, stageSituation.finished.id, null, null, null, null)
                        .then((data) => {
                            console.log(data)
                            rows.forEach((el, i) => {
                                if (el.id == selectedRow.metadata.ProcessoId.value) {
                                    rows[i] = { ...el, situacao: data.Field.Status.resolved, metadata: { ...data.Field } }
                                    setSelectedRow(rows[i])
                                    return
                                }
                            })
                            setRows([...rows])
                            setLoading(false)
                            showMeuAlert('Etapa finalizada', 'success')
                        })
                        .catch(e => {
                            setLoading(false)
                            showMeuAlert(e.message, 'error')
                        })
                }}>
            </MeuDialog>
        )
    }

    async function handleInspecionarStage() {
        setShowDialog(
            <MeuDialog
                open={true}
                setOpen={setShowDialog}
                title={'Inspecionar qualidade'}
                message={`Deseja inspecionar a qualidade da ordem: ${selectedRow.metadata.OrdemId.resolved}?`}
                labelQntProduction={'Quantidade de produtos com qualidade aprovada'}
                askQntProduction
                action={async (quantidade) => {
                    setLoading(true)
                    console.log(quantidade)
                    await patchStageSituation(idOrder, selectedRow.metadata.ProcessoId.value, selectedRow.metadata.ProdutoId.value, stageSituation.finished.id, null, null, quantidade, null)
                        .then((data) => {
                            console.log(data)
                            rows.forEach((el, i) => {
                                if (el.id == selectedRow.metadata.ProcessoId.value) {
                                    rows[i] = { ...el, situacao: data.Field.Status.resolved, metadata: { ...data.Field } }
                                    setSelectedRow(rows[i])
                                    return
                                }
                            })
                            setRows([...rows])
                            setLoading(false)
                            showMeuAlert('Ordem inspecionada', 'success')
                        })
                        .catch(e => {
                            setLoading(false)
                            showMeuAlert(e.message, 'error')
                        })
                }}>
            </MeuDialog>
        )
    }

    async function handleRefugoOrder() {
        setShowDialog(
            <MeuDialog
                open={true}
                setOpen={setShowDialog}
                title={'Apontar ordem'}
                message={`Deseja apontar o refugo para o produto: ${selectedRow.metadata.ProdutoId.resolved}?`}
                labelQntProduction={`Quantidade de produtos refugados`}
                askQntProduction
                askObservacao
                labelObservacao={'Observação'}
                action={async (quantidade, observacao) => {
                    setLoading(true)
                    console.log(quantidade)
                    await patchStageSituation(idOrder, selectedRow.metadata.ProcessoId.value, selectedRow.metadata.ProdutoId.value, stageSituation.finished.id, null, null, null, quantidade, observacao)
                        .then(() => {
                            setLoading(false)
                            showMeuAlert('Refugo realizado', 'success')
                        })
                        .catch(e => {
                            setLoading(false)
                            showMeuAlert(e.message, 'error')
                        })
                }}>
            </MeuDialog>
        )
    }

    async function handleProducaoOrder() {
        setShowDialog(
            <MeuDialog
                open={true}
                setOpen={setShowDialog}
                title={'Apontar ordem'}
                message={`Deseja apontar o produção para o produto: ${selectedRow.metadata.ProdutoId.resolved}?`}
                labelQntProduction={`Quantidade de produtos produzidos`}
                askQntProduction
                action={async (quantidade) => {
                    setLoading(true)
                    console.log(quantidade)
                    await patchStageSituation(idOrder, selectedRow.metadata.ProcessoId.value, selectedRow.metadata.ProdutoId.value, stageSituation.finished.id, null, quantidade, null, null)
                        .then(() => {
                            setLoading(false)
                            showMeuAlert('Produção realizada', 'success')
                        })
                        .catch(e => {
                            setLoading(false)
                            showMeuAlert(e.message, 'error')
                        })
                }}>
            </MeuDialog>
        )
    }

    async function handleInspecao() {
        setShowDialog(
            <MeuDialog
                open={true}
                setOpen={setShowDialog}
                title={'Apontar produto'}
                message={`Deseja apontar a inspeção para o produto: ${selectedRow.metadata.ProdutoId.resolved}?`}
                labelQntProduction={`Quantidade de produtos inspecionados`}
                askQntProduction
                askYesNo
                askObservacao
                action={async (quantidade, observacao, aprovado) => {
                    setLoading(true)
                    console.log(quantidade, observacao, aprovado)
                    await patchStageSituation(idOrder, selectedRow.metadata.ProcessoId.value, selectedRow.metadata.ProdutoId.value, null, null, null, quantidade, null, null, aprovado, observacao)
                        .then(() => {
                            setLoading(false)
                            showMeuAlert('Produção realizada', 'success')
                        })
                        .catch(e => {
                            setLoading(false)
                            showMeuAlert(e.message, 'error')
                        })
                }}>
            </MeuDialog>
        )
    }

    async function handleSelectRow(el) {
        console.log(el)
        setSelectedRow(el.data)
    }

    useEffect(() => {
        enableActions()
    }, [selectedRow])

    async function hasLineProductionPermission() {
        const LinhaProcessoProdutivoIds = JSON.parse(localStorage.getItem('user')).productionLine.map(p => p.value)
        const hasPermission = LinhaProcessoProdutivoIds.includes[selectedRow.metadata.LinhaProcessoProdutivoId]
        return hasPermission
    }

    async function enableActions() {
        if ((selectedRow && statusOrder.value != stageSituation.finished.id) && hasLineProductionPermission()) {
            const situacao = selectedRow.metadata.Status.value
            setEnableStart(
                (situacao == stageSituation.paused.id || situacao == stageSituation.freeToStart.id || selectedRow.id == stageSituation.inspect.id) && statusOrder.value == stageSituation.started.id
            )
            setEnablePause(
                situacao == stageSituation.started.id && selectedRow.id != stageSituation.inspect.id
            )
            setEnableFinish(
                situacao == stageSituation.started.id && selectedRow.id != stageSituation.inspect.id
            )
            setEnableApontamento(
                (situacao == stageSituation.started.id || situacao == stageSituation.paused.id) && selectedRow.id != stageSituation.inspect.id
            )
        } else {
            setEnableStart(false)
            setEnableFinish(false)
            setEnablePause(false)
            setEnableApontamento(false)
        }
    }

    function showMeuAlert(message, severity) {
        setShowAlert(
            <MeuAlerta
                open={true}
                setOpen={setShowAlert}
                severity={severity}
                message={message}>
            </MeuAlerta>
        )
    }

    return (
        <>
            {showAlert}
            {loading && <Loading ></Loading>}
            {showDialog}

            <div className="container" >
                <div className="lineActionEtapa">
                    <div className="labelOP">
                        <div>
                            <Link to="/" className="back-link" >
                                <FiArrowLeft size={16} color="#198179" />
                            </Link>
                        </div>
                    </div>
                    <div className="labelOP">
                        OP:
                        <div>
                            {idOrder}
                        </div>
                    </div>
                    <Button variant="contained" color="primary" onClick={() => handleStartStage()} disabled={!enableStart}>
                        Iniciar
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handlePauseStage()} disabled={!enablePause}>
                        Pausar
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleFinishStage()} disabled={!enableFinish}>
                        Finalizar
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleProducaoOrder()} disabled={!enableApontamento}>
                        Apontar Produção
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleRefugoOrder()} disabled={!enableApontamento}>
                        Apontar Refugo
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleInspecao()} disabled={!enableApontamento}>
                        Apontar Inspeção
                    </Button>

                </div>
                <div className="containerTableEtapa">
                    <DataGrid
                        localeText={
                            {
                                noRowsLabel: "Nenhum registro",
                                footerRowSelected: () => selectedRow ? "Etapa selecionada" : ""
                            }
                        }
                        selectionModel={idEtapa ? [idEtapa] : []} rows={rows} columns={columns} hideFooterPagination onRowSelected={(el) => handleSelectRow(el)} />
                </div>
            </div>
        </>
    );
}