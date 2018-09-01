<template>
	<div class="list">
    <div class="title">提币<a href="#">提币规则</a></div>
    <div class="content" v-show="!openFunction">
      此功能暂未开放!
    </div>
		<div class="content" v-show="openFunction">
      <el-form>
        <el-form-item class="formItem" label-width="120px" label="余额: ">
          <el-tag>{{ walletData.bill }}</el-tag>
        </el-form-item>
        <el-form-item class="formItem" label-width="120px" label="单位: ">
          <el-tag>KFC(Knowledge Force Coin)</el-tag>
        </el-form-item>
        <el-form-item class="formItem" label-width="120px" label="YOYOW账号: " >
          <el-tag v-show="isbinding">{{walletData.yoyowAccount}}</el-tag>
          <input v-show="!isbinding" v-model="walletData.yoyowAccount" />
          <a v-show="!isbinding" href="https://wallet.yoyow.org/#/create-account" target="_Blank">我还没有yoyow账号</a>
          <a v-show="isbinding" href="javascript:;" target="_Blank" @click="openMask">解绑yoyow账号</a>
        </el-form-item>
        <el-form-item class="formItem" label-width="120px" label="提币数: ">
          <input v-model="coin" v-on:input="checkCoin" /><span>（此次提取最大值：{{ walletData.availableCoin }} 知力）</span>
        </el-form-item>
        <el-form-item class="formItem" label-width="120px" label="交易密码: ">
          <input type="password" v-show="hasTransactionPassword" v-model="password"/>
          <a href="javascript:;" v-show="hasTransactionPassword" @click="openPwdDialog(1)">忘记交易密码</a>
          <a href="javascript:;" v-show="!hasTransactionPassword" @click="openPwdDialog(0)">设置交易密码</a>
        </el-form-item>
      </el-form>
      <div class="submitBox">
        <el-button type="primary" @click="drawingKFC">提取</el-button>
      </div>
		</div>
    <change-account-dialog v-model="sendVal" :phone.sync="walletData.phone" :userId.sync="userInfo.id" v-on:updateUntie="updateUntie"></change-account-dialog>
    <change-password-dialog v-model="showPwdDialog" :phone.sync="walletData.phone" :userId.sync="userInfo.id" :title.sync="pwdDialogTitle" v-on:updateSetPassword="updateSetPassword"></change-password-dialog>
	</div>
</template>

<script>
  import indexApi from "../../api/indexApi"
  import Utils from '../../utils/format'
  import {mapState} from 'vuex'
  import changeAccountDialog from './changeAccountDialog.vue'
  import changePasswordDialog from './changePasswordDialog.vue'

  export default {
		name: "forward",
    data: function () {
      return {
        walletData: {
          bill: '',
          cost: '',
          availableCoin: '',
          phone: '',
          yoyowAccount: '',
          transactionPassword: ''
        },
        password:'',
        coin:'',
        sendVal: false,
        pwdDialogTitle: '',
        showPwdDialog: false,
        isbinding:true,
        hasTransactionPassword:false,
        openFunction:false
      }
    },
    components:{
      'change-account-dialog': changeAccountDialog,
      'change-password-dialog': changePasswordDialog
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    mounted() {
      this.getWalletData();
      if(this.userInfo.id == 6){
        this.openFunction = true;
      }
    },
    methods: {
      getWalletData() {
        indexApi.getWalletInfo({
          userId: this.userInfo.id
        }).then(d => {
          if (d.code == '0') {
            if (d.data) {
              this.walletData = Object.assign({}, d.data)
              this.isbinding = this.walletData.yoyowAccount != '';
              this.hasTransactionPassword = this.walletData.transactionPassword == 1;
            }
          }
        }).catch(err => {
          this.$showErrorMessage(err)
        })
      },
      checkCoin(event){
        this.coin = event.target.value.replace(/[^\d|^\.]/g,'');
        if(this.coin.indexOf('.') > -1 && this.coin.length - this.coin.indexOf('.') >= 2){
          this.coin = parseFloat(this.coin).toFixed(2)
        }
        if(this.coin > parseFloat(this.walletData.availableCoin)){
          this.coin = this.walletData.availableCoin;
        }
      },
      drawingKFC(){
        if (this.coin == '') {
          this.$showErrorMessage('请输入提取知力数!')
          return false
        }
        if (this.password == '') {
          this.$showErrorMessage('请输入交易密码!')
          return false
        }
        indexApi.drawingKFC({
          mobile: this.walletData.phone,
          userId: this.userInfo.id,
          password: this.password,
          coin:this.coin,
          yoyowAccount: this.walletData.yoyowAccount
        }).then(d => {
          if (d.code == '0') {
            this.$showSuccessMessage('提取成功!');
            this.coin = '';
            this.password = '';
            this.getWalletData();
          } else {
            this.$showErrorMessage(d.reason)
          }
        }).catch(err => {
          this.$showErrorMessage(err)
        })
      },
      openMask(index){
        this.sendVal = true;
      },
      openPwdDialog(openType){
        if(openType == 1){
          this.pwdDialogTitle = '重置交易密码';
        }else {
          this.pwdDialogTitle = '设置交易密码';
        }
        this.showPwdDialog = true;
      },
      updateUntie(){
        this.walletData.yoyowAccount = "";
        this.isbinding = false;
      },
      updateSetPassword(){
        this.hasTransactionPassword = true;
      }
    }
	}
</script>

<style lang="less" scoped>
	.list {
		width: 100%;
		.title {
			width: 100%;
			font-size: 20px;
			color: #4A505A;
			padding-bottom: 20px;
			border-bottom: 1px solid #E7E7E7;
		}
    .title a{
      margin-left: 10px;
      color: #9b9b9b;
      font-size: 12px;
      text-decoration: underline;
    }
		.content {
			margin-top: 20px;
			text-align: center;
			font-size: 20px;
			color: #000000;
		}
	}
  .formItem{
    margin-top: 20px;
    text-align: left;
  }
  .formItem input{
    margin-left: 20px;
    width: 113px;
    border: 0px;
    border-bottom: 1px;
    border-color: black;
    border-bottom-style: inset;
  }
  .formItem a{
    margin-left: 20px;
    text-decoration: underline;
  }
  .formItem span{
    margin-left: 20px;
  }
  .submitBox{
    text-align: left;
    margin-left: 140px;
  }
</style>>
