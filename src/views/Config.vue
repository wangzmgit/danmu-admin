<template>
  <div>
    <a-tabs default-active-key="1" @change="tabChange">
      <a-tab-pane key="1" tab="OSS配置">
        <a-form-model ref="ossForm" :model="oss" :rules="oss.storage?ossRules:localRules" :label-col="{span:4,offset:1}" :wrapper-col="{span:15,offset:1}">
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
        <a-form-model ref="emailForm" :model="email" :rules="rules" :label-col="{span:4,offset:1}" :wrapper-col="{span:15,offset:1}">
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
        <a-form-model ref="adminForm" :model="admin" :rules="adminRules" :label-col="{span:4,offset:1}" :wrapper-col="{span:15,offset:1}">
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
    </a-tabs>
  </div>
</template>

<script>
import { getOssConfig, getEmailConfig } from "@/api/config-api.js";
import { setOssConfig, setEmailConfig, setAdminConfig }  from "@/api/config-api.js";
export default {
  data() {
    return {
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
      ossRules: {
        bucket: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        endpoint: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        accesskeyId: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        accesskeySecret: [{ required: true, message: "该项为必填项", trigger: "blur" }],
      },
      localRules: {},
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
      }
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
    }
  },
  created() {
    this.getOss();
  }
};
</script>

<style>
</style>