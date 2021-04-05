import { Button, Modal, Typography } from "@material-ui/core";
import './styles.css';
import { useEffect, useState } from "react";
import { getOrdemById } from "../../../services/ordem";
import { getPCPUsers } from "../../../services/usuario";
import { MeuAlerta } from "../../../components/meuAlerta";
import { useHistory } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { DataGrid } from '@material-ui/data-grid';
import { viewPort } from "../../../util/responsive";
import Loading from "../../../components/loading";
import { stageSituation } from "../../../util/constants";
import { makeStyles } from '@material-ui/core/styles';
import logo from '../../../assets/logo1.jpg';

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

export default function PCPUserPage(props) {
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
        { field: 'nome', headerName: 'Nome', width: screenWidth * (0.4) },
        { field: 'email', headerName: 'Email', width: screenWidth * (0.4) },
    ];

    useEffect(() => {
        showUsers()
    }, [])

    async function showUsers() {
        let data
        const usuario = JSON.parse(localStorage.getItem('user'))
        setLoading(true)
        data = await getPCPUsers();
        setLoading(false)

        if (data) {
            console.log(data)
            const _rows = data.map(o => {
                return {
                    id: o.Id.value,
                    nome: o.Nome.value,
                    email: o.email,
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
                <div className="header">
                    <img className="logo-img" src={logo} />
                    <Link to="/admin" className="link" color="inherit">
                        <Typography color="textPrimary">Usuários PCP</Typography>
                    </Link>
                    <Link to="/admin" className="link" >
                        <Typography color="textPrimary">Token Plune</Typography>
                    </Link>
                </div>

                <span className="ah1">Usuários PCP</span>

                <div className="containerTable">
                    <DataGrid
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
                        onRowClick={(el) => handleSelectRow(el)} />
                </div>
            </div>
        </>
    );
}