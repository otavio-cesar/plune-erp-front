import { Button, TextField } from "@material-ui/core";
import './styles.css';
import { useEffect, useState } from "react";
import { alteraToken, getToken } from "../../../services/usuario";
import { MeuAlerta } from "../../../components/meuAlerta";
import Loading from "../../../components/loading";
import Header from "../../../components/header";

export default function TokenPlunePage(props) {
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(false);
    const [showDialog, setShowDialog] = useState(<></>);

    async function handleChangeToken(e) {
        e.preventDefault()
        const data = { token }
        console.log(data)
        setLoading(true)
        alteraToken(data).then(() => {
            showMeuAlert('Registro atualizado')
            setLoading(false)
        }).catch(e => {
            showMeuAlert(e.message, 'error')
            setLoading(false)
        })
    }

    useEffect(() => {
        _getToken()
    }, [])

    async function _getToken() {
        let data
        setLoading(true)
        data = await getToken();
        setLoading(false)
        console.log(data)
        setToken(data ?? '')
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
                <span className="ah1">Token de acesso à API do Plune ERP</span>
                <form className="containerCadastro" autoComplete="off" onSubmit={handleChangeToken} >
                    <TextField className="field" id="standard-basic" required label="Token" value={token} onChange={e => { setToken(e.target.value) }} /><br></br>
                    <Button className="button" variant="outlined" color="primary" type="submit">
                        Salvar
                    </Button>
                </form>
            </div>
        </>
    );
}