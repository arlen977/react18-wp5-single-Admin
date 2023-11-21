import React from "react";
import Login from "@/pages/login";
import PagesLayout from "@/pages/frame/layout";
import NotFound from "@/pages/404";
// 懒加载
export const lazyLoad = path => {
    const Comp = React.lazy(() =>
        import(`@/pages/${path}`).catch(err => {
            return { default: NotFound };
        })
    );

    return (
        <React.Suspense fallback={<>加载中...</>}>
            <Comp />
        </React.Suspense>
    );
};

/**
 *主路由
 *
 * @return {*}
 */
export const routes = [
    { path: "/login", element: <Login></Login>, meta: { title: "Home" } },
    {
        path: "/",
        element: <PagesLayout></PagesLayout>,
        meta: { title: "Home" },
    },

    // 重定向
    // { path: "home", redirectTo: "/" },
    // 404找不到
    // { path: "*", element: <div>jj</div> },
];

// const MyRoutes = () => {
//     const ele = useRoutes(routes);
//     return ele;
// };

// export default MyRoutes;
