import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function DefaultRoute(props) {
    const { component: Component, roles = [], needUserLogged, ...rest } = props;

    function canPermit() {
        if (!needUserLogged) {
            return true;
        }
        if (needUserLogged && localStorage.getItem("user")) {
            return true
        }
        if (roles.length > 0 && roles.includes(localStorage.getItem("user")?.permissao)) {
            return true;
        }
        return false;
    }

    const permit = canPermit();

    return (
        <Route
            {...rest}
            render={(props, context) =>
                permit ? (
                    <Component {...props} {...context} {...rest} />
                ) : (
                        <Redirect to={needUserLogged ? '/login' : '/'} />
                    )
            }
        />
    );
}