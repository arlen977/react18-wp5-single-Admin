import { useLocation, useNavigate, useRoutes, useNavigationType } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Storage from "@/utils/storage";
const storage = new Storage();

// 路由守衛

// 查询的路径和完整地路由配置，并返回查询到的路由
function searchroutedetail(path, routes) {
    for (let item of routes) {
        if (item.path === path) return item;
        if (item.children) {
            const result = searchroutedetail(path, item.children);
            if (result) {
                return result;
            }
        }
    }
    return null;
}

// 全局守衛
function guard(location, navigate, routes, t) {
    const { pathname } = location;
    // if (pathname == "/") {
    //     return navigate("/home");
    // }

    //找到对应的路由信息，判断有没有权限控制
    const routedetail = searchroutedetail(pathname, routes);

    //没有找到路由，跳转404
    if (!routedetail) {
        // return navigate("/404");
        return false;
    }
    //如果需要权限验证
    if (routedetail.auth) {
        const token = storage.getS("Token");
        if (!token) {
            navigate("/login");
            return false;
        }
    }

    document.title = t(routedetail.meta.title);
    return true;
}

export const RouterGurad = routes => {

    const location = useLocation();
    const navigate = useNavigate();
    const type = useNavigationType();
    const { t } = useTranslation();
    useEffect(() => {
        guard(location, navigate, routes.routes, t);
    }, [location, navigate, routes.routes]);

    const Route = useRoutes(routes.routes);
    return Route;
    // return (
    //     <TransitionGroup
    //         className={"router-wrapper"}
    //     >
    //         <CSSTransition
    //             classNames={{
    //                 enter: "animate__animated",
    //                 enterActive: "nimate__animated animate__fadeInRight",
    //                 exit: "animate__animated",
    //                 exitActive: "nimate__animated animate__fadeOutDown",
    //             }}
    //             key={location.pathname}
    //             timeout={1000}
    //             unmountOnExit={true}
    //         >
    //             {Route}
    //         </CSSTransition>
    //     </TransitionGroup>
    // );
};
