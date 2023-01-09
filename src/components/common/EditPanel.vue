<template>
    <div class="edit-panel">
        <div class="btnContainer">
            <button class="btn btn-outline-secondary" style="margin-right: 5px" @click="addItem">
                <i class="fa-solid fa-plus"></i> 新增
            </button>
            <button class="btn btn-outline-secondary" @click="removeItem">
                <i class="fa-solid fa-trash-can"></i> 刪除
            </button>
        </div>
        <div>
            <table class="table table-hover table-bordered">
                <thead>
                    <tr role="row">
                        <th class="middle text-center table-active">
                            <input type="checkbox" v-model="isSelectAll" @change="checkSelectAll">
                        </th>
                        <th class="middle text-center table-active">ID</th>
                        <th class="middle text-center table-active">完成原因</th>
                        <th class="middle text-center table-active">Info360服務代碼</th>
                        <th class="middle text-center table-active">排序</th>
                        <th class="middle text-center table-active">功能</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in availableData" :key="index">
                        <td class="text-center align-middle">
                            <input type="checkbox" v-model="selectedList" group="selectedList" :value="item.sort">
                        </td>
                        <td class="text-start align-middle idSn">
                            {{ item.sort }}
                        </td>
                        <td class="text-start align-middle">
                            <input class="form-control" type="text" v-model="item.reason" :disabled="item.lock">
                        </td>
                        <td class="text-center align-middle">
                            <button class="btn btn-outline-secondary" :disabled="item.lock"
                                @click="infoCodeModal(item)">
                                <i class="fa-solid fa-gears"></i>
                            </button>
                        </td>
                        <td class="text-center align-middle">
                            <button class="btn btn-outline-secondary up" :disabled="item.lock"
                                @click="moveElement(index, 'upward')" style="margin-right: 5px">
                                <i class="fa-solid fa-arrow-up"></i>
                            </button>
                            <button class="btn btn-outline-secondary down" :disabled="item.lock"
                                @click="moveElement(index, 'downward')">
                                <i class="fa-solid fa-arrow-down"></i>
                            </button>
                        </td>
                        <td class="text-center align-middle">
                            <button class="editButton" @click="editableSwitch(index)">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- info360 服務代碼 -->
        <!-- 完成原因 info360 服務代碼 modal -->
        <div class="modal fade component-bcg" :id="domId" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog edit-panel-modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">服務代碼</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <v-jstree :data="infoCodeData" :collapse="treeCollapse" @item-click="selectInfoCode"
                            show-checkbox multiple allow-batch whole-row>
                        </v-jstree>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="updateInfoCode(currentItem)">
                            <i class="fa-solid fa-check"></i> 確認
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
    import { Modal } from 'bootstrap'
    import VJstree from 'vue-jstree'

    export default ({
        name: "EditPanel",
        components: {
            VJstree,
        },
        props: {
            domId:{
                Type: String,
                default: "modal"
            },
            sourceData: {
                type: Array,
                default: () => []
            },
            infoCodeSource: Object
        },
        data() {
            return {
                // 完成原因YN: 全選狀態, 已選編號
                isSelectAll: false,
                // 可編輯資料
                availableData: [],
                // 已選編號
                selectedList: [],
                // 被取消資料
                canceledData: [],

                // infoCode360 服務代碼
                infoCodeMoalObj: null,
                infoCodeRaw: null,
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

                modalObj: null
            }
        },
        methods: {
            // 更新現有資料: 更新:可編輯資料&被取消資料
            // 處理流程: 
            // 1. 更新: 分離可編輯與被取消資料 
            // 2. 更新: 已預設編號排序, 排序後賦予新編號
            // 3. 檢查: 鎖定KEY
            // output: 直接更新於 availableData, canceledData
            updateCurrentData() {
                // 1. 更新: 分離可編輯與被取消資料
                let tempAvail = [];
                let tempCancel = [];
                tempCancel = this.canceledData;
                this.availableData.forEach(item => {
                    if (item.cancel == 'N') {
                        tempAvail.push(item);
                    } else {
                        tempCancel.push(item);
                    }
                })
                this.availableData = tempAvail;
                this.canceledData = tempCancel;

                // 2. 更新: 已預設編號排序, 排序後賦予新編號
                this.availableData.sort((a, b) => {
                    return a.sort - b.sort;
                });

                this.availableData.forEach((element, index) => {
                    element.sort = index + 1;
                });

                // 3. 檢查: 鎖定KEY
                this.availableData.forEach(element => {
                    if (!element.hasOwnProperty("lock")) {
                        element.lock = true
                    }
                });
            },

            // 完成原因 新增
            // 於已選清單中新增一筆資料
            addItem() {
                this.availableData.push({
                    "skey": null,
                    "reasonId": null,
                    "reason": null,
                    "resultType": "",
                    "api": "Y",
                    "textYN": "N",
                    "notPass": "N",
                    "dataId": "",
                    "sort": this.availableData.length + 1
                });
            },
            // 完成原因 刪除
            removeItem() {

                // 檢查每個元素sort是否被選取 已選更動cancel值, 加入"完成原因"標籤
                this.availableData.forEach(item => {
                    // 是否在勾選清單內, 不存在則加至暫存陣列
                    if (this.selectedList.includes(item.sort)) {
                        item.cancel = "Y";
                        item.resultType = "Y";
                    }
                });

                // 更新現有資料
                this.updateCurrentData();
                // 清空已選清單
                this.selectedList = [];
            },

            // 鎖定切換
            editableSwitch(index) {
                this.availableData[index].lock = !this.availableData[index].lock
                this.$forceUpdate();
            },

            /*
            * 陣列元素順序移動
            * @param index v-for渲染時產生之index值
            * @param array v-for使用之陣列
            * @param action 移動方向, 傳入參數為: 'upward', 'downward', 預設不動作
            */
            moveElement(index, action = "") {
                switch (action) {
                    case "upward":
                        // top element doesn't need move
                        if (index == 0) {
                            return;
                        };
                        // upward an element using es6 method
                        [this.availableData[index - 1], this.availableData[index]] = [this.availableData[index], this.availableData[index - 1]];
                        break;

                    case "downward":
                        // bottom element doesn't need move.
                        //  note array length minus 1 is the index of last element
                        if (index == this.availableData.length - 1) {
                            return;
                        };
                        // downward an element usgin es6 method
                        [this.availableData[index], this.availableData[index + 1]] = [this.availableData[index + 1], this.availableData[index]];
                        break;
                }

                // 依據現在位置更新SORT值
                this.availableData.forEach((element, index) => {
                    element.sort = index + 1;
                });

                // 更新表格
                this.$forceUpdate();
            },

            // 全選 全不選
            checkSelectAll() {
                if (this.isSelectAll) {
                    this.selectedList = [];
                    // 資料陣列中所有sort值加入選擇陣列
                    this.availableData.forEach(element => {
                        this.selectedList.push(element.sort)
                    });
                } else {
                    // dis select all
                    this.selectedList = [];
                }
            },

            // 服務代碼
            // 服務代碼MODAL開啟
            infoCodeModal(item) {
                // 清空先前已選代碼
                this.infoCodeList = [];
                // 更新目前編輯資料來源
                this.currentItem = item;

                // 更新 info360 Code, 
                this.updateTree(this.infoCodeSource);
                // 開啟燈箱
                this.modalObj.show();
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

            /*
            * 更新服務代碼樹資料
            * @param 後端接收到的原始資料
            */
            updateTree(res) {

                // 無資料時不更新
                if (res == null) {
                    return
                }
                this.infoCodeData= [{
                    "text": "服務代碼",
                    "opened": false,
                    "disabled": true,
                    "children": []
                }]

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


        },
        mounted(){
           this.modalObj = new Modal(document.getElementById(this.domId), {
            focus:true
           })
        },
        watch: {
            sourceData: function (data) {
                // 監聽傳入資料, 外層傳入即更新
                this.availableData = data;
                // 接收資料後交由元件處理後續業務
                this.updateCurrentData();
            },
            // watch is select all or not
            selectedList: function () {
                if (this.selectedList.length == this.availableData.length) {
                    this.isSelectAll = true
                } else {
                    this.isSelectAll = false
                }
            }
        }
    });
</script>

<style scoped>
    .component-bcg{
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1057;
    }
      
    .edit-panel-modal-sm{
        top: 25%;
        width: 50% !important;
    }
</style>