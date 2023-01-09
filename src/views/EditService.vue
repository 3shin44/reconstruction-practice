<template>
    <div id="vueapp">

        <!-- 服務項目列表 表格 -->
        <div class="serviecsTable">
            <BasePaginationTable :tableHead="['ID', '服務名稱', '備註', '最後修改時間', '最後處理人員']"
                :dispalyOrder="['funcId', 'funcName', 'desc', 'mDate', 'mUser']" :tableData="allFunc_display"
                :totalDataLength="allFunc.length" :value="allFuncPageNo" @currentPage="allFuncRefresh"
                @dataClick="editServiceModal" />
        </div>

        <!-- Modal -->
        <div class="modal fade infoModal" id="editServiceModal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title" id="exampleModalLabel">編輯服務項目</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body infoModalNav">

                        <!-- Form-group -->
                        <div class="row mb-3 infoFormGroup">
                            <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">服務名稱</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control form-control-sm" v-model="serviceName">
                            </div>
                        </div>
                        <div class="row mb-3 infoFormGroup">
                            <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">備註</label>
                            <div class="col-sm-10">
                                <textarea maxlength="2000" class="form-control textareaNoResize"
                                    aria-label="With textarea" v-model="serviceDesc"></textarea>
                            </div>
                        </div>

                        <!-- Tabs-nav -->
                        <ul class="nav nav-tabs editServiceNav" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="callRecord-tab" data-bs-toggle="tab"
                                    data-bs-target="#callRecord" type="button" role="tab" aria-controls="unfinish"
                                    aria-selected="false">來電提示-有非本人來電紀錄</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="docPhoto-tab" data-bs-toggle="tab"
                                    data-bs-target="#docPhoto" type="button" role="tab" aria-controls="unfinish"
                                    aria-selected="false">證件影像</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="verAsk-tab" data-bs-toggle="tab" data-bs-target="#verAsk"
                                    type="button" role="tab" aria-controls="unfinish"
                                    aria-selected="false">核身話術</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="verify-tab" data-bs-toggle="tab" data-bs-target="#verify"
                                    type="button" role="tab" aria-controls="verify" aria-selected="true">核對項目</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="complete-tab" data-bs-toggle="tab"
                                    data-bs-target="#complete" type="button" role="tab" aria-controls="complete"
                                    aria-selected="false">完成原因</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="unfinish-tab" data-bs-toggle="tab"
                                    data-bs-target="#unfinish" type="button" role="tab" aria-controls="unfinish"
                                    aria-selected="false">未通過/未完成原因</button>
                            </li>
                        </ul>

                        <!-- Tabs-content -->
                        <div class="tab-content infoModalContent">
                            <!-- 來電提示、有非本人來電紀錄 -->
                            <div class="tab-pane fade show active" id="callRecord" role="tabpanel"
                                aria-labelledby="callRecord-tab">

                                <div class="tab-content">
                                    <div>
                                        <span class="input-group-text areaTitle">來電提示-有非本人來電紀錄</span>
                                        <textarea maxlength="2000" class="form-control areaContent areaContent-large"
                                            v-model="callRecords"></textarea>
                                    </div>
                                </div>

                            </div>


                            <!-- 證件影像 -->
                            <div class="tab-pane fade" id="docPhoto" role="tabpanel" aria-labelledby="docPhoto-tab">

                                <div class="tab-content">
                                    <div>
                                        <span class="input-group-text areaTitle">證件影像</span>
                                        <textarea maxlength="2000" class="form-control areaContent areaContent-large"
                                            v-model="idImage"></textarea>
                                    </div>
                                </div>

                            </div>


                            <!-- 核身話術 -->
                            <div class="tab-pane fade" id="verAsk" role="tabpanel" aria-labelledby="verAsk-tab">

                                <div class="tab-content">
                                    <div>
                                        <span class="input-group-text areaTitle">核身話術</span>
                                        <textarea maxlength="2000" class="form-control areaContent areaContent-large"
                                            v-model="verifyTerms"></textarea>
                                    </div>
                                </div>
                            </div>


                            <!-- 核對項目 -->
                            <div class="tab-pane fade" id="verify" role="tabpanel" aria-labelledby="verify-tab">

                                <div class="tab-content">
                                    <div class="btnContainer">
                                        <button class="btn btn-outline-secondary" style="margin-right: 5px"
                                            @click="addVerifyItem">
                                            <i class="fa-solid fa-plus"></i> 新增
                                        </button>
                                        <button class="btn btn-outline-secondary" @click="removeVerifyItem">
                                            <i class="fa-solid fa-trash-can"></i> 刪除
                                        </button>
                                    </div>
                                    <div>
                                        <table class="table table-hover table-bordered">
                                            <thead>
                                                <tr role="row">
                                                    <th class="middle table-active text-center"><input type="checkbox"
                                                            @change="verifyItemSelectAll"
                                                            v-model="verifyItemSelectAll_status">
                                                    </th>
                                                    <th class="middle table-active text-center">ID</th>
                                                    <th class="middle table-active text-center">核對項目</th>
                                                    <th class="middle table-active text-center">詢問句</th>
                                                    <th class="middle table-active text-center">排序</th>
                                                    <th class="middle table-active text-center">功能</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(item, index) in funcById_serviceIdentityItems">
                                                    <td class="text-center align-middle">
                                                        <input type="checkbox"
                                                            v-model="funcById_serviceIdentityItemsSelect"
                                                            group="serviceIdentityItems" :value="item.sort">
                                                    </td>
                                                    <td class="text-center align-middle idSn">
                                                        {{ item.sort }}
                                                    </td>
                                                    <td class="text-start align-middle">
                                                        <textarea maxlength="2000"
                                                            class="form-control areaContent areaContent-medium areaContent-round"
                                                            :disabled="funcById_serviceIdentityItems[index].lock"
                                                            v-model="funcById_serviceIdentityItems[index].identityTitle"></textarea>
                                                    </td>
                                                    <td class="text-start align-middle">
                                                        <textarea maxlength="2000"
                                                            class="form-control areaContent areaContent-medium areaContent-round"
                                                            :disabled="funcById_serviceIdentityItems[index].lock"
                                                            v-model="funcById_serviceIdentityItems[index].identityContent"></textarea>
                                                    </td>
                                                    <td class="text-center align-middle">
                                                        <button class="btn btn-outline-secondary up"
                                                            style="margin-right: 5px"
                                                            :disabled="funcById_serviceIdentityItems[index].lock"
                                                            @click="moveElement(index, funcById_serviceIdentityItems, 'upward')">
                                                            <i class="fa-solid fa-arrow-up"></i>
                                                        </button>
                                                        <button class="btn btn-outline-secondary down"
                                                            :disabled="funcById_serviceIdentityItems[index].lock"
                                                            @click="moveElement(index, funcById_serviceIdentityItems, 'downward')">
                                                            <i class="fa-solid fa-arrow-down"></i>
                                                        </button>
                                                    </td>
                                                    <td class="text-center align-middle">
                                                        <button class="editButton"
                                                            @click="editableSwitch('funcById_serviceIdentityItems', index)">
                                                            <i class="fa-solid fa-pen"></i>
                                                        </button>
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>


                            <!-- 完成原因 -->
                            <div class="tab-pane fade" id="complete" role="tabpanel" aria-labelledby="complete-tab">

                                <div class="tab-content">
                                    <!-- 未完成NN -->
                                    <EditPanel dom-id="notPass" :source-data="funcById_reasonsResultTypeYN"
                                        :info-code-source="infoCodeRaw" />
                                </div>

                            </div>


                            <!-- 未通過NN/未完成NY-->
                            <div class="tab-pane fade" id="unfinish" role="tabpanel" aria-labelledby="unfinish-tab">

                                <div class="tab-content">
                                    <!-- 未完成NN -->
                                    <EditPanel dom-id="notComplete" :source-data="funcById_reasonsResultTypeYN"
                                        :info-code-source="infoCodeRaw" />
                                </div>
                            </div>

                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="saveNupdate">
                            <i class="fa-solid fa-check"></i> 儲存
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fa-solid fa-xmark"></i> 取消
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>


<script>
    import functionUtil from '../util/functionUtil'
    import api from '../api'
    import BasePaginationTable from '@/components/common/BasePaginationTable.vue'
    import { Modal } from 'bootstrap'
    import VJstree from 'vue-jstree'
    import EditPanel from '@/components/common/EditPanel.vue'


    export default {
        name: 'EditService',
        components: { BasePaginationTable, VJstree, EditPanel },
        data() {
            return {

                state: {
                    // url參數 初始為null
                    queryData: null
                },

                infoCodeMoalObj: null,
                infoCodeRaw: {
                    "menuIDAndName": {
                        "1521": "信用卡/盜刷",
                        "7": "電訪"
                    },
                    "menuList": [
                        {
                            "1521": [
                                {
                                    "groupName": "信用卡/盜刷",
                                    "groupID": 2664,
                                    "2664": [
                                        {
                                            "titleName": "信用卡/盜刷",
                                            "titleID": 9559,
                                            "9559": [
                                                {
                                                    "dataID": 9560,
                                                    "9560": "信用卡/盜刷"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "menuID": 1521
                        },
                        {
                            "7": [
                                {
                                    "groupName": "電訪結果",
                                    "groupID": 7,
                                    "7": [
                                        {
                                            "7698": [
                                                {
                                                    "7699": "外部參數測試",
                                                    "dataID": 7699
                                                },
                                                {
                                                    "dataID": 9172,
                                                    "9172": "new_data2"
                                                }
                                            ],
                                            "titleName": "成功",
                                            "titleID": 7698
                                        }
                                    ]
                                },
                                {
                                    "16": [
                                        {
                                            "titleName": "失敗",
                                            "9173": [
                                                {
                                                    "dataID": 9174,
                                                    "9174": "失敗"
                                                }
                                            ],
                                            "titleID": 9173
                                        }
                                    ],
                                    "groupName": "網投諮詢",
                                    "groupID": 16
                                }
                            ],
                            "menuID": 7
                        }
                    ],
                    "returnCode": "0000",
                    "returnMsg": "交易完成"
                },
                // infoCode360 服務代碼
                infoCodeData: [{
                    "text": "服務代碼",
                    "opened": false,
                    "disabled": true,
                    "children": []
                }],
                infoCodeList: [],
                treeCollapse: false,
                // 開啟服務代碼所編輯資料
                currentItem: null,

                // 所有服務列表, 顯示頁面, 當前頁碼 
                allFunc: [],
                allFunc_display: [],
                allFuncPageNo: 1,

                // 取得服務的核對項目、完成原因、未完成原因、話術
                funcById_mainService: null,
                funcById_serviceIdentityItems: null,
                funcById_serviceSpeakTips: null,
                // YN完成   NN未完成    NY未通過
                funcById_reasonsResultTypeYN: null,
                funcById_reasonsResultTypeNN: null,
                funcById_reasonsResultTypeNY: null,

                // 不顯示資料暫存區 (各類原因)
                serviceApplyReason_cancel: [],


                // 編輯服務項目MODAL資料: 服務名稱, 備註, 非本人來電紀錄, 證件影像, 核身話術
                editServiceModalObj: null,
                serviceName: "",
                serviceDesc: "",
                callRecords: "",
                idImage: "",
                verifyTerms: "",

                // 核對項目: 已選清單
                verifyItemSelectAll_status: false,
                funcById_serviceIdentityItemsSelect: [],

                // 完成原因YN: 全選狀態, 已選編號
                completeSelectAll_status: false,
                funcById_reasonsResultTypeYNSelect: [],

                // 未完成NN: 全選狀態, 已選編號
                incomplete_SelectAll_status: false,
                funcById_reasonsResultTypeNNSelect: [],

                // 未通過NY: 全選狀態, 已選編號
                failSelectAll_status: false,
                funcById_reasonsResultTypeNYSelect: [],
            }
        },
        methods: {
            // 清除先前資料
            clearVueData() {
                // this.allFunc = [];
                // this.allFunc_display = [];
                // this.allFuncPageNo = 1,

                // 取得服務的核對項目、完成原因、未完成原因、話術
                this.funcById_mainService = null;
                this.funcById_serviceIdentityItems = null;
                this.funcById_serviceSpeakTips = null;
                // YN完成   NN未完成    NY未通過
                this.funcById_reasonsResultTypeYN = null;
                this.funcById_reasonsResultTypeNN = null;
                this.funcById_reasonsResultTypeNY = null;

                // 不顯示資料暫存區 (各類原因)
                this.serviceApplyReason_cancel = [];

                // 編輯服務項目MODAL資料: 服務名稱, 備註, 非本人來電紀錄, 證件影像, 核身話術
                this.serviceName = "";
                this.serviceDesc = "";
                this.callRecords = "";
                this.idImage = "";
                this.verifyTerms = "";

                // 核對項目: 已選清單
                this.verifyItemSelectAll_status = false;
                this.funcById_serviceIdentityItemsSelect = [];

                // 完成原因YN: 全選狀態, 已選編號
                this.completeSelectAll_status = false;
                this.funcById_reasonsResultTypeYNSelect = [];

                // 未完成NN: 全選狀態, 已選編號
                this.incomplete_SelectAll_status = false;
                this.funcById_reasonsResultTypeNNSelect = [];

                // 未通過NY: 全選狀態, 已選編號
                this.failSelectAll_status = false;
                this.funcById_reasonsResultTypeNYSelect = [];
            },

            // 服務代碼MODAL開啟
            infoCodeModal(curItem) {
                // 清空先前已選代碼
                this.infoCodeList = [];
                // 更新目前編輯資料來源
                this.currentItem = curItem;

                // 更新 info360 Code, 
                this.updateTree(this.infoCodeRaw);

                // 開啟燈箱
                this.infoCodeMoalObj.show();
            },

            // 選擇服務代碼
            selectInfoCode(nupdateTreeode, item, e) {
                if (item.selected) {
                    this.infoCodeList.push(item.dataID.toString());
                } else {
                    let targetIndex = this.infoCodeList.indexOf(item.dataID.toString());
                    if (targetIndex != -1) {
                        this.infoCodeList.splice(targetIndex, 1);
                    }

                }
            },

            /*
            * 更新服務代碼樹資料
            * @param 後端接收到的原始資料
            */
            updateTree(res) {

                // 無資料時不更新
                if (res == null) {
                    return
                }

                // 第一層 MENU
                res.menuList.forEach((menu_el) => {
                    this.infoCodeData[0].children.push({
                        "menuID": menu_el.menuID,
                        // 依據ID去取MENU名稱
                        "text": res.menuIDAndName[menu_el.menuID],
                        "disabled": true,
                        "opened": false,
                        "children": []
                    });
                });


                // 在MENU節點 取第二層GROUP
                this.infoCodeData[0].children.forEach(menu_el => {
                    // 找MENU節點
                    res.menuList.forEach(group_el => {
                        if (menu_el.menuID in group_el) {
                            // 取到對應group陣列
                            group_el[menu_el.menuID].forEach(group => {
                                menu_el.children.push({
                                    "groupID": group.groupID,
                                    "text": group.groupName,
                                    "disabled": true,
                                    "opened": false,
                                    "children": []
                                });
                            });
                        }
                    });
                });


                // 在GROUP節點 取第三層TITLE
                this.infoCodeData[0].children.forEach(menu_el => {
                    // 此為GROUP節點
                    menu_el.children.forEach(group_el => {

                        // 取GROUP下面的TILTE資料
                        res.menuList.forEach(findMenu => {
                            // 找到對應MENU
                            if (menu_el.menuID in findMenu) {
                                findMenu[menu_el.menuID].forEach(findGroup => {
                                    // 找到對應TITLE資料
                                    if (group_el.groupID in findGroup) {
                                        findGroup[group_el.groupID].forEach(tilte_el => {

                                            group_el.children.push({
                                                "titleID": tilte_el.titleID,
                                                "text": tilte_el.titleName,
                                                "disabled": true,
                                                "opened": false,
                                                "children": []
                                            })
                                        });
                                    }
                                })
                            }
                        });

                    });
                });


                // 現存已選代碼轉為陣列 (依","分隔)
                let selectedList = [];
                if (this.currentItem.dataId != "") {
                    selectedList = this.currentItem.dataId.split(",");
                    // 更新已選清單
                    this.infoCodeList = selectedList;
                };


                // 在TITLE節點 取第底層DATA
                this.infoCodeData[0].children.forEach(menu_el => {
                    menu_el.children.forEach(group_el => {
                        group_el.children.forEach(title_el => {

                            // 尋找TITLE層的帶的data資料
                            res.menuList.forEach(findMenu => {
                                if (menu_el.menuID in findMenu) {
                                    findMenu[menu_el.menuID].forEach(findGroup => {
                                        if (group_el.groupID in findGroup) {
                                            findGroup[group_el.groupID].forEach(findTitle => {
                                                if (title_el.titleID in findTitle) {
                                                    findTitle[title_el.titleID].forEach(findData => {
                                                        let isSelected = false;

                                                        // if dataId is selected, turn 
                                                        if (selectedList.includes(findData.dataID.toString())) {
                                                            isSelected = true;
                                                            menu_el.opened = true;
                                                            group_el.opened = true;
                                                            title_el.opened = true;
                                                            this.infoCodeData[0].opened = true;
                                                        }
                                                        // 比對現存已選清單, 若已選預先打勾

                                                        title_el.children.push({

                                                            "selected": isSelected,
                                                            "dataID": findData.dataID,
                                                            "text": findData[findData.dataID],
                                                            "icon": "fa-solid fa-file"
                                                        })
                                                    });
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        });
                    });
                });
            },

            // 更新資料服務代碼
            updateInfoCode(curItem) {
                // 有選代碼: 更新字串, 無選擇維持NULL
                if (this.infoCodeList.length != 0) {
                    let concatStr = this.infoCodeList.join(",");
                    curItem.dataId = concatStr;
                } else {
                    curItem.dataId = "";
                }

                // 清除舊資料
                this.clearInfoCode();
                this.currentItem = null;

                // 關閉燈箱
                this.infoCodeMoalObj.hide();
            },

            // 恢復 服務代碼 預設狀態
            clearInfoCode() {
                this.infoCodeData = [{
                    "text": "服務代碼",
                    "opened": false,
                    "disabled": true,
                    "children": []
                }]
            },

            /*
            * 陣列元素排序: 依據元素(物件)之key值排序
            * @array 待排序陣列 
            * @key 物件KEY值 排序依據的KEY值
            * @order 排序方式 遞增遞減, 參數為: "ASC", "DESC"預設遞增排序
            * @return 已排序陣列
            */
            sort_Object_In_Array(array, key = 'sort', orderBy = "ASC") {
                // convert input string to upperCase
                orderBy = orderBy.toUpperCase();
                let result = [];
                switch (orderBy) {
                    case "ASC":
                        result = array.sort((a, b) => {
                            return a[key] - b[key];
                        });
                        break;

                    case "DESC":
                        result = array.sort((a, b) => {
                            return b[key] - a[key];
                        });
                        break;

                    // default: return origin array
                    default:
                        return array;
                        break;
                }

                return result;
            },

            /*
            * 更新排序參數編號
            * @param array 傳入陣列
            * @param key 物件中sort值的key名稱
            */
            updateSort(array, key = 'sort') {
                array.forEach((element, index) => {
                    element[key] = index + 1;
                });
            },

            /*
            * 陣列元素順序移動
            * @param index v-for渲染時產生之index值
            * @param array v-for使用之陣列
            * @param action 移動方向, 傳入參數為: 'upward', 'downward', 預設不動作
            */
            moveElement(index, array, action = 0, sortKey = 'sort') {
                // 防呆轉換
                action = action.toString();
                action = action.toLowerCase();
                switch (action) {
                    case "upward":
                        // top element doesn't need move
                        if (index == 0) {
                            return;
                        };

                        // upward an element usgin es6 method
                        [array[index - 1], array[index]] = [array[index], array[index - 1]];
                        break;

                    case "downward":
                        // bottom element doesn't need move.
                        //  note array length minus 1 is the index of last element
                        if (index == array.length - 1) {
                            return;
                        };

                        // downward an element usgin es6 method
                        [array[index], array[index + 1]] = [array[index + 1], array[index]];
                        break;

                    // default action (don't forceUpdate)
                    default:
                        return;
                        break;
                }

                // 更新SORT值
                this.updateSort(array, sortKey);

                // 更新表格
                this.$forceUpdate();
            },

            /*
            * 編輯狀態切換
            * @param target 資料陣列名稱
            * @param index 該筆資料索引值
            */
            editableSwitch(target, index) {
                switch (target) {
                    case "funcById_serviceIdentityItems":
                        this.funcById_serviceIdentityItems[index].lock = !this.funcById_serviceIdentityItems[index].lock;
                        break;

                    case "funcById_reasonsResultTypeYN":
                        this.funcById_reasonsResultTypeYN[index].lock = !this.funcById_reasonsResultTypeYN[index].lock;
                        break;

                    case "funcById_reasonsResultTypeNN":
                        this.funcById_reasonsResultTypeNN[index].lock = !this.funcById_reasonsResultTypeNN[index].lock;
                        break;

                    case "funcById_reasonsResultTypeNY":
                        this.funcById_reasonsResultTypeNY[index].lock = !this.funcById_reasonsResultTypeNY[index].lock;
                        break;

                    default:
                        break;
                }
                // 更新表格資料
                this.$forceUpdate();
            },


            // 所有服務顯示頁數
            allFuncRefresh(pageNo) {
                this.allFuncPageNo = pageNo;
                this.allFunc_display = functionUtil.refreshTable(this.allFunc, this.allFunc_display, pageNo, 10);
            },

            // getFuncById: 開啟編輯MODAL
            editServiceModal(index) {


                // 取得服務的核對項目、完成原因、未完成原因、話術
                const getFuncByIdRes = {
                    "returnCode": "0000",
                    "returnMsg": "交易成功",
                    "mainService": {
                        "funcId": "1",
                        "funcName": "數三他行-提高限額",
                        "desc": "數三他行測試",
                        "mUser": " (111222)",
                        "mDate": "2022-11-28 11:24:04"
                    },
                    "reasonsResultTypeYN": [
                        {
                            "skey": 3147,
                            "reasonId": "7",
                            "reason": "3系統證件比對完成",
                            "textYN": "N",
                            "notPass": "N",
                            "api": "Y",
                            "dataId": "7699,9172,9174",
                            "sort": 3,
                            "cancel": "N",
                            "resultType": "Y"
                        },
                        {
                            "skey": 3148,
                            "reasonId": "8",
                            "reason": "2出示證件比對完成",
                            "textYN": "Y",
                            "notPass": "N",
                            "api": "Y",
                            "dataId": "",
                            "sort": 2,
                            "cancel": "N",
                            "resultType": "Y"
                        },
                        {
                            "skey": 3148,
                            "reasonId": "9",
                            "reason": "1 TEST NOT-LOCK",
                            "textYN": "Y",
                            "notPass": "N",
                            "api": "Y",
                            "dataId": "",
                            "sort": 1,
                            "cancel": "N",
                            "resultType": "Y",
                            lock: false
                        },
                        {
                            "skey": 1111,
                            "reasonId": "9",
                            "reason": "U can't see me",
                            "textYN": "Y",
                            "notPass": "N",
                            "api": "Y",
                            "dataId": "",
                            "sort": 1,
                            "cancel": "Y",
                            "resultType": "Y",
                            lock: false
                        }
                    ],
                    "reasonsResultTypeNN": [
                        {
                            "skey": 3149,
                            "reasonId": "1",
                            "reason": "人臉不易判斷(開戶開小額)",
                            "textYN": "N",
                            "notPass": "N",
                            "api": "N",
                            "dataId": "",
                            "sort": 1,
                            "cancel": "N",
                            "resultType": "N"
                        },
                        {
                            "skey": 3150,
                            "reasonId": "2",
                            "reason": "無法核對_身分資料不在身上",
                            "textYN": "N",
                            "notPass": "N",
                            "api": "N",
                            "dataId": "",
                            "sort": 2,
                            "cancel": "N",
                            "resultType": "N"
                        },
                        {
                            "skey": 3151,
                            "reasonId": "3",
                            "reason": "無法核對_網路品質不佳、客戶斷線",
                            "textYN": "Y",
                            "notPass": "N",
                            "api": "N",
                            "dataId": "",
                            "sort": 3,
                            "cancel": "N",
                            "resultType": "N"
                        },
                        {
                            "skey": 3157,
                            "reasonId": "10",
                            "reason": "222",
                            "textYN": "Y",
                            "notPass": "N",
                            "api": "N",
                            "dataId": "",
                            "sort": 5,
                            "cancel": "Y",
                            "resultType": "N"
                        },
                        {
                            "skey": 3158,
                            "reasonId": "10",
                            "reason": "222",
                            "textYN": "Y",
                            "notPass": "N",
                            "api": "N",
                            "dataId": "",
                            "sort": 5,
                            "cancel": "Y",
                            "resultType": "N"
                        }
                    ],
                    "reasonsResultTypeNY": [
                        {
                            "skey": 3152,
                            "reasonId": "4",
                            "reason": "非本人_證件(雙證)與進線者完全不符",
                            "textYN": "N",
                            "notPass": "Y",
                            "api": "N",
                            "dataId": "",
                            "sort": 1,
                            "cancel": "N",
                            "resultType": "N"
                        },
                        {
                            "skey": 3153,
                            "reasonId": "5",
                            "reason": "非本人_核資未通過(用於舊戶)",
                            "textYN": "N",
                            "notPass": "Y",
                            "api": "N",
                            "dataId": "",
                            "sort": 2,
                            "cancel": "N",
                            "resultType": "N"
                        },
                        {
                            "skey": 3154,
                            "reasonId": "6",
                            "reason": "非本人_非真人(疑似用照片合成進線)",
                            "textYN": "N",
                            "notPass": "Y",
                            "api": "N",
                            "dataId": "",
                            "sort": 3,
                            "cancel": "N",
                            "resultType": "N"
                        },
                        {
                            "skey": 3155,
                            "reasonId": "11",
                            "reason": "未通過原因4",
                            "textYN": "Y",
                            "notPass": "Y",
                            "api": "N",
                            "dataId": "",
                            "sort": 4,
                            "cancel": "N",
                            "resultType": "N"
                        },
                        {
                            "skey": 3156,
                            "reasonId": "12",
                            "reason": "zzzz",
                            "textYN": "Y",
                            "notPass": "Y",
                            "api": "N",
                            "dataId": "",
                            "sort": 5,
                            "cancel": "N",
                            "resultType": "N"
                        }
                    ],
                    "serviceIdentityItems": [
                        {
                            "skey": 798,
                            "identityId": "1",
                            "identityTitle": "確認姓名",
                            "identityContent": "請問您的大名是？",
                            "sort": 1
                        },
                        {
                            "skey": 799,
                            "identityId": "2",
                            "identityTitle": "指定動作",
                            "identityContent": "請脫下口罩 / 拿出身分證 / 將身分證正面對準鏡頭 / 請把身分證靠近鏡頭",
                            "sort": 2
                        },
                        {
                            "skey": 800,
                            "identityId": "3",
                            "identityTitle": "臉部辨識",
                            "identityContent": "好的謝謝您，後續會送審核，請再留意email通知結果，謝謝您再見。\u003cbr\u003e不易辨識，請接續4.加核項目",
                            "sort": 3
                        },
                        {
                            "skey": 801,
                            "identityId": "4",
                            "identityTitle": "加核項目",
                            "identityContent": "新戶請客戶出示第二證件，舊戶輔以知識問答",
                            "sort": 4
                        }
                    ],
                    "serviceSpeakTips": [
                        {
                            "skey": 1,
                            "speakTitle": "證件影像",
                            "speakContent": "old ＾3＾ 影像時間：{Date}",
                            "speakComponent": "IdentificationImage"
                        },
                        {
                            "skey": 2,
                            "speakTitle": "核身話術",
                            "speakContent": "您好，我是台北富邦客服，跟您以視訊方式確認資料。yoyoyoyoyoyoyo\nO_O",
                            "speakComponent": "IdentityVerificationSentence"
                        },
                        {
                            "skey": 3,
                            "speakTitle": "來電提示-有非本人來電記錄",
                            "speakContent": "哇嗚哇嗚\n哇嗚哇嗚sss123",
                            "speakComponent": "IncomingCallAlertNotOwner"
                        }
                    ]
                }


                // 接收資料
                this.funcById_mainService = getFuncByIdRes.mainService;
                this.funcById_serviceIdentityItems = getFuncByIdRes.serviceIdentityItems;
                this.funcById_serviceSpeakTips = getFuncByIdRes.serviceSpeakTips;

                // 資料儲存至VUE顯示用陣列, 將cancel資料移置暫存區
                this.funcById_reasonsResultTypeYN = getFuncByIdRes.reasonsResultTypeYN;
                // this.funcById_reasonsResultTypeYN = this.filterCancel_Item(this.funcById_reasonsResultTypeYN, this.serviceApplyReason_cancel);


                // this.funcById_reasonsResultTypeNY = getFuncByIdRes.reasonsResultTypeNY;
                // this.funcById_reasonsResultTypeNY = this.filterCancel_Item(this.funcById_reasonsResultTypeNY, this.serviceApplyReason_cancel);

                // 更新標題資料
                this.serviceName = this.funcById_mainService.funcName;
                this.serviceDesc = this.funcById_mainService.desc;

                // 更新TAB(依speakComponent找) 來電提示-有非本人來電記錄(IncomingCallAlertNotOwner), 證件影像(IdentificationImage), 核身話術(IdentityVerificationSentence)
                // 有資料再更新
                if (this.funcById_serviceSpeakTips.length != 0) {
                    let IncomingCall = this.funcById_serviceSpeakTips.findIndex(element => element.speakComponent == "IncomingCallAlertNotOwner");
                    let IdImage = this.funcById_serviceSpeakTips.findIndex(element => element.speakComponent == "IdentificationImage");
                    let IdSentence = this.funcById_serviceSpeakTips.findIndex(element => element.speakComponent == "IdentityVerificationSentence");

                    // 依據KEY值給予對應資料供VUE渲染
                    this.callRecords = this.funcById_serviceSpeakTips[IncomingCall].speakContent;
                    this.idImage = this.funcById_serviceSpeakTips[IdImage].speakContent;
                    this.verifyTerms = this.funcById_serviceSpeakTips[IdSentence].speakContent;
                }


                // 核對項目 資料處理: 
                // 1. 依據SORT值更新順序, 且更新編碼
                // 2. 增加鎖定狀態KEY
                // this.funcById_serviceIdentityItems = this.sort_Object_In_Array(this.funcById_serviceIdentityItems);
                // this.updateSort(this.funcById_serviceIdentityItems);
                // this.funcById_serviceIdentityItems.forEach(element => {
                //     element.lock = true;
                // });

                // 完成原因 資料處理: 
                // 1. 依據SORT值更新順序, 且更新編碼
                // 2. 增加鎖定狀態KEY
                // this.funcById_reasonsResultTypeYN = this.sort_Object_In_Array(this.funcById_reasonsResultTypeYN);
                // this.updateSort(this.funcById_reasonsResultTypeYN);
                // this.funcById_reasonsResultTypeYN.forEach(element => {
                //     element.lock = true;
                // });



                // 打開MODAL
                this.editServiceModalObj.show();


                // 取得服務對應的所有info360功能代碼
                // (async () => {
                //     try {
                //         let res = await api.getActivityIDs({
                //             funcId: queryId
                //         });

                //         // 檢查回傳結果, 有誤提示訊息並中斷後續執行
                //         if (functionUtil.apiResponseError(res)) {
                //             return;
                //         };

                //         // 無資料時不更新
                //         if (res.menuList.length == 0) {
                //             return
                //         }

                //         // 儲存為原始資料
                //         this.infoCodeRaw = res;

                //     } catch (error) {
                //         console.log(error);
                //     }
                // })();



            },

            // 核對項目全選/全不選
            verifyItemSelectAll() {
                if (this.verifyItemSelectAll_status) {
                    this.funcById_serviceIdentityItemsSelect = [];
                    // 資料陣列中所有sort值加入選擇陣列
                    this.funcById_serviceIdentityItems.forEach(element => {
                        this.funcById_serviceIdentityItemsSelect.push(element.sort)
                    });
                } else {
                    // dis select all
                    this.funcById_serviceIdentityItemsSelect = [];
                }
            },

            // 核對項目增加
            addVerifyItem() {
                this.funcById_serviceIdentityItems.push({
                    "skey": null,
                    "sort": this.funcById_serviceIdentityItems.length + 1,
                    "identityTitle": null,
                    "identityContent": null,
                    "identityId": null,
                    "cancel": "N",
                    "resultType": "",
                    "mUser": `${this.state.queryData.agentName} (${this.state.queryData.agentId})`,

                    // 前端頁面控制用LOCK
                    "lock": false
                });
            },

            // 核對項目刪除 
            removeVerifyItem() {
                // 依據已選擇sort值篩選
                let filteredArray = [];

                // 每個元素sort值比對 previous version
                this.funcById_serviceIdentityItems.forEach(item => {
                    // 是否在勾選清單內, 不存在則加至暫存陣列
                    if (!this.funcById_serviceIdentityItemsSelect.includes(item.sort)) {
                        filteredArray.push(item);
                    }
                });

                // 更新篩選資料
                this.funcById_serviceIdentityItems = filteredArray;

                // 更新SORT值
                this.updateSort(this.funcById_serviceIdentityItems);

                // 清空已選清單
                this.funcById_serviceIdentityItemsSelect = [];

                // 全選取消勾選
                this.verifyItemSelectAll_status = false;
            },

            // 完成原因 項目全選/全不選
            completeSelectAll() {
                // if (this.completeSelectAll_status) {
                //     this.funcById_reasonsResultTypeYNSelect = [];
                //     // 資料陣列中所有sort值加入選擇陣列
                //     this.funcById_reasonsResultTypeYN.forEach(element => {
                //         this.funcById_reasonsResultTypeYNSelect.push(element.sort)
                //     });
                // } else {
                //     // dis select all
                //     this.funcById_reasonsResultTypeYNSelect = [];
                // }
            },

            // 完成原因 新增
            addComplete() {
                this.funcById_reasonsResultTypeYN.push({
                    "skey": null,
                    "reasonId": null,
                    "reason": null,
                    "resultType": "",
                    "api": "Y",
                    "textYN": "N",
                    "notPass": "N",
                    "dataId": "",
                    "sort": this.funcById_reasonsResultTypeYN.length + 1
                });
            },

            // 完成原因 刪除
            removeComplete() {

                // 檢查每個元素sort是否被選取 已選更動cancel值, 加入"完成原因"標籤
                this.funcById_reasonsResultTypeYN.forEach(item => {
                    // 是否在勾選清單內, 不存在則加至暫存陣列
                    if (this.funcById_reasonsResultTypeYNSelect.includes(item.sort)) {
                        item.cancel = "Y";
                        item.resultType = "Y";
                    }
                });
                // 更新顯示陣列
                this.funcById_reasonsResultTypeYN = this.filterCancel_Item(this.funcById_reasonsResultTypeYN, this.serviceApplyReason_cancel);

                // 更新SORT值
                this.updateSort(this.funcById_reasonsResultTypeYN);

                // 清空已選清單
                this.funcById_reasonsResultTypeYNSelect = [];

                // 全選取消勾選
                // this.completeSelectAll_status = false;
            },




            // 更新服務的核對項目、完成原因、未完成原因、話術
            saveNupdate() {
                // 移除前端頁面使用鎖定值(LOCK)
                function dropLockKey(array = []) {
                    array.forEach(element => {
                        delete element.lock;
                    });
                    return array;
                }
                // 移除前端頁面鎖定用lock
                this.funcById_serviceIdentityItems = dropLockKey(this.funcById_serviceIdentityItems);
                this.funcById_reasonsResultTypeYN = dropLockKey(this.funcById_reasonsResultTypeYN);


                // 更新funcById_mainService
                this.funcById_mainService.funcName = this.serviceName;
                this.funcById_mainService.mUser = `${this.state.queryData.agentName} (${this.state.queryData.agentId})`;
                this.funcById_mainService.desc = this.serviceDesc;


                // 回傳資料整理: serviceApplyReason 移除多餘KEY值, 增加對應KEY值
                let serviceApplyReasons = [];
                // 已完成YN, resultType=Y
                this.funcById_reasonsResultTypeYN.forEach(element => {
                    element.resultType = "Y";
                    serviceApplyReasons.push(element);
                });


                // 合併隱藏資料
                serviceApplyReasons.push(...this.serviceApplyReason_cancel);
                // 清空暫存區
                this.serviceApplyReason_cancel = [];

                // 更新TAB(依speakComponent找) 來電提示-有非本人來電記錄(IncomingCallAlertNotOwner), 證件影像(IdentificationImage), 核身話術(IdentityVerificationSentence)
                let IncomingCall = this.funcById_serviceSpeakTips.findIndex(element => element.speakComponent == "IncomingCallAlertNotOwner");
                let IdImage = this.funcById_serviceSpeakTips.findIndex(element => element.speakComponent == "IdentificationImage");
                let IdSentence = this.funcById_serviceSpeakTips.findIndex(element => element.speakComponent == "IdentityVerificationSentence");

                this.funcById_serviceSpeakTips[IncomingCall].speakContent = this.callRecords;
                this.funcById_serviceSpeakTips[IdImage].speakContent = this.idImage;
                this.funcById_serviceSpeakTips[IdSentence].speakContent = this.verifyTerms;

                // 關閉MODAL
                this.editServiceModalObj.hide();

                // 更新服務的核對項目、完成原因、未完成原因、話術
                (async () => {
                    try {
                        // NOTE! 此API資料以JSON傳送
                        const updateFuncApplyDataRes = await api.updateFuncApplyData({
                            "mainService": this.funcById_mainService,
                            "serviceIdentityItems": this.funcById_serviceIdentityItems,
                            "serviceApplyReasons": serviceApplyReasons,
                            "serviceSpeakTips": this.funcById_serviceSpeakTips
                        });

                        // 檢查回傳結果, 有誤提示訊息並中斷後續執行
                        if (functionUtil.apiResponseError(updateFuncApplyDataRes)) {
                            return;
                        };



                        // 取得所有服務
                        (async () => {
                            try {
                                const getAllFuncRes = await api.getAllFunc({
                                    isCancel: "N"
                                });

                                // 檢查回傳結果, 有誤提示訊息並中斷後續執行
                                if (functionUtil.apiResponseError(getAllFuncRes)) {
                                    return;
                                };

                                //   接收資料
                                this.allFunc = getAllFuncRes.funcMains;
                                this.allFuncRefresh(1);
                            }
                            catch (error) {
                                console.log(error);
                            }
                        })();
                    }
                    catch (error) {
                        console.log(error);
                    }
                })();

                // 清除現有資料
                this.clearVueData();

            },


            // 篩選"CANCEL"資料
            /*
               * 過濾不顯示資料
               * @param rawArray 原始陣列
               * @param canceledData 儲存不顯示資料陣列
               * @return filteredArray 要顯示之資料
            */
            filterCancel_Item(rawArray, canceledData) {
                let filteredArray = [];

                // cancel為取消顯示, N為啟用
                rawArray.forEach(e => {
                    if (e.cancel == 'N') {
                        filteredArray.push(e);
                    } else {
                        canceledData.push(e);
                    }
                });
                return filteredArray;
            }


        },
        mounted() {

            // // infoCode/editService Modal init
            // this.infoCodeMoalObj = new Modal(document.getElementById('infoCode'), {});
            this.editServiceModalObj = new Modal(document.getElementById('editServiceModal'), {});
            this.editServiceModal();
            // this.editServiceModalObj.show();
            // let editServiceModal = document.getElementById('editServiceModal');
            // let navList = document.querySelectorAll(".editServiceNav .nav-link");
            // let contentList = document.querySelectorAll(".infoModalContent .tab-pane");
            // editServiceModal.addEventListener('hidden.bs.modal', () => {

            //     // 主彈窗開啟時不重置頁籤
            //     if (editServiceModal.classList.contains('show')) {
            //         return
            //     };

            //     // remove all active class name
            //     navList.forEach(element => {
            //         element.classList.remove("active");
            //     });
            //     contentList.forEach(element => {
            //         element.classList.remove("active");
            //         element.classList.remove("show");
            //     });

            //     // active first element
            //     navList[0].classList.add("active");
            //     contentList[0].classList.add("active");
            //     contentList[0].classList.add("show");

            //     this.infoCodeData = [{
            //         "text": "服務代碼",
            //         "disabled": true,
            //         "opened": false,
            //         "children": []
            //     }];

            //     // 清除先前資料
            //     this.clearVueData();
            // })


        }

    }
</script>


<style scoped>
    @import '../assets/scss/director_common.css';

    /* 移至元件中使用  原CSS與AGD衝突 */
    .areaContent-large {
        height: 13rem;
    }
</style>