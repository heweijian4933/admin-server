const util = require('../src/utils/util')

let deptList = [
    {
        _id: '6016728fc6a4417f2d27506e',
        parentId: ['60167059c9027b7d2c520a61'],
        updateTime: '2022-01-21T03:13:16.268Z',
        createTime: '2022-01-21T03:06:15.240Z',
        deptName: '研发部门',
        userId: '1000003',
        userName: 'user1000003',
        userEmail: 'user1000003@manager.com',
        mobile: 13788888840
    },
    {
        _id: '60167621531124822b79e124',
        parentId: ['60167059c9027b7d2c520a61', '6016728fc6a4417f2d27506e'],
        updateTime: '2022 - 01 - 21T03: 14: 27.807Z',
        createTime: '2022 - 01 - 21T03: 06: 15.225Z',
        deptName: 'JAVA小组-1',
        userId: '1000010',
        __v: 0
    },
    {
        _id: '60167059c9027b7d2c520a61',
        parentId: [null],
        updateTime: '2022 - 01 - 21T03: 20: 08.107Z',
        createTime: '2022 - 01 - 21T03: 06: 15.336Z',
        deptName: '广州公司',
        userId: '1000002',
        __v: 0
    }
]

class Test {
    constructor(name) {
        this.name = name;
    }
    getTreeDept(param1, param2, param3) {
        return util.getTreeDept(param1, param2, param3)
    }
}
let test = new Test("fuger");
console.log(test);
// let newArr = []
let arr = test.getTreeDept(deptList, null, [])
console.log(arr);