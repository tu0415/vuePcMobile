<template>
  <div class="share">
    <div class="main view">
      <img src="../../assets/images/give_coin.png" class="shareTextImg"/>
      <div class="content">
        <div class="telephone">
          <input type="text" class="telephoneInput" v-model="telephone" placeholder="手机号"/>
        </div>
        <div class="code clear">
          <input type="hidden" id="ticket" name="ticket" value="">
          <div id="TCaptcha" style="" ></div>
          <input type="text" class="codeInput fl" v-model="code" placeholder="验证码"/>
          <span v-if="countDown" class="codeInfo fr" @click="getCodeEvt">{{ codeText }}</span>
          <span v-else class="codeInfo redColor fr">{{ timeSixty }}s</span>
        </div>
        <div class="login">
          <a href="javascript:;" @click="codeLoginEvt" class="loginBtn">立即领取</a>
        </div>
      </div>
      <img src="../../assets/images/group8.png" class="shareContentImg"/>
    </div>
  </div>
</template>
<script>
import indexApi from "../../api/indexApi";
import Utils from "../../utils/format";

export default {
    props: {
        userId: ""
    },
    // name: "bindPhone",
    data() {
        return {
            countDown: true,
            telephone: "",
            timeSixty: 60,
            codeText: "发送验证码",
            code: ""
        };
    },
    mounted() {
        document.querySelector("html").style.fontSize =  window.screen.height / 2.5  + "px";
        // document.querySelector("html").style.fontSize =  window.screen.width / 10  + "px";
        // let html = document.querySelector('html');
        // html.width > "768px" ? html.style.fontSize = "76.8px":html.style.fontSize=html.width / 10 + "px";
        indexApi
            .getVerifyJsUrl()
            .then(d => {
                if (d.code == "0") {
                    this.creatScript(d.data.url);
                } else {
                    this.$showErrorMessage(d.reason);
                }
            })
            .catch(err => {
                this.$showErrorMessage(err);
            });
    },
    methods: {
        //  点击发送验证码
        getCodeEvt() {
            if (
                this.telephone == "" ||
                !/^[1][3,4,5,7,8][0-9]{9}$/.test(this.telephone)
            ) {
                this.$showErrorMessage("请填写正确的手机号!");
                return false;
            }
            var capOption = {
                callback: this.cbfn,
                showHeader: false,
                type: "popup"
            };
            capInit(document.getElementById("TCaptcha"), capOption);
        },
        creatScript(src) {
            var oScript = document.createElement("script");
            oScript.src = src;
            document.getElementsByTagName("body")[0].appendChild(oScript);
        },
        // 回调函数：验证码页面关闭时回调
        cbfn(retJson) {
            if (retJson.ret == 0) {
                // 用户验证成功
                this.sendCodeEvt();
                // indexApi.verifyImageCode({
                //   ticket : retJson.ticket
                // }).then(d => {
                //   if (d.code == '0') {
                //     this.$emit('sendCodeEvt');
                //     this.showMask = false;
                //   }else{
                //     this.$showErrorMessage('验证失败！');
                //   }
                // }).catch(err => {
                //   this.$showErrorMessage(err)
                // });
            } else {
                //用户关闭验证码页面，没有验证
                this.$showErrorMessage("验证失败");
            }
        },

        sendCodeEvt() {
            let timer = null;
            if (this.countDown) {
                this.countDown = false;
                timer = window.setInterval(() => {
                    this.timeSixty -= 1;
                    // console.log(this);
                    if (this.timeSixty <= 0) {
                        this.resetCodeEvt("overTimer", timer);
                    }
                }, 1000);

                indexApi
                    .getCode({
                        telephone: this.telephone
                    })
                    .then(d => {
                        if (d.code == "0") {
                            this.$showSuccessMessage("验证码发送成功");
                            if (this.timeSixty <= 0) {
                                this.resetCodeEvt("successTimer", timer);
                            }
                        } else {
                            this.$showErrorMessage(d.reason);
                            this.resetCodeEvt("errorTimer", timer);
                        }
                    })
                    .catch(err => {
                        this.$showErrorMessage(err);
                        this.resetCodeEvt("errorTimer", timer);
                    })
                    .getCode({
                        telephone: this.telephone
                    })
                    .then(d => {
                        if (d.code == "0") {
                            this.$showSuccessMessage("验证码发送成功");
                            if (this.timeSixty <= 0) {
                                this.resetCodeEvt("successTimer", timer);
                            }
                        } else {
                            this.$showErrorMessage(d.reason);
                            this.resetCodeEvt("errorTimer", timer);
                        }
                    })
                    .catch(err => {
                        this.$showErrorMessage(err);
                        this.resetCodeEvt("errorTimer", timer);
                    });
            }
        },
        resetCodeEvt(type, timer) {
            this.timeSixty = 60;
            this.countDown = true;
            if (type == "overTimer" || type == "successTimer") {
                this.codeText = "发送验证码";
            } else if (type == "errorTimer") {
                this.codeText = "重新发送";
            }
            window.clearInterval(timer);
        },
        // 点击立即领取 验证手机号及验证码
        // 调取登录接口
        codeLoginEvt() {
            if (
                this.telephone == "" ||
                !/^[1][3,4,5,7,8][0-9]{9}$/.test(this.telephone)
            ) {
                this.$showErrorMessage("请填写正确的手机号!");
                return false;
            }
            if (this.code == "") {
                this.$showErrorMessage("验证码不能为空!");
                return false;
            }
            indexApi
                .register({
                    // .randomRedPacket ({
                    mobile: this.telephone,
                    code: this.code,
                    inviteUserId: this.userId
                })
                .then(d => {
                    if (d.code == "0") {
                        this.$showSuccessMessage("注册成功!");
                        if (d.data) {
                            Utils.setCookie(
                                "cur_dt",
                                Base64.encode(
                                    JSON.stringify({
                                        id: d.data.id,
                                        nickname: d.data.nickname,
                                        picture: d.data.picture,
                                        identification: d.data.identification,
                                        status: d.data.isAuthor
                                    })
                                ),
                                1
                            );
                        } else {
                            Utils.setCookie(
                                "cur_dt",
                                Base64.encode(JSON.stringify({})),
                                1
                            );
                        }
                        this.$router.push({
                            name: "registerRedPacket",
                            // url传参过去
                            params: {
                                mid: d.data.id
                            }
                        });
                    } else {
                        this.$showErrorMessage("您已注册过！");
                    }
                })
                .catch(err => {
                    this.$showErrorMessage(err);
                });
        }
    }
};
</script>


<style lang="less" scoped>
* {
    margin: 0 auto;
    font-size: 16px;
    box-sizing: border-box;
    background-color: #ffffff;
}
div {
    display: block;
}
input，textarea,
select,
button {
    -webkit-appearance: none;
    color: #666;
    font-family: inherit;
    font-weight: inherit;
    outline: none;
    background-color: white;
    -webkit-rtl-ordering: logical;
    cursor: text;
    text-rendering: auto;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    text-align: start;
    font: 400 13.3333px Arial;
}

.share {
    width: 100%;
    height: 100%;
    position: absolute;
}
.float-left {
    float: left;
}
.content {
    overflow: hidden;
    margin: 0 0.4rem;
}
.shareTextImg {
    margin: 0.35rem auto 0.22rem;
    display: block;
    height: 1.24rem;
    outline: none;
    border: none;
}
.content .telephone {
    height: 0.4rem;
    padding: 0.04rem 0.1rem;
    border: 0.01rem solid #bdc0c8;
}
.content .telephone input {
    height: 0.3rem;
    line-height: 0.3rem;
    display: block;
    width: 100%;
    border: none;
    font-size: 0.14rem;
}
.code {
    margin-top: 0.2rem;
    height: 0.4rem;
    padding: 0.04rem 0.1rem;
    border: 0.01rem solid #bdc0c8;
    margin-bottom: 20px;
    .codeInput {
        width: 58%;
        height: 0.3rem;
        line-height: 0.3rem;
        display: inline-block;
        font-size: 0.14rem;
        border: none;
    }
    .codeInfo {
        text-align: center;
        display: inline-block;
        margin: 0.05rem 0;
        padding: 0 0.05rem 0 0.1rem;
        border-left: 0.01rem solid #bdc0c8;
        height: 0.2rem;
        line-height: 0.2rem;
        font-size: 0.14rem;
        color: #3b84d1;
    }
    .redColor {
        color: #ff0000;
    }
}
.login {
    margin-top: 0.2rem;
    height: 0.4rem;
}
.login a {
    height: 0.4rem;
    line-height: 0.4rem;
    display: block;
    text-align: center;
    width: 100%;
    background: #3b84d1;
    font-size: 0.14rem;
    color: #fff;
}
.shareContentImg {
    margin: 0.33rem auto 0.19rem;
    display: block;
    height: 2.12rem;
    outline: none;
    border: none;
}
</style>

