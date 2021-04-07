import React from 'react';
import './styles.css';
import logo from '../../assets/logo1.jpg'
import Link from '@material-ui/core/Link';
import { Typography } from '@material-ui/core';

function Header() {
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
            <Link href="/admin" className="link" >
                <Typography color="textPrimary">Token Plune</Typography>
            </Link>
        </div>
    );
}

export default Header;