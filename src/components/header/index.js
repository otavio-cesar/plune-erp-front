import React from 'react';
import './styles.css';
import logo from '../../assets/logo1.jpg'
import Link from '@material-ui/core/Link';
import { Typography } from '@material-ui/core';
import { FiLogOut } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

function Header() {

    const history = useHistory();

    async function logout() {
        localStorage.removeItem("user");
        history.push('/login')
    }

    return (
        <div className="header">
            <img className="logo-img" src={logo} />
            <Link href="/admin" className="link" color="inherit">
                <Typography color="textPrimary">Início</Typography>
            </Link>
            <Link href="/admin/pcp-users" className="link" color="inherit">
                <Typography color="textPrimary">Usuários PCP</Typography>
            </Link>
            <Link href="/" className="link" color="inherit">
                <Typography color="textPrimary">Operador</Typography>
            </Link>
            <Link href="/admin/token-plune" className="link" >
                <Typography color="textPrimary">Token Plune</Typography>
            </Link>
            <Link onClick={() => logout()} className="link" >
                <FiLogOut size={22} color="#3f51b5" />
            </Link>
        </div>
    );
}

export default Header;