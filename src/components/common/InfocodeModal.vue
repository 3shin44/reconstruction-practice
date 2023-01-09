<template>
    <div class="infocode-modal">
        <!-- info360 服務代碼 -->
        <!-- 完成原因 info360 服務代碼 modal -->
        <div class="modal fade" id="infoCode" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">服務代碼</h5>
                        <button type="button" class="btn-close" @click="infoCodeMoalObj.hide()"></button>
                    </div>
                    <div class="modal-body">
                        <h3>WEEEEEEE</h3>
                        <!-- <v-jstree :data="infoCodeSource" :collapse="treeCollapse" @item-click="selectInfoCode"
                            show-checkbox multiple allow-batch whole-row>
                        </v-jstree> -->
                    </div>
                    <div class="modal-footer">
                        <!-- <button type="button" class="btn btn-primary" @click="updateInfoCode(currentItem)">
                            <i class="fa-solid fa-check"></i> 確認
                        </button> -->
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
        name: "InfocodeModal",
        components: {
            VJstree
        },
        props: {
            isShow: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                modalObj: null
            }
        },
        methods: {

        },
        mounted(){
            this.modalObj = new Modal(document.getElementById('infoCode'), {})
        },
        watch:{
            isShow: function(value){
                if(value){
                    this.modalObj.show()
                }else{
                    this.modalObj.hide()
                }
            }
        }
    });
</script>

<style scoped>

</style>