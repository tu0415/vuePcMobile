<template>
  <div class="dialog" v-show="showMask" >
    <div class="dialog-container">
      <div class="dialog-title">{{ title }}</div>
      <div class="content">
        <div class="loginContent">
          <div class="telephone">
            <input type="text" class="telephoneInput" v-model="phone" readonly placeholder="手机号"/>
          </div>
          <div class="code clear">
            <input type="text" class="codeInput fl" v-model="code" placeholder="验证码"/>
            <span v-if="countDown" class="codeInfo fr" @click="getCodeEvt">{{ codeText }}</span>
            <span v-else class="codeInfo redColor fr">{{ timeSixty }}</span>
          </div>
          <div class="password">
            <input type="password" class="passwordInput" v-model="password" placeholder="交易密码"/>
          </div>
          <div class="password">
            <input type="password" class="passwordInput" v-model="commitpassword" placeholder="确认交易密码"/>
          </div>
          <div class="loginBtnBox">
            <a href="javascript:;" class="loginBtn" @click="updateTransactionPassword">确认</a>
          </div>
        </div>
      </div>
      <div class="close-btn" @click="closeMask"><i class="el-dialog__close el-icon el-icon-close"></i></div>
    </div>
  </div>
</template>
<script>
  import indexApi from "../../api/indexApi"

  export default {
    props: {
      value: {},
      phone:'',
      title:'',
      userId:''
    },
    data(){
      return{
        showMask: false,
        codeText: '发送验证码',
        timeSixty: 60,
        countDown: true,
        code:'',
        password:'',
        commitpassword:''
      }
    },
    methods:{
      closeMask(){
        this.showMask = false;
      },
      closeBtn(){
        this.$emit('cancel');
        this.closeMask();
      },
      getCodeEvt() {
        let timer = null;
        if (this.countDown) {
          this.countDown = false;
          timer = window.setInterval(() => {
            this.timeSixty -= 1;
            if (this.timeSixty <= 0) {
              this.resetCodeEvt('overTimer', timer);
            }
          }, 1000);
          indexApi.getWalletCode({
            phone: this.phone
          }).then(d => {
            if (d.code == '0') {
              this.$showSuccessMessage('验证码发送成功');
              if (this.timeSixty <= 0) {
                this.resetCodeEvt('successTimer', timer);
              }
            } else {
              this.$showErrorMessage(d.reason)
              this.resetCodeEvt('errorTimer', timer);
            }
          }).catch(err => {
            this.$showErrorMessage(err)
            this.resetCodeEvt('errorTimer', timer);
          })
        }
      },
      resetCodeEvt(type, timer) {
        this.timeSixty = 60;
        this.countDown = true;
        if (type == 'overTimer' || type == 'successTimer') {
          this.codeText = '发送验证码';
        } else if (type == 'errorTimer') {
          this.codeText = '重新发送';
        }
        window.clearInterval(timer)
      },
      updateTransactionPassword(){
        if (this.code == '') {
          this.$showErrorMessage('验证码不能为空!')
          return false
        }
        if (this.password == '') {
          this.$showErrorMessage('密码不能为空!')
          return false
        }
        if (this.commitpassword == '') {
          this.$showErrorMessage('确认密码不能为空!')
          return false
        }
        if(this.password != this.commitpassword){
          this.$showErrorMessage('两次输入密码不一致!')
          return false
        }
        indexApi.updateTransactionPassword({
          mobile: this.phone,
          code: this.code,
          userId: this.userId,
          password: this.password
        }).then(d => {
          if (d.code == '0') {
            this.$showSuccessMessage('设置成功!');
            this.$emit('updateSetPassword');
            this.showMask = false;
            this.code = '';
            this.password = '';
            this.commitpassword = '';
          } else {
            this.$showErrorMessage(d.reason)
          }
        }).catch(err => {
          this.$showErrorMessage(err)
        })
      }
    },
    mounted(){
      this.showMask = this.value;
    },
    watch:{
      value(newVal, oldVal){
        this.showMask = newVal;
      },
      showMask(val) {
        this.$emit('input', val);
      }
    },
  }
</script>
<style lang="less" scoped>
  .dialog{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    /*z-index: 9999;*/
    .dialog-container{
      width: 500px;
      height: 450px;
      background: #ffffff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 8px;
      position: relative;
      .dialog-title{
        width: 100%;
        height: 60px;
        font-size: 18px;
        color: #696969;
        font-weight: 600;
        padding: 16px 50px 0 20px;
        box-sizing: border-box;
      }
      .content{
        color: #797979;
        line-height: 26px;
        padding: 0 20px;
        box-sizing: border-box;
        .loginContent {
          margin-top: 40px;
          .telephone {
            height: 40px;
            border: 1px solid #BDC0C8;
            margin-bottom: 20px;
            padding: 0 10px;
            .telephoneInput {
              width: 100%;
              height: 40px;
              border: none;
              line-height: 40px;
              display: block;
              font-size: 14px;
              cursor: pointer;
            }
          }
          .password {
            height: 40px;
            border: 1px solid #BDC0C8;
            margin-bottom: 20px;
            padding: 0 10px;
            .passwordInput {
              width: 100%;
              height: 40px;
              border: none;
              line-height: 40px;
              display: block;
              font-size: 14px;
              cursor: pointer;
            }
          }
          .code {
            height: 40px;
            border: 1px solid #BDC0C8;
            margin-bottom: 20px;
            padding-left: 10px;
            .codeInput {
              width: 60%;
              height: 40px;
              line-height: 40px;
              border: none;
              display: inline-block;
              font-size: 14px;
              cursor: pointer;
            }
            .codeInfo {
              height: 24px;
              line-height: 24px;
              display: inline-block;
              font-size: 14px;
              color: #3B84D1;
              border-left: 1px solid #BDC0C8;
              text-align: center;
              padding: 0 15px;
              margin: 8px 0;
              cursor: pointer;
            }
            .redColor {
              color: #ff0000;
            }
          }
          .loginBtnBox {
            width: 100%;
            height: 40px;
            margin-bottom: 10px;
            .loginBtn {
              width: 100%;
              display: block;
              background: #3B84D1;
              font-size: 14px;
              color: #FFFFFF;
              text-align: center;
              height: 40px;
              line-height: 40px;
            }
          }
          .serviceBox{
            margin-bottom: 20px;
            line-height: 20px;
          }
          .tipsContent{
            font-size: 12px;
            color: #D0021B;
          }
        }
      }
      .inp{
        margin: 10px 0 0 20px;
        width: 200px;
        height: 40px;
        padding-left: 4px;
        border-radius: 4px;
        border: none;
        background: #efefef;
        outline: none;
        &:focus{
          border: 1px solid #509EE3;
        }
      }
      .btns{
        width: 100%;
        height: 60px;
        // line-height: 60px;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: right;
        padding: 0 16px;
        box-sizing: border-box;
        & > div{
          display: inline-block;
          height: 40px;
          line-height: 40px;
          padding: 0 14px;
          color: #ffffff;
          background: #f1f1f1;
          border-radius: 8px;
          margin-right: 12px;
          cursor: pointer;
        }
        .default-btn{
          color: #787878;
          &:hover{
            color: #509EE3;
          }
        }
        .danger-btn{
          background: #EF8C8C;
          &:hover{
            background: rgb(224, 135, 135);
          }
          &:active{
            background: #EF8C8C;
          }
        }
        .confirm-btn{
          color: #ffffff;
          background: #509EE3;
          &:hover{
            background: #6FB0EB;
          }
        }
      }
      .close-btn{
        position: absolute;
        top: 16px;
        right: 16px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
        &:hover{
          font-weight: 600;
        }
      }
    }
  }
</style>
