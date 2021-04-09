import { Button, Modal } from "@material-ui/core";
import './styles.css';
import { useEffect, useState } from "react";
import { getOrdemById, getOrdens, getOrdensByLineProduction } from "../../services/ordem";
import { MeuAlerta } from "../../components/meuAlerta";
import { Link, useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import { viewPort } from "../../util/responsive";
import Loading from "../../components/loading";
import EnumPermissions from "../../util/EnumPermissions";
import { stageSituation } from "../../util/constants";
import QrReader from 'react-web-qr-reader';
import { makeStyles } from '@material-ui/core/styles';
import { FiLogOut, FiSettings } from "react-icons/fi";
import { MeuDialog } from "../../components/dialog";
import React from "react";

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
    const [isLoggedUserAdmin, setIsLoggedUserAdmin] = useState(false);
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

    // async function askCameraPermission() {
    //     try {
    //         stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //         if (stream) {
    //             stream.getTracks().forEach(track => {
    //                 track.stop();
    //             });
    //         }
    //     } catch (e) {
    //         console.log(e)
    //         showMeuAlert('Câmera: ' + e, 'error')
    //     }
    // }

    useEffect(() => {
        // askCameraPermission()
        const usuario = JSON.parse(localStorage.getItem('user'))
        if (usuario.permissao == EnumPermissions.Basic) {
            setIsLoggedUserAdmin(true)
        }
        showOrdens()
    }, [])

    async function showOrdens() {
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
            let id = data.data.split('.')[3]
            console.log(id)
            let ordem
            searchingOP = true
            ordem = await getOrdemById(id).catch(e => console.log(e));
            searchingOP = false
            console.log(ordem)
            if (ordem) {
                let selectedOrdem = rows.find(o => o.id == id)
                if (selectedOrdem) {
                    history.push('/etapa', { idOrder: selectedOrdem.id, situacao: selectedOrdem.metadata.Status })
                } else {
                    showMeuAlert(`A OP ${id} não está acessível`, 'error')
                }
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

    async function logout() {
        setShowDialog(
            <MeuDialog
                open={true}
                setOpen={setShowDialog}
                title={'Sair do sistema'}
                confirm="Sim"
                notConfirm="Cancelar"
                message={`Deseja sair do sistema?`}
                action={async () => {
                    localStorage.removeItem("user");
                    history.push('/login')
                }}>
            </MeuDialog>
        )
    }

    return (
        <>
            {showAlert}
            {loading && <Loading ></Loading>}
            {showDialog}

            <Modal
                open={open}
                onClose={() => { }}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper} >
                    <QrReader
                        delay={100}
                        style={previewStyle}
                        onError={(e) => { showMeuAlert('Câmera: ' + e, 'error') }}
                        facingmode='environment'
                        onScan={(data) => lerQRCODE(data)}
                    />
                    <Button variant="contained" className="qrbuttonModal" color="primary" onClick={() => { setOpen(false) }}>
                        Cancelar
                    </Button>
                </div>
            </Modal>

            <div className="container" >
                <div className="lineAction">
                    <div className="labelOP">
                        <span className="logo-title">Ordens de Produção</span>
                    </div>
                    <div className="doRow">
                        <Button variant="contained" className="qrbutton" color="primary" onClick={() => setOpen(true)}>
                            Ler QRCODE
                        </Button>
                        {isLoggedUserAdmin &&
                            <div className="labelOP">
                                <Link to="/admin" className="engine-link" >
                                    <FiSettings size={22} color="#3f51b5" />
                                </Link>
                            </div>
                        }
                        <div className="labelOP">
                            <Link onClick={() => logout()} className="engine-link" >
                                <FiLogOut size={22} color="#3f51b5" />
                            </Link>
                        </div>

                    </div>
                </div>
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