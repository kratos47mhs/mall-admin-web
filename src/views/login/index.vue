<template>
  <div>
    <el-card class="login-form-layout">
      <el-form :model="loginForm"
               :rules="loginRules"
               autoComplete="on"
               label-position="left"
               ref="loginForm">
        <div style="text-align: center">
          <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
        </div>
        <h2 class="login-title color-main">mall-admin-web</h2>
        <el-form-item prop="username">
          <el-input autoComplete="on"
                    name="username"
                    placeholder="Please Enter Username"
                    type="text"
                    v-model="loginForm.username">
          <span slot="prefix">
            <svg-icon class="color-main" icon-class="user"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    autoComplete="on"
                    name="password"
                    placeholder="Please Enter the Password"
                    v-model="loginForm.password">
          <span slot="prefix">
            <svg-icon class="color-main" icon-class="password"></svg-icon>
          </span>
            <span @click="showPwd" slot="suffix">
            <svg-icon class="color-main" icon-class="eye"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button :loading="loading" @click.native.prevent="handleLogin" style="width: 45%" type="primary">
            Log in
          </el-button>
          <el-button @click.native.prevent="handleTry" style="width: 45%" type="primary">
            Get experience account
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
    <el-dialog
      :center="true"
      :show-close="false"
      :visible.sync="dialogVisible"
      title="Public number QR code"
      width="30%">
      <div style="text-align: center">
        <span class="font-title-large"><span
          class="color-main font-extra-large">Pay attention to the public number</span>Reply<span
          class="color-main font-extra-large">Experience</span>Get experience account</span>
        <br>
        <img height="160" src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/banner/qrcode_for_macrozheng_258.jpg"
             style="margin-top: 10px" width="160">
      </div>
      <span class="dialog-footer" slot="footer">
    <el-button @click="dialogConfirm" type="primary">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate';
  import {getCookie, setCookie, setSupport} from '@/utils/support';
  import login_center_bg from '@/assets/images/login_center_bg.png'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('Please enter the correct username'))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('Password must be at least 3 characters'))
        } else {
          callback()
        }
      };
      return {
        loginForm: {
          username: '',
          password: '',
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePass}]
        },
        loading: false,
        pwdType: 'password',
        login_center_bg,
        dialogVisible: false,
        supportDialogVisible: false
      }
    },
    created() {
      this.loginForm.username = getCookie("username");
      this.loginForm.password = getCookie("password");
      if (this.loginForm.username === undefined || this.loginForm.username == null || this.loginForm.username === '') {
        this.loginForm.username = 'admin';
      }
      if (this.loginForm.password === undefined || this.loginForm.password == null) {
        this.loginForm.password = '';
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            // let isSupport = getSupport();
            // if(isSupport===undefined||isSupport==null){
            //   this.dialogVisible =true;
            //   return;
            // }
            this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false;
              setCookie("username", this.loginForm.username, 15);
              setCookie("password", this.loginForm.password, 15);
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('Parameter validation is invalid！');
            return false
          }
        })
      },
      handleTry() {
        this.dialogVisible = true
      },
      dialogConfirm() {
        this.dialogVisible = false;
        setSupport(true);
      },
      dialogCancel() {
        this.dialogVisible = false;
        setSupport(false);
      }
    }
  }
</script>

<style scoped>
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;
  }

  .login-title {
    text-align: center;
  }

  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
</style>
