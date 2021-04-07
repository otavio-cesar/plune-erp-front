import { Button, Modal, Typography } from "@material-ui/core";
import './styles.css';
import { useEffect, useState } from "react";
import { getOrdemById, getOrdens, getOrdensByLineProduction } from "../../../services/ordem";
import { MeuAlerta } from "../../../components/meuAlerta";
import { useHistory } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { DataGrid } from '@material-ui/data-grid';
import { viewPort } from "../../../util/responsive";
import Loading from "../../../components/loading";
import EnumPermissions from "../../../util/EnumPermissions";
import { stageSituation } from "../../../util/constants";
import QrReader from 'react-qr-scanner';
import { makeStyles } from '@material-ui/core/styles';
import logo from '../../../assets/logo1.jpg';
import { FiArrowLeft } from "react-icons/fi";
import Header from "../../../components/header";

const previewStyle = {
    width: 320,
}
function getModalStyle() {
    return {
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
    };
}
const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 320,
    },
}));

export default function HomePage(props) {
    const screenWidth = viewPort()
    const [showAlert, setShowAlert] = useState(false);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(<></>);
    const history = useHistory();

    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    let searchingOP = false;

    const columns = [
        { field: 'id', headerName: 'OP', width: screenWidth * (0.15) },
        { field: 'servico', headerName: 'Produto', width: screenWidth * (0.6) },
        { field: 'situacao', headerName: 'Situação', width: screenWidth * (0.2) },
    ];

    useEffect(() => {
        showOrdens()
    }, [])

    async function showOrdens() {
        return
        let data
        const usuario = JSON.parse(localStorage.getItem('user'))
        if (usuario.permissao == EnumPermissions.Basic) {
            const LinhaProcessoProdutivoIds = JSON.parse(localStorage.getItem('user')).productionLine.map(p => p.value)
            setLoading(true)
            data = await getOrdensByLineProduction(LinhaProcessoProdutivoIds).catch(e => { showMeuAlert(e.message == 'Failed to fetch' ? 'Falha ao buscar dados' : e.message, 'error') });
        } else {
            setLoading(true)
            data = await getOrdens();
        }
        setLoading(false)

        if (data.data) {
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
        } else {
            if (data.includes("Erro ao inicializar Ultra::Session em Ultra::SOA#new: Login: Sessão expirou")) {
                showMeuAlert('Token de acesso ao Plune é inválido, contate o administrador', 'error')
            }
        }
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

    async function lerQRCODE(data) {
        console.log(data)
        if (data && !searchingOP) {
            let id = data.text.split('.')[3]
            console.log(id)
            let ordem
            searchingOP = true
            ordem = await getOrdemById(id).catch(e => console.log(e));
            searchingOP = false
            console.log(ordem)
            if (ordem) {
                let selectedOrdem = rows.find(o => o.id == id)
                history.push('/etapa', { idOrder: selectedOrdem.id, situacao: selectedOrdem.metadata.Status })
            } else {
                showMeuAlert(`A OP ${id} não foi encontrada no servidor`, 'error')
            }
            setOpen(false)
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
                <Header></Header>

                <span className="ah1">Ordens de Produção</span>

                <div className="containerTable">
                    Em construção, teremos aqui o relatório.
                    {/* <DataGrid
                        rows={rows} columns={columns} hideFooterSelectedRowCount hideFooterPagination
                        localeText={{
                            columnMenuLabel: 'Menu',
                            columnMenuShowColumns: 'Mostrar colunas',
                            columnMenuFilter: 'Filtrar',
                            columnMenuHideColumn: 'Esconder',
                            columnMenuUnsort: 'Remover ordem',
                            columnMenuSortAsc: 'Ordem ascendente',
                            columnMenuSortDesc: 'Ordem descendente',
                        }}
                        onRowClick={(el) => handleSelectRow(el)} /> */}
                </div>
            </div>
        </>
    );
}