const testMenu = [
    {
        "component": "SystemPub",
        "path": "/",
        "name": "后台管理",
        "type": 1,
        "operstatus": 1,
        "icon": "_admin/assets/img/icon/pc.png",
        "deep": 1,
        "childs": [
            {
                "component": "_admin/views/system/MenuManage",
                "path": "menumanage",
                "name": "菜单管理",
                "type": 2,
                "operstatus": 1,
                "icon": "",
                "deep": 2,
                "childs": null,
                "levelname": "后台管理,菜单管理",
                "id": 17,
                "virtualmenuflag": 2,
                "operAuth": {
                    "/mgauth/update": {
                        "component": "/mgauth/update",
                        "path": "update",
                        "name": "修改",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgauth/operadd": {
                        "component": "/mgauth/operadd",
                        "path": "oadd",
                        "name": "添加权限",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgauth/disable": {
                        "component": "/mgauth/disable",
                        "path": "disable",
                        "name": "禁用",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgauth/del": {
                        "component": "/mgauth/del",
                        "path": "del",
                        "name": "删除",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgauth/operlist": {
                        "component": "/mgauth/operlist",
                        "path": "osee",
                        "name": "操作权限-查看",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgauth/operdel": {
                        "component": "/mgauth/operdel",
                        "path": "odel",
                        "name": "权限删除",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgauth/add": {
                        "component": "/mgauth/add",
                        "path": "add",
                        "name": "新增",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgauth/index": {
                        "component": "/mgauth/index",
                        "path": "index",
                        "name": "重排序",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgauth/operupdate": {
                        "component": "/mgauth/operupdate",
                        "path": "oupdate",
                        "name": "权限修改",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgauth/operdisable": {
                        "component": "/mgauth/operdisable",
                        "path": "odisable",
                        "name": "权限禁用-启用",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    }
                }
            },
            {
                "component": "_admin/views/system/UserManage",
                "path": "usermanage",
                "name": "后台用户管理",
                "type": 2,
                "operstatus": 1,
                "icon": "",
                "deep": 2,
                "childs": null,
                "levelname": "后台管理,后台用户管理",
                "id": 39,
                "virtualmenuflag": 2,
                "operAuth": {
                    "/mguser/resetPwd": {
                        "component": "/mguser/resetPwd",
                        "path": "reset",
                        "name": "重置密码",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mguser/del": {
                        "component": "/mguser/del",
                        "path": "del",
                        "name": "删除",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    }
                }
            },
            {
                "component": "_admin/views/system/RoleManage",
                "path": "rolemanage",
                "name": "角色权限管理",
                "type": 2,
                "operstatus": 1,
                "icon": "",
                "deep": 2,
                "childs": null,
                "levelname": "后台管理,角色权限管理",
                "id": 18,
                "virtualmenuflag": 2,
                "operAuth": {
                    "/mgrole/grant": {
                        "component": "/mgrole/grant",
                        "path": "grant",
                        "name": "分配权限",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgrole/add": {
                        "component": "/mgrole/add",
                        "path": "add",
                        "name": "新增",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgrole/update": {
                        "component": "/mgrole/update",
                        "path": "update",
                        "name": "修改",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgrole/del": {
                        "component": "/mgrole/del",
                        "path": "del",
                        "name": "删除",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    }
                }
            },
            {
                "component": "_admin/views/system/ParamConfig",
                "path": "paramconfig",
                "name": "参数配置",
                "type": 2,
                "operstatus": 1,
                "icon": "",
                "deep": 2,
                "childs": null,
                "levelname": "后台管理,参数配置",
                "id": 20,
                "virtualmenuflag": 2,
                "operAuth": {
                    "/mgconf/update": {
                        "component": "/mgconf/update",
                        "path": "update",
                        "name": "修改",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    },
                    "/mgconf/add": {
                        "component": "/mgconf/add",
                        "path": "add",
                        "name": "新增",
                        "type": 3,
                        "operstatus": 1,
                        "icon": ""
                    }
                }
            },
            {
                "component": "_admin/views/system/userId",
                "path": "userId",
                "name": "默认添加客服",
                "type": 2,
                "operstatus": 1,
                "icon": "",
                "deep": 2,
                "childs": null,
                "levelname": "后台管理,默认添加客服",
                "id": 60472,
                "virtualmenuflag": 2,
                "operAuth": null
            }
        ],
        "levelname": "后台管理",
        "id": 3,
        "virtualmenuflag": 2,
        "operAuth": null
    },
    {
        "component": "SystemPub",
        "path": "/",
        "name": "IM业务管理",
        "type": 1,
        "operstatus": 1,
        "icon": "",
        "deep": 1,
        "childs": [
            {
                "component": "",
                "path": "",
                "name": "用户",
                "type": 1,
                "operstatus": 1,
                "icon": "",
                "deep": 2,
                "childs": [
                    {
                        "component": "_admin/views/im/UserList",
                        "path": "userlist",
                        "name": "用户管理",
                        "type": 2,
                        "operstatus": 1,
                        "icon": "",
                        "deep": 3,
                        "childs": null,
                        "levelname": "IM业务管理,用户,用户管理",
                        "id": 35,
                        "virtualmenuflag": 2,
                        "operAuth": {
                            "/tiouser/resetPwd": {
                                "component": "/tiouser/resetPwd",
                                "path": "reset",
                                "name": "重置密码",
                                "type": 3,
                                "operstatus": 1,
                                "icon": ""
                            },
                            "后台不拦截": {
                                "component": "后台不拦截",
                                "path": "watch",
                                "name": "监控视角",
                                "type": 3,
                                "operstatus": 1,
                                "icon": ""
                            },
                            "/tiouser/disable": {
                                "component": "/tiouser/disable",
                                "path": "disable",
                                "name": "禁用-启用",
                                "type": 3,
                                "operstatus": 1,
                                "icon": ""
                            }
                        }
                    }
                ],
                "levelname": "IM业务管理,用户",
                "id": 60461,
                "virtualmenuflag": 2,
                "operAuth": null
            },
            {
                "component": "",
                "path": "",
                "name": "消息管理",
                "type": 1,
                "operstatus": 1,
                "icon": "_admin/assets/img/icon/pc.png",
                "deep": 2,
                "childs": [
                    {
                        "component": "_admin/views/im/PrivateChat",
                        "path": "privatechat",
                        "name": "单聊记录",
                        "type": 2,
                        "operstatus": 1,
                        "icon": "",
                        "deep": 3,
                        "childs": null,
                        "levelname": "IM业务管理,消息管理,单聊记录",
                        "id": 8,
                        "virtualmenuflag": 2,
                        "operAuth": null
                    },
                    {
                        "component": "_admin/views/im/GroupChat",
                        "path": "groupchat",
                        "name": "群聊记录",
                        "type": 2,
                        "operstatus": 1,
                        "icon": "",
                        "deep": 3,
                        "childs": null,
                        "levelname": "IM业务管理,消息管理,群聊记录",
                        "id": 9,
                        "virtualmenuflag": 2,
                        "operAuth": null
                    }
                ],
                "levelname": "IM业务管理,消息管理",
                "id": 28,
                "virtualmenuflag": 2,
                "operAuth": null
            },
            {
                "component": "",
                "path": "",
                "name": "群组",
                "type": 1,
                "operstatus": 1,
                "icon": "",
                "deep": 2,
                "childs": [
                    {
                        "component": "_admin/views/im/GroupChatManage",
                        "path": "groupChatManage",
                        "name": "群组管理",
                        "type": 2,
                        "operstatus": 1,
                        "icon": "",
                        "deep": 3,
                        "childs": null,
                        "levelname": "IM业务管理,群组,群组管理",
                        "id": 60460,
                        "virtualmenuflag": 2,
                        "operAuth": null
                    },
                    {
                        "component": "_admin/views/im/InvalidGroup",
                        "path": "invalidGroup",
                        "name": "无效群组",
                        "type": 2,
                        "operstatus": 1,
                        "icon": "",
                        "deep": 3,
                        "childs": null,
                        "levelname": "IM业务管理,群组,无效群组",
                        "id": 60464,
                        "virtualmenuflag": 2,
                        "operAuth": null
                    }
                ],
                "levelname": "IM业务管理,群组",
                "id": 60462,
                "virtualmenuflag": 2,
                "operAuth": null
            },
            {
                "component": "",
                "path": "",
                "name": "钱包红包",
                "type": 1,
                "operstatus": 1,
                "icon": "",
                "deep": 2,
                "childs": [
                    {
                        "component": "_admin/views/im/PurseUserAccount",
                        "path": "PurseUserAccount",
                        "name": "用户账户（钱包）",
                        "type": 2,
                        "operstatus": 1,
                        "icon": "",
                        "deep": 3,
                        "childs": null,
                        "levelname": "IM业务管理,钱包红包,用户账户（钱包）",
                        "id": 60466,
                        "virtualmenuflag": 2,
                        "operAuth": null
                    }
                ],
                "levelname": "IM业务管理,钱包红包",
                "id": 60465,
                "virtualmenuflag": 2,
                "operAuth": null
            },
            {
                "component": "",
                "path": "",
                "name": "敏感词管理",
                "type": 1,
                "operstatus": 1,
                "icon": "",
                "deep": 2,
                "childs": [
                    {
                        "component": "_admin/views/im/sensitive",
                        "path": "Sensitive",
                        "name": "管理敏感词",
                        "type": 2,
                        "operstatus": 1,
                        "icon": "",
                        "deep": 3,
                        "childs": null,
                        "levelname": "IM业务管理,敏感词管理,管理敏感词",
                        "id": 60476,
                        "virtualmenuflag": 2,
                        "operAuth": null
                    }
                ],
                "levelname": "IM业务管理,敏感词管理",
                "id": 60475,
                "virtualmenuflag": 2,
                "operAuth": null
            }
        ],
        "levelname": "IM业务管理",
        "id": 2,
        "virtualmenuflag": 2,
        "operAuth": null
    }
]
export default testMenu;
