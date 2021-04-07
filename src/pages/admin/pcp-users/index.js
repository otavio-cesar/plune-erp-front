import { Button, Checkbox, FormControlLabel, Modal, TextField, Typography } from "@material-ui/core";
import './styles.css';
import { useEffect, useState } from "react";
import { convidar, getPCPUsers } from "../../../services/usuario";
import { MeuAlerta } from "../../../components/meuAlerta";
import { DataGrid } from '@material-ui/data-grid';
import { viewPort } from "../../../util/responsive";
import Loading from "../../../components/loading";
import { makeStyles } from '@material-ui/core/styles';
import EnumPermissions from "../../../util/EnumPermissions";
import Header from "../../../components/header";
import { MeuDialog } from "../../../components/dialog";


export default function PCPUserPage(props) {
    const screenWidth = viewPort()
    const [selectedRow, setSelectedRow] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editar, setEditar] = useState(false);
    const [codigo, setCodigo] = useState('');
    const [email, setEmail] = useState('');
    const [usuario, setUsuario] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showDialog, setShowDialog] = useState(<></>);

    const columns = [
        { field: 'id', headerName: 'Código', width: screenWidth * (0.15), type: 'number', },
        { field: 'nome', headerName: 'Nome', width: screenWidth * (0.3) },
        { field: 'email', headerName: 'Email', width: screenWidth * (0.3) },
        { field: 'permissao', headerName: 'Administrador?', width: screenWidth * (0.2) },
    ];

    useEffect(() => {
        showUsers()
    }, [])

    async function showUsers() {
        let data
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
                    permissao: o.permissao == EnumPermissions.Admin ? 'Sim' : 'Não',
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
        setCodigo(row.id)
        setUsuario(row.nome)
        setEmail(row.email)
        setIsAdmin(row.metadata.permissao == EnumPermissions.Admin ? true : false)
        setEditar(true)
        setSelectedRow(row)
    }

    async function handleInvite(e) {
        e.preventDefault()
        let enviarEmail = true;
        if (email == selectedRow.email)
            enviarEmail = false;
        const data = {
            UserPCPId: codigo,
            nome: usuario,
            email,
            permissao: isAdmin ? EnumPermissions.Admin : EnumPermissions.Basic,
            enviarEmail
        }
        const doInvite = () => {
            console.log(data)
            setLoading(true)
            convidar(data).then(() => {
                if (data.enviarEmail)
                    showMeuAlert('Convite enviado')
                else
                    showMeuAlert('Registro atualizado')
                setEditar(false)
                showUsers()
                setLoading(false)
            }).catch(e => {
                showMeuAlert(e.message, 'error')
                setLoading(false)
            })
        }
        if (enviarEmail) {
            setShowDialog(
                <MeuDialog
                    open={true}
                    setOpen={setShowDialog}
                    title={'Envio do convite'}
                    confirm="Ok"
                    notConfirm="Cancelar"
                    message={`Será enviado um email para o operador com o link de acesso.`}
                    action={async () => doInvite()}>
                </MeuDialog>
            )
        } else {
            doInvite()
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

                {!editar && <>
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
                </>}

                {editar && <>
                    <span className="ah1">Editar Usuário PCP</span>
                    <form className="containerCadastro" autoComplete="off" onSubmit={handleInvite} >
                        <TextField className="field" id="standard-basic" label="Código" value={codigo} disabled /><br></br>
                        <TextField className="field" id="standard-basic" label="Nome" value={usuario} disabled /><br></br>
                        <TextField className="field" id="standard-basic" label="Email" required value={email} onChange={e => { setEmail(e.target.value) }} type="email" /><br></br>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    label="Administrador"
                                    color="default"
                                />
                            }
                            label="Administrador"
                        /><br></br>
                        <Button className="button" variant="outlined" color="primary" type="submit">
                            Salvar
                        </Button>
                        <Button className="button" variant="outlined" color="primary" onClick={() => setEditar(false)}>
                            Cancelar
                        </Button>
                    </form>
                </>}
            </div>
        </>
    );
}