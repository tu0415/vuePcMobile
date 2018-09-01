<template>
  <div id="content">
    <div class="redEnvelopes view">
      <div class="redEnvelopesBox">
        <div class="redTitle">
          <img src="../../assets/images/32know.png"/>
        </div>
        <div class="hadContent">
          <div class="contentList">
            <div class="contentArea" id="contentArea">
              {{this.money}}88.88
            </div>
            <div class="contentText">
              知力
            </div>
            <img src="../../assets/images/group5.png"/>
            
          </div>
          <div class="contentBtn" @click="go32know">
            去32know查看余额
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import indexApi from "../../api/indexApi";
import Utils from "../../utils/format";

export default {
    props: {
        money: ""
    },
    data() {
        return {};
    },
    methods: {
        go32know() {
            // window.location.href = 'https://32know.com';
            window.location.href =
                "http://a.app.qq.com/o/simple.jsp?pkgname=com.threetwoknow.news";
        }
    },
    created() {},
    mounted() {
        var moneyLeft = this.money.length * 15 / 4;
        document.getElementById("contentArea").style.marginLeft = "-" + moneyLeft + "%";
        //  document.querySelector("html").style.fontSize =  window.screen.height / 3  + "px";
    }
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
    padding: 0.1rem 0 0;
    background: url(../../assets/images/bg.png) no-repeat;
    background-size: 100%;
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
}
.redTitle {
    margin: .74rem auto 0;
    /*background: url(../../assets/images/receive_coin.png) no-repeat;*/
    background-size: 100%;
    img {
        padding: 0px 50px;
        width: 100%;
    }
}
.hadContent {
    /*margin: .74rem auto 0;*/
    /*background: url(../../assets/images/group5.png) no-repeat;*/
    background-size: 100%;
    position: relative;
    img {
        width: 100%;
    }
}
.contentArea {
    position: absolute;
    // top: 5rem;
    // top: 51.5%;
    top: 60%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-size: 15vw;
    color: #f8e71c;
    padding-left: 7vw;
    padding-right: 7vw;
    padding-top: 20px;
    padding-bottom: 20px;
}

.contentText {
    position: absolute;
    // top: 63%;
    top:73%;
    left: 50%;
    margin-left: -5%;
    font-size: 5vw;
    color: #fff;
}
.contentBtn {
    position: absolute;
    top: 86%;
    left: 50%;
    // margin-left: -30%;
    transform: translateX(-50%);
    text-align: center;
    border: 0.1vw solid #fff;
    border-radius: 0.04vw;
    color: #fff;
    font-size: 5vw;
    padding-left: 7vw;
    padding-right: 7vw;
    padding-top: 20px;
    padding-bottom: 20px;
    cursor: pointer;
}
</style>
