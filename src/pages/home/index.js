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

export default function HomePage(props) {
    const screenWidth = viewPort()
    const [username, setUsername] = useState('');
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

    async function handleSelectRow(el) {
        console.log(el)
        let row = el.row
        const situacao = row.metadata.Status.value
        if (situacao != stageSituation.waitingLiberation.id && situacao != stageSituation.cancelled.id)
            history.push('/etapa', { idOrder: row.id, situacao: row.metadata.Status })
        else
            showMeuAlert('Não existe ações para essa etapa', 'error')
    }

    async function enableActions() {
        if (selectedRow) {
            const situacao = selectedRow.metadata.Status.value
            setEnableEtapas(
                situacao != stageSituation.waitingLiberation.id && situacao != stageSituation.cancelled.id
            )
        } else {
            setEnableEtapas(false)
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
                <div className="containerTable">
                    <DataGrid rows={rows} columns={columns} pageSize={10} onRowClick={(el) => handleSelectRow(el)} />
                </div>
            </div>
        </>
    );
}