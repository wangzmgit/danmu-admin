<template>
  <div>
    <a-tabs default-active-key="1" @change="tabChange">
      <a-tab-pane key="1" tab="OSS配置">
        <a-form-model ref="ossForm" :model="oss" :rules="oss.storage?ossRules:{}" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="使用OSS存储">
            <a-switch v-model="oss.storage" @change="changeStorage"/>
          </a-form-model-item>
          <a-form-model-item label="存储空间(bucket)" prop="bucket">
            <a-input :disabled="!oss.storage" v-model="oss.bucket"></a-input>
          </a-form-model-item>
          <a-form-model-item label="存储区域(endpoint)" prop="endpoint">
            <a-input :disabled="!oss.storage" v-model="oss.endpoint" ></a-input>
          </a-form-model-item>
          <a-form-model-item label="accesskeyId" prop="accesskeyId">
            <a-input :disabled="!oss.storage" v-model="oss.accesskeyId"></a-input>
          </a-form-model-item>
          <a-form-model-item label="accesskeySecret" prop="accesskeySecret">
            <a-input :disabled="!oss.storage" v-model="oss.accesskeySecret"></a-input>
          </a-form-model-item>
          <a-form-model-item label="自定义域名(选填)" prop="domain">
            <a-input v-model="oss.domain" placeholder="http://example.com"></a-input>
          </a-form-model-item>
          <a-form-model-item >
            <a-button type="primary" @click="setOss()">保存</a-button>
          </a-form-model-item>              
        </a-form-model>
      </a-tab-pane>
      <a-tab-pane key="2" tab="邮箱配置" force-render>
        <a-form-model ref="emailForm" :model="email" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="发件人" prop="name">
            <a-input v-model="email.name" ></a-input>
          </a-form-model-item>
          <a-form-model-item label="主机" prop="host">
            <a-input v-model="email.host"></a-input>
          </a-form-model-item>
          <a-form-model-item label="端口" prop="port">
            <a-input v-model="email.port"></a-input>
          </a-form-model-item>
          <a-form-model-item label="邮箱地址(address)" prop="address">
            <a-input v-model="email.address"></a-input>
          </a-form-model-item>
          <a-form-model-item label="邮箱授权码" prop="password">
            <a-input v-model="email.password"></a-input>
          </a-form-model-item>
          <a-form-model-item >
            <a-button type="primary" @click="setEmail()">保存</a-button>
          </a-form-model-item>    
        </a-form-model>
      </a-tab-pane>
      <a-tab-pane key="3" tab="重置管理员账号">
        <a-form-model ref="adminForm" :model="admin" :rules="adminRules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="邮箱" prop="email">
            <a-input v-model="admin.email" ></a-input>
          </a-form-model-item>
          <a-form-model-item label="密码" prop="adminPass">
            <a-input v-model="admin.password"></a-input>
          </a-form-model-item>
          <a-form-model-item >
            <a-button type="primary" @click="setAdmin()">保存</a-button>
          </a-form-model-item>  
        </a-form-model>  
      </a-tab-pane>
      <a-tab-pane key="4" tab="其他配置">
        <a-form-model  :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="编码类型">
            <a-radio-group v-model="other.coding" @change="changeCoding">
              <a-radio value="mp4"> mp4 </a-radio>
              <a-radio value="hls"> hls </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="最大分辨率">
            <a-radio-group v-model="other.maxRes" :disabled="other.coding === 'mp4'">
              <a-radio value="1080"> 1080P </a-radio>
              <a-radio value="720"> 720P </a-radio>
              <a-radio value="480"> 480P </a-radio>
              <a-radio value="360"> 360P </a-radio>
              <a-radio value="0"> 不处理分辨率 </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="导入视频所属用户ID">
            <div class="special-user">
              <a-input v-model="other.videoUser"></a-input>
              <a-button @click="viewUser(other.videoUser)">查看用户信息</a-button>
            </div>
          </a-form-model-item>
          <a-form-model-item >
            <a-button type="primary" @click="setOther()">保存</a-button>
          </a-form-model-item>  
        </a-form-model>  
      </a-tab-pane>
    </a-tabs>
    <!--查看用户信息-->
    <a-modal v-model="visibleUser" title="用户信息">
      <table class="info-card">
        <tr>
          <td>头像</td>
          <td>
            <a-avatar v-if="user.avatar" :size="50" :src="user.avatar" />
            <a-avatar v-else :size="80" icon="user" />
          </td>
        </tr>
        <tr>
          <td>昵称</td>
          <td>{{ user.name }}</td>
        </tr>
        <tr>
          <td>UID</td>
          <td>{{ user.uid }}</td>
        </tr>
        <tr>
          <td>个性签名</td>
          <td>{{ user.sign }}</td>
        </tr>
      </table>
      <template slot="footer">
        <a-button type="primary" @click="visibleUser=false">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { getUserByID } from "@/api/user.js";
import { getOssConfig, getEmailConfig, getOtherConfig } from "@/api/config-api.js";
import { setOssConfig, setEmailConfig, setAdminConfig, setOtherConfig }  from "@/api/config-api.js";
export default {
  data() {
    return {
      user: {},
      labelCol: {span:4,offset:1},
      wrapperCol: {span:15,offset:1},
      visibleUser: false,//显示用户信息对话框
      oss:{
        storage: true,
        bucket: "",
        endpoint: "oss-cn-beijing.aliyuncs.com",
        accesskeyId: "",
        accesskeySecret: "",
        domain: "",
      },
      email: {
        name: "弹幕网站admin",
        host: "smtp.163.com",
        port: 465,
        address: "",
        password:"",
      },
      admin: {
        email: "",
        password: "",
      },
      other: {
        coding: "0",
        maxRes: "hls",
        videoUser: 0,
      },
      ossRules: {
        bucket: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        endpoint: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        accesskeyId: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        accesskeySecret: [{ required: true, message: "该项为必填项", trigger: "blur" }],
      },
      rules: {
        name: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        host: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        port: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        address: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        password: [{ required: true, message: "该项为必填项", trigger: "blur" }],
      },
      adminRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    }
  },
  methods:{
    tabChange(tab){
      switch(tab){
        case "1":
          this.getOss();
          break;
        case "2":
          this.getEmail();
          break;
        case "4":
          this.getOther();
          break;
      }
    },
    getOss() {
      getOssConfig().then((res) =>{
        this.oss = res.data.data;
      })
    },
    changeStorage(val){
      if (!val) {
        this.$notification.open({
          message: '注意事项',
          description: "使用本地存储模式，自定义域名为必填项",
        });
      }
    },
    setOss() {
      this.$refs.ossForm.validate((valid) => {
        if (valid) {
          setOssConfig(this.oss).then((res) =>{
            if(res.data.code === 2000){
              this.$message.success("设置成功");
            }
          })
        } else {
          this.$message.error("请检查输入的数据");
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    setEmail(){
      this.$refs.emailForm.validate((valid) => {
        if (valid) {
          setEmailConfig(this.email).then((res) =>{
            if(res.data.code === 2000){
              this.$message.success("设置成功");
            }
          })
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    getEmail() {
      getEmailConfig().then((res) =>{
        this.email = res.data.data;
      })
    },
    setAdmin() {
      this.$refs.adminForm.validate((valid) => {
        if (valid) {
          setAdminConfig(this.admin).then((res) =>{
            if(res.data.code === 2000){
              this.$message.success("设置成功");
            }
          })
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    getOther() {
      getOtherConfig().then((res) =>{
        this.other.coding = res.data.data.coding;
        this.other.maxRes = res.data.data.max_res + "";
        this.other.videoUser = res.data.data.video_user;
      })
    },
    changeCoding(val) {
      if (val.target.value === "mp4") {
        this.other.maxRes = "0";
      }
    },
    //设置其他配置信息
    setOther() {
      setOtherConfig(this.other).then((res) =>{
            if(res.data.code === 2000){
              this.$message.success("设置成功");
            }
          })
    },
    //查看用户信息
    viewUser(uid){
      getUserByID(uid).then((res) => {
        if (res.data.code === 2000) {
          this.user = res.data.data.user;
          this.visibleUser = true;
        }
      })
    },
  },
  created() {
    this.getOss();
  }
};
</script>

<style lang="less" scoped>
.special-user {
  input {
    width: 120px;
  }

  button {
    margin-left: 20px;
  }
}

.info-card {
  width: 100%;
  background: #fff;
  border-collapse: collapse;
  font-size: 14px;
  tr {
    td {
      padding: 10px 0;
      &::nth-child(1) {
        padding-left: 12px;
        text-align: left;
        color: #505050;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      &:nth-child(2) {
        padding-right: 12px;
        text-align: right;
        color: #999;
        max-width: 40%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>