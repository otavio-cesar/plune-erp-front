import React, { Suspense, lazy, Component } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import DefaultRoute from "../components/defaultRoute/defaultRoute";
// import EnumPermissions from "../util/EnumPermissions";
import Loading from "../components/loading";

function Routes() {
    return (
        <>
            <Router>
                <Suspense fallback={<Loading invisible />}>
                    <Switch>
                        <DefaultRoute
                            needUserLogged
                            exact
                            path="/"
                            component={lazy(() => import("../pages/home/index"))}
                        />
                        <DefaultRoute
                            needUserLogged
                            path="/etapa"
                            component={lazy(() => import("../pages/etapa/index"))}
                        />
                        <DefaultRoute
                            exact
                            path="/login"
                            component={lazy(() => import("../pages/login/index"))}
                        />
                        <DefaultRoute
                            exact
                            path="/admin"
                            component={lazy(() => import("../pages/admin/home/index"))}
                        />
                        <DefaultRoute
                            exact
                            path="/admin/pcp-users"
                            component={lazy(() => import("../pages/admin/pcp-users"))}
                        />
                        <DefaultRoute
                            exact
                            path="/admin/token-plune"
                            component={lazy(() => import("../pages/admin/token-plune"))}
                        />
                    </Switch>
                </Suspense>
            </Router>
        </>
    );
}

export { Routes };
