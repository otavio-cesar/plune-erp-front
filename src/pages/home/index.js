import { Button, Container, TextField } from "@material-ui/core";
import './styles.css';
import { FaIndustry } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { getOrdens, getOrdensByLineProduction, patchRefugarOrdem } from "../../services/ordem";
import { MeuAlerta } from "../../components/meuAlerta";
import { useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import { viewPort } from "../../util/responsive";
import Loading from "../../components/loading";
import EnumPermissions from "../../util/EnumPermissions";
import { stageSituation } from "../../util/constants";
import { MeuDialog } from "../../components/dialog";
import { patchStageSituation } from "../../services/stage";

export default function HomePage(props) {
    const screenWidth = viewPort()
    const [username, setUsername] = useState('');
    const [enableRefugo, setEnableRefugo] = useState(false);
    const [enableEtapas, setEnableEtapas] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState();
    const [showDialog, setShowDialog] = useState(<></>);
    const [reason, setReason] = useState('')
    const history = useHistory();

    const columns = [
        { field: 'id', headerName: 'OP', width: screenWidth * (0.15) },
        { field: 'servico', headerName: 'Produto', width: screenWidth * (0.6) },
        { field: 'situacao', headerName: 'Situação', width: screenWidth * (0.2) },
        // {
        //     field: 'age',
        //     headerName: 'Age',
        //     type: 'number',
        //     width: 90,
        // },
        // {
        //     field: 'fullName',
        //     headerName: 'Full name',
        //     description: 'This column has a value getter and is not sortable.',
        //     sortable: false,
        //     width: 160,
        //     valueGetter: (params) =>
        //         `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
        // },
    ];

    useEffect(() => {
        showOrdens()
    }, [])

    async function showOrdens() {
        let data
        const usuario = JSON.parse(localStorage.getItem('user'))
        if (usuario.permissao == EnumPermissions.Basic) {
            const LinhaProcessoProdutivoIds = JSON.parse(localStorage.getItem('user')).productionLine.map(p => p.value)
            setLoading(true)
            data = await getOrdensByLineProduction(LinhaProcessoProdutivoIds);
        } else {
            setLoading(true)
            data = await getOrdens();
        }
        setLoading(false)

        console.log(data.data.row)
        const _rows = data.data.row.map(o => {
            return {
                id: o.Id.value,
                servico: o.ProdutoId.resolved,
                situacao: o.Status.resolved,
                metadata: { ...o }
            }
        })
        setRows(_rows)
    }

    async function handleRefugoOrder() {
        setShowDialog(
            <MeuDialog
                open={true}
                setOpen={setShowDialog}
                title={'Refugar ordem'}
                message={`Deseja gerar refugo para o produto: ${selectedRow.metadata.ProdutoId.resolved}?`}
                labelQntProduction={`Quantidade de produtos refugados`}
                askQntProduction
                action={async (quantidade) => {
                    setLoading(true)
                    console.log(quantidade)
                    await patchRefugarOrdem(selectedRow.metadata.Id.value, selectedRow.metadata.ProdutoId.value, quantidade)
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

    async function handleEtapas() {
        history.push('/etapa', { idOrder: selectedRow.id, situacao: selectedRow.metadata.Status })
    }

    async function handleSelectRow(el) {
        console.log(el)
        setSelectedRow(el.row)
    }

    useEffect(() => {
        enableActions()
    }, [selectedRow])

    async function enableActions() {
        if (selectedRow) {
            const situacao = selectedRow.metadata.Status.value
            setEnableEtapas(
                situacao != stageSituation.waitingLiberation.id && situacao != stageSituation.cancelled.id
            )
            setEnableRefugo(
                situacao == stageSituation.finished.id
            )
        } else {
            setEnableEtapas(false)
            setEnableRefugo(false)
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
                <div className="lineAction">
                    <Button variant="contained" color="primary" onClick={() => handleEtapas()} disabled={!enableEtapas}>
                        Etapas
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleRefugoOrder()} disabled={!enableRefugo}>
                        Gerar Refugo
                    </Button>
                </div>
                <div className="containerTable">
                    <DataGrid rows={rows} columns={columns} pageSize={10} onCellClick={(el) => handleSelectRow(el)} />
                </div>
            </div>
        </>
    );
}