<template>
  <div class="content">
    <div class="redEnvelopes view">
      <div class="redEnvelopesBox">
        <div class="redTitle">
          <img src="../../assets/images/receive_coin.png"/>
        </div>
        <div class="redContent">
          <img src="../../assets/images/group2.png"/>
          <div class="circle"  @click="randomRedPacketEvt"></div>
        </div>
        <!-- 已领取红包的提示 -->
         <el-button type="text" @click="dialogVisible = true" ></el-button>
            <el-dialog :visible.sync="dialogVisible" width="80%" :show-close="false" :top="'30vh'">
                <p class="title">ms.32Know.com</p>
                <p class="text">该账户已经领过红包</p>
                <p slot="footer" class="dialog-footer"  @click="dialogVisible = false">
                    OK
                </p>
          </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import indexApi from "../../api/indexApi";
import Utils from "../../utils/format";

export default {
    props: {
        mid: ""
    },
    data() {
        return {
            money: "0.0",
            dialogVisible: false
        };
    },
    methods: {
        // 抽取随机红包
        randomRedPacketEvt() {
            this.dialogVisible = true;
            //  发送请求
            const obj = {
                mid: this.mid
            };
            indexApi.randomRedPacket(obj).then(res => {
                // this.buttonShow = false;
                if (res.code == "0") {
                    this.money = res.data.rp;
                    this.$router.push({
                        name: "openRedPacket",
                        params: {
                            money: this.money
                        }
                    });
                } else if (res.code == "11012") {
                    //
                    this.dialogVisible = true;
                    alert("该账号已领取过红包");
                } else {
                    this.$showErrorMessage(d.reason);
                }
            });
        }
    },
    created() {},
    mounted() {}
};
</script>

<style lang="less" scoped>
* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    display: block;
    font-size: 16px;
}
.redEnvelopesBox {
    padding: 0.33rem 0 0;
    background: url(../../assets/images/bg.png) no-repeat;
    background-size: 100%;
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
}
.redTitle {
    /*margin: .74rem auto 0;*/
    /*background: url(../../assets/images/receive_coin.png) no-repeat;*/
    background-size: 100%;
    img {
        padding-left: 50px;
        padding-right: 50px;
        width: 100%;
    }
}
.redContent {
    /*margin: .74rem auto 0;*/
    /*background: url(../../assets/images/group2.png) no-repeat;*/
    background-size: 100%;
    position: relative;
    img {
        width: 100%;
    }
    .circle {
        width: 16rem;
        height: 16rem;
        border-radius: 50%;
        position: absolute;
        top: 16%;
        left: 39%;
        z-index: 999;
        
    }
}
</style>
<style lang="less" scoped>
.el-dialog {
    border-radius: 30px;
    text-align: center;
    font-size: 38px;
    font-weight: 700;
}

.el-dialog__body {
    padding: 0 20.0025px;
    border-bottom: 3px solid;
    .title {
        font-size: 50.0025px;
        font-weight: 700;
        text-align: center;
    }
    .text {
        font-size: 37.5px;
        font-weight: 400;
        line-height: 80px;
        text-align: center;
    }
}
.el-dialog__footer {
    padding: 0;
    line-height: 90px;
    height: 90px;
    .dialog-footer {
       text-align: center;
       font-size:58px;
       color:#3d76c3;
       font-weight:700;
    }
}
</style>

