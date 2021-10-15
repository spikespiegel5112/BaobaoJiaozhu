<template>
  <div class="login_container">
    <div class="maincontent">
      <el-form autoComplete="on" :model="formData" :rules="rules" ref="formData" label-position="right">
        <h3 class="title">
          趣谷
          <div class="common_environmenthint_item" v-if="$prodEnv">
            测试环境
          </div>
        </h3>

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
        <el-form-item>
          <el-button type="primary" :loading="loading" @click.native.prevent="handleLogin" style="width:100%">
            Sign in
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" @click="handleRegister" style="width:100%">
            Register
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      userInfoRequest: 'uaa/user',
      userLoginRequest: 'user/login',
      formData: {
        loginName: '',
        password: ''
      },
      rules: {
        loginName: [{ required: true, trigger: 'change' }],
        password: [{ required: true, trigger: 'change' }]
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
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.$http
            .post(this.$baseUrl + this.userLoginRequest, this.formData)
            .then(response => {
              console.log(response);
              this.$router.push({ path: '/' });
            })
            .catch(error => {
              console.log(error);
              this.$message.error(error.data.message);
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleRegister() {
      this.$router.push({
        name: 'Register'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login_container {
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
