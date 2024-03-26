const { homeRouter,userRouter,articleRouter,roleRouter,permissionRouter,adminRouter,tagRouter,commentRouter } = require('../controllers');
const RoleModel = require('../models/role');
const PermissionModel = require('../models/permission');
const { checkToken } = require('../utils/token');

// 验证权限中间件
async function checkPermission(ctx, next) {
    try {
        const authorization = ctx.header.authorization // 获取jwt
        if (authorization) {
            const token = authorization.split(' ')[1]
            let payload
            try {
                payload = await checkToken(token);  // 解密，获取payload
                const rid = payload.userinfo.rid;
                // 如果用户角色是超级管理员，则拥有所有权限，直接跳过
                if (rid === 0) {
                    await next();
                    return;
                }
                // 根据角色id获取权限
                RoleModel.belongsToMany(PermissionModel, { through: 'role_permission', foreignKey: 'rid', otherKey: 'pid' });
                const res = await RoleModel.findAll({
                    include: [{
                        model: PermissionModel,
                        through: {
                            attributes: ['rid', 'pid']
                        }
                    }],
                    where: {
                        id: rid
                    }
                });
                // 处理数据
                res.forEach(item => {
                    item.dataValues.permission = [];
                    item.dataValues.permissions.forEach(item2 => {
                        item.dataValues.permission.push(item2.path);
                    });
                    delete item.dataValues.permissions;
                });
                const permission = res[0].dataValues.permission;
                // 判断是否有权限
                if (permission.indexOf(ctx.path) > -1) {
                    await next();
                } else {
                    ctx.fail({ code: 1001, msg: ctx.path + ' 没有权限' });
                    return;
                }
            } catch (err) {
                ctx.fail({ code: 1001, msg: err.msg });
                return;
            }
        } else {
            ctx.fail({ code: 1001, msg: 'token不存在' });
            return;
        }
    } catch (err) {
        ctx.fail({ code: 1001, msg: err.msg });
        return;
    }
}


const routes = [
    // 登录注册
    {
        methods: "post",
        path: "/admin/login",
        controller: adminRouter.login
    },
    // 前台登录
    {
        methods: "post",
        path: "/api/login",
        controller: userRouter.login
    },
    // 前台注册
    // {
    //     methods: "post",
    //     path: "/api/register",
    //     controller: userRouter.register
    // },
    // 埋点数据
    {
        methods: "post",
        path: "/api/detect",
        controller: homeRouter.detect
    },
    {
        methods: "post",
        path: "/admin/detectList",
        controller: homeRouter.detectList,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/detectChart",
        controller: homeRouter.detectChart,
        middleware: [checkPermission]
    },
    // 抽奖
    {
        methods: "post",
        path: "/api/lottery",
        controller: homeRouter.lottery
    },
    {
        methods: "post",
        path: "/admin/lotteryList",
        controller: homeRouter.lotteryList,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/api/newList",
        controller: articleRouter.newList
    },
    {
        methods: "post",
        path: "/api/newDetail",
        controller: articleRouter.newDetail
    },
    {
        methods: "post",
        path: "/api/createNew",
        controller: articleRouter.createArticle,
    },
    {
        methods: "post",
        path: "/api/getTag",
        controller: tagRouter.getArticleTag
    },
    {
        methods: "post",
        path: "/api/newComment",
        controller: commentRouter.newComment
    },
    {
        methods: "post",
        path: "/api/thumbsUp",
        controller: commentRouter.thumbsUp
    },
    {
        methods: "post",
        path: "/api/thumbArticle",
        controller: articleRouter.thumbArticle,
    },
    // 首页
    {
        methods: "get",
        path: "/api/test",
        controller: homeRouter.home
    },
    // 上传
    {
        methods: "post",
        path: "/admin/upload",
        controller: homeRouter.upload
    },
    // 编辑器上传
    {
        methods: "post",
        path: "/admin/editorUpload",
        controller: homeRouter.editorUpload
    },
    // 前台上传
    {
        methods: "post",
        path: "/api/upload",
        controller: homeRouter.uploadImg
    },
    // 后台用户
    {
        methods: "post",
        path: "/admin/addAdmin",
        controller: adminRouter.addAdmin,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/adminList",
        controller: adminRouter.adminList,
        middleware: [checkPermission]
    },
    {
        methods: "get",
        path: "/admin/admin",
        controller: adminRouter.admin
    },
    {
        methods: "post",
        path: "/admin/updateAdmin",
        controller: adminRouter.updateAdmin,
    },
    {
        methods: "post",
        path: "/admin/deleteAdmin",
        controller: adminRouter.deleteAdmin,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/updatePassword",
        controller: adminRouter.updatePassword,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/getRoleList",
        controller: adminRouter.getRoleList,
        middleware: [checkPermission]
    },
    // 角色
    {
        methods: "post",
        path: "/admin/roleList",
        controller: roleRouter.roleList,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/addRole",
        controller: roleRouter.addRole,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/updateRole",
        controller: roleRouter.updateRole,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/deleteRole",
        controller: roleRouter.deleteRole,
        middleware: [checkPermission]
    },
    // 权限
    {
        methods: "post",
        path: "/admin/permissionList",
        controller: permissionRouter.permissionList,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/getRolePermission",
        controller: roleRouter.getRolePermission,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/assignPermission",
        controller: permissionRouter.assignPermission,
        middleware: [checkPermission]
    },
    // 获取菜单
    {
        methods: "post",
        path: "/admin/getMenu",
        controller: permissionRouter.getMenuPermission,
        // middleware: [checkPermission]
    },
    // 文章
    {
        methods: "post",
        path: "/admin/addArticle",
        controller: articleRouter.addArticle,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/articleList",
        controller: articleRouter.articleList,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/articleListByUserId",
        controller: articleRouter.articleListByUserId,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/updateArticle",
        controller: articleRouter.updateArticle,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/deleteArticle",
        controller: articleRouter.deleteArticle,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/getArticleTag",
        controller: tagRouter.getArticleTag,
        middleware: [checkPermission]
    },
    // 评论
    {
        methods: "post",
        path: "/admin/articleComment",
        controller: commentRouter.articleComment,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/addComment",
        controller: commentRouter.addComment,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/delComment",
        controller: commentRouter.delComment,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/updateComment",
        controller: commentRouter.updateComment,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/getCommentUser",
        controller: userRouter.getCommentUser,
    },
    // 标签
    {
        methods: "post",
        path: "/admin/addTag",
        controller: tagRouter.addTag,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/tagList",
        controller: tagRouter.tagList,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/updateTag",
        controller: tagRouter.updateTag,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/deleteTag",
        controller: tagRouter.deleteTag,
        middleware: [checkPermission]
    },
    // 用户
    {
        methods: "post",
        path: "/admin/addUser",
        controller: userRouter.addUser,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/userList",
        controller: userRouter.userList,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/updateUser",
        controller: userRouter.updateUser,
        middleware: [checkPermission]
    },
    {
        methods: "post",
        path: "/admin/deleteUser",
        controller: userRouter.deleteUser,
        middleware: [checkPermission]
    },
]

module.exports = routes;