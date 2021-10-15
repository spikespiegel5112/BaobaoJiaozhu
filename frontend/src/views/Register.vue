<template>
  <div class="register_container">
    <div class="maincontent">
      <el-form autoComplete="on" :model="formData" :rules="rules" ref="formData" label-position="right">
        <h3 class="title">注册</h3>
        <el-form-item prop="loginName">
          <el-input type="text" v-model="formData.loginName" autoComplete="on" placeholder="username">
            <span class="iconfont icon-user" slot="prefix"> </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :type="pwdType" @keyup.enter.native="handleLogin" v-model="formData.password" autoComplete="on" placeholder="password">
            <span class="iconfont icon-user" slot="prefix"> </span>
            <span slot="suffix" @click="showPwd" class="iconfont icon-user"> </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="passwordAgain">
          <el-input :type="pwdType" @keyup.enter.native="handleLogin" v-model="formData.passwordAgain" autoComplete="on" placeholder="password">
            <span class="iconfont icon-user" slot="prefix"> </span>
            <span slot="suffix" @click="showPwd" class="iconfont icon-user"> </span>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleRegister" style="width:100%">
            Register
          </el-button>
        </el-form-item>
        <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: admin</span>
      </div> -->
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        callback();
      }
    };
    const validatePasswordAgain = (rule, value, callback) => {
      if (value === this.formData.password) {
        callback();
      } else {
        callback(new Error('两次密码需要一致'));
      }
    };
    return {
      userInfoRequest: 'uaa/user',
      loginRequest: 'uaa/oauth/token',
      userResgisterRequest: 'user/register',
      formData: {
        loginName: '',
        password: '',
        passwordAgain: ''
      },
      rules: {
        username: [{ required: true, trigger: 'change' }],
        password: [{ required: true, trigger: 'change', validator: validatePass }],
        passwordAgain: [{ required: true, trigger: 'change', validator: validatePasswordAgain }]
      },
      loading: false,
      pwdType: 'password'
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = '';
      } else {
        this.pwdType = 'password';
      }
    },
    handleLogin() {
      this.$router.push({
        name: 'login'
      });
    },
    handleRegister() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.$http
            .post(this.$baseUrl + this.userResgisterRequest, {
              loginName: this.formData.loginName,
              password: this.formData.password
            })
            .then(response => {
              console.log(response);
              this.$message.success('注册成功');
            })
            .catch(error => {
              console.log(error);
              this.$message.error(error.data.message);
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.register_container {
  padding: 120px 0;
  width: 100%;
  min-height: 100vh;
  position: relative;
  text-align: right;
  background: url('../assets/img/register.jpg');
  background-position: top center;
  .maincontent {
    display: inline-block;
    margin: 0 100px 0 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    background-color: rgba($color: #fff, $alpha: 0.1);
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
    color: #fff;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
