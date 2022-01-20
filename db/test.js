
const { getTreeMenu } = require('../src/utils/util')
let menuList = [
    {
        children: [],
        _id: '6030ca8f93f0e159c8390f0c',
        parentId: ['600d4075e218daaf4ec77e52', '600d525e602f452aaeeffcd9'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 2,
        menuState: 1,
        menuName: '新增',
        menuCode: 'user-create'
    },
    {
        children: [],
        _id: '603226d9257d15a8c54cf9f8',
        parentId: ['600d4075e218daaf4ec77e52', '600d525e602f452aaeeffcd9'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 2,
        menuState: 1,
        menuName: '批量删除',
        menuCode: 'user-delete'
    },
    {
        children: [],
        _id: '603253e0a821c6bb59084541',
        parentId: ['600d4075e218daaf4ec77e52', '600d525e602f452aaeeffcd9'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 2,
        menuState: 1,
        menuName: '查看',
        menuCode: 'user-query'
    },
    {
        children: [],
        _id: '600d525e602f452aaeeffcd9',
        parentId: ['600d4075e218daaf4ec77e52'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 1,
        menuName: '用户管理',
        menuCode: '',
        path: '/system/user',
        icon: '',
        order: 1,
        component: '/system/user',
        menuState: 1
    },
    {
        children: [],
        _id: '60325400a821c6bb59084543',
        parentId: ['600d4075e218daaf4ec77e52', '601bc4f8a794e23c2e42efa9'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 2,
        menuState: 1,
        menuName: '查看',
        menuCode: 'menu-query'
    },
    {
        children: [],
        _id: '6032540fa821c6bb59084544',
        parentId: ['600d4075e218daaf4ec77e52', '601bc4f8a794e23c2e42efa9'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 2,
        menuState: 1,
        menuName: '创建',
        menuCode: 'menu-create'
    },
    {
        children: [],
        _id: '601bc4f8a794e23c2e42efa9',
        parentId: ['600d4075e218daaf4ec77e52'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 1,
        menuState: 1,
        menuName: '菜单管理',
        path: '/system/menu',
        component: '/system/menu'
    },
    {
        children: [],
        _id: '60325425a821c6bb59084545',
        parentId: ['600d4075e218daaf4ec77e52', '601ca9a8a794e23c2e42efab'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 2,
        menuState: 1,
        menuName: '查看',
        menuCode: 'role-query'
    },
    {
        children: [],
        _id: '60325461a821c6bb59084546',
        parentId: ['600d4075e218daaf4ec77e52', '601ca9a8a794e23c2e42efab'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 2,
        menuState: 1,
        menuName: '创建',
        menuCode: 'role-create'
    },
    {
        children: [],
        _id: '601ca9a8a794e23c2e42efab',
        parentId: ['600d4075e218daaf4ec77e52'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 1,
        menuState: 1,
        menuName: '角色管理',
        path: '/system/role',
        component: '/system/role'
    },
    {
        children: [],
        _id: '60325470a821c6bb59084547',
        parentId: ['600d4075e218daaf4ec77e52', '601cb172a794e23c2e42efac'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 2,
        menuState: 1,
        menuName: '查看',
        menuCode: 'dept-query'
    },
    {
        children: [],
        _id: '6032547da821c6bb59084548',
        parentId: ['600d4075e218daaf4ec77e52', '601cb172a794e23c2e42efac'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 2,
        menuState: 1,
        menuName: '创建',
        menuCode: 'dept-create'
    },
    {
        children: [],
        _id: '601cb172a794e23c2e42efac',
        parentId: ['600d4075e218daaf4ec77e52'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 1,
        menuState: 1,
        menuName: '部门管理',
        path: '/system/dept',
        component: '/system/dept'
    },
    {
        children: [],
        _id: '600d4075e218daaf4ec77e52',
        parentId: [null],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 1,
        menuState: 1,
        menuName: '系统管理',
        menuCode: '',
        path: '/system',
        icon: 'el-icon-setting',
        order: 0,
        component: ''
    },
    {
        children: [],
        _id: '603254a8a821c6bb59084549',
        parentId: ['601b9eb25929c81a1f988bb0', '601bc763a794e23c2e42efaa'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 2,
        menuState: 1,
        menuName: '查看',
        menuCode: 'leave-query'
    },
    {
        children: [],
        _id: '603254baa821c6bb5908454a',
        parentId: ['601b9eb25929c81a1f988bb0', '601bc763a794e23c2e42efaa'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 2,
        menuState: 1,
        menuName: '申请休假',
        menuCode: 'leave-create'
    },
    {
        children: [],
        _id: '601bc763a794e23c2e42efaa',
        parentId: ['601b9eb25929c81a1f988bb0'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 1,
        menuState: 1,
        menuName: '休假申请',
        path: '/audit/leave',
        component: '/audit/leave'
    },
    {
        children: [],
        _id: '60361f35a821c6bb5908454d',
        parentId: ['601b9eb25929c81a1f988bb0', '602fd045bf465a015fef54dc'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 2,
        menuState: 1,
        menuName: '查看',
        menuCode: 'approve-query'
    },
    {
        children: [],
        _id: '602fd045bf465a015fef54dc',
        parentId: ['601b9eb25929c81a1f988bb0'],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 1,
        menuState: 1,
        menuName: '待我审批',
        path: '/audit/approve',
        component: '/audit/approve'
    },
    {
        children: [],
        _id: '601b9eb25929c81a1f988bb0',
        parentId: [null],
        updateTime: "2022 - 01 - 17T09: 58: 31.331Z",
        createTime: "2022 - 01 - 17T09: 58: 31.331Z",
        menuType: 1,
        menuState: 1,
        menuName: '审批管理',
        path: '/audit',
        icon: 'el-icon-s-promotion'
    }
]

// let res = getTreeMenu(menuList, null, [])
// console.log(res[0].children[0].children);
