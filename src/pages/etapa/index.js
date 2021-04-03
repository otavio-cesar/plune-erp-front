import { Button, Container, TextField } from "@material-ui/core";
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
import { patchRefugarOrdem } from "../../services/ordem";

export default function EtapaPage(props) {
    const screenWidth = viewPort()
    const [enableRefugo, setEnableRefugo] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [enableStart, setEnableStart] = useState(false);
    const [enablePause, setEnablePause] = useState(false);
    const [enableFinish, setEnableFinish] = useState(false);
    const [enableInspect, setEnableInspect] = useState(false);
    const [selectedRow, setSelectedRow] = useState();
    const [showDialog, setShowDialog] = useState(<></>);
    const [reason, setReason] = useState('')
    const history = useHistory();

    const idOrder = props.location.state.idOrder
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
    }

    async function handleStartStage() {
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
                                    return
                                }
                            })
                            setRows([...rows])
                            enableActions()
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
                                    return
                                }
                            })
                            setRows([...rows])
                            enableActions()
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
                askQntProduction
                action={async (quantidade) => {
                    setLoading(true)
                    console.log(quantidade)
                    await patchStageSituation(idOrder, selectedRow.metadata.ProcessoId.value, selectedRow.metadata.ProdutoId.value, stageSituation.finished.id, null, quantidade)
                        .then((data) => {
                            console.log(data)
                            rows.forEach((el, i) => {
                                if (el.id == selectedRow.metadata.ProcessoId.value) {
                                    rows[i] = { ...el, situacao: data.Field.Status.resolved, metadata: { ...data.Field } }
                                    return
                                }
                            })
                            setRows([...rows])
                            enableActions()
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
                    await patchStageSituation(idOrder, selectedRow.metadata.ProcessoId.value, selectedRow.metadata.ProdutoId.value, stageSituation.finished.id, null, quantidade, true)
                        .then((data) => {
                            console.log(data)
                            rows.forEach((el, i) => {
                                if (el.id == selectedRow.metadata.ProcessoId.value) {
                                    rows[i] = { ...el, situacao: data.Field.Status.resolved, metadata: { ...data.Field } }
                                    return
                                }
                            })
                            setRows([...rows])
                            enableActions()
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
                message={`Deseja gerar apontar o refugo para o produto: ${selectedRow.metadata.ProdutoId.resolved}?`}
                labelQntProduction={`Quantidade de produtos refugados`}
                askQntProduction
                action={async (quantidade) => {
                    setLoading(true)
                    console.log(quantidade)
                    await patchRefugarOrdem(idOrder, selectedRow.metadata.ProdutoId.value, quantidade)
                        .then((data) => {
                            console.log(data)
                            // rows.forEach((el, i) => {
                            //     if (el.id == selectedRow.metadata.Id.value) {
                            //         rows[i] = { ...el, situacao: data.Field.Status.resolved, metadata: { ...data.Field } }
                            //         return
                            //     }
                            // })
                            // setRows([...rows])
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

    async function handleSelectRow(el) {
        console.log(el)
        setSelectedRow(el.row)
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
        debugger
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
            setEnableInspect(
                selectedRow.id == stageSituation.inspect.id && situacao == stageSituation.started.id
            )

        } else {
            setEnableStart(false)
            setEnableFinish(false)
            setEnablePause(false)
            setEnableInspect(false)
        }

        setEnableRefugo(
            statusOrder.value == stageSituation.finished.id
        )
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
                <div className="lineAction">
                    <div className="labelOP">
                        <div>
                            <Link to="/" className="back-link" >
                                <FiArrowLeft size={16} color="#3f51b5" />
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
                        Iniciar Etapa
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handlePauseStage()} disabled={!enablePause}>
                        Interromper
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleFinishStage()} disabled={!enableFinish}>
                        Finalizar
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleInspecionarStage()} disabled={!enableInspect}>
                        Inspecionar
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleRefugoOrder()} disabled={!enableRefugo}>
                        Apontar Refugo
                    </Button>

                </div>
                <div className="containerTable">
                    <DataGrid rows={rows} columns={columns} pageSize={10} onCellClick={(el) => handleSelectRow(el)} />
                </div>
            </div>
        </>
    );
}