<template>
  <div>
    <div class="info-header">
      <a-upload name="skin" :showUploadList="false" :action="skinUrl" :headers="headers" :before-upload="uploadSkin" @change="skinChange">
        <a-button type="primary" :disabled="upload"> 上传主题 </a-button>
      </a-upload>
    </div>
    <div class="skin-list">
      <div class="skin-card" v-for="(item, index) in skins" :key="index">
        <div class="card-content">
          <p class="title">{{ item.name }}</p>
          <div class="img">
            <img :src="item.cover" alt="主题" />
          </div>
          <div class="skin-btn">
            <a-button @click="showDetails(index)">详细信息</a-button>
            <a-button type="primary" @click="apply(item.file_name)">应用主题</a-button>
          </div>
        </div>
      </div>
    </div>
    <a-modal v-model="visible" title="主题信息">
      <table class="info-card">
        <tr v-if="details.cover">
          <td>效果：</td>
          <td>
            <img class="details-img" :src="details.cover" />
          </td>
        </tr>
        <tr>
          <td>版本：</td>
          <td>{{ details.version }}</td>
        </tr>
        <tr>
          <td>作者：</td>
          <td>{{ details.author }}</td>
        </tr>
        <tr>
          <td>简介：</td>
          <td class="desc">{{ details.desc }}</td>
        </tr>
      </table>
      <template slot="footer">
        <a-button type="primary" @click="deleteClick(details.file_name)">删除</a-button>
        <a-button type="primary" @click="visible=false">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import storage from "@/utils/stored-data.js";
import { SkinURL } from "@/utils/request.js";
import { getSkinList, deleteSkin, applySkin } from "@/api/config-api";
export default {
  data() {
    return {
      upload: false,//是否禁用上传
      details: {},
      skins: [],
      visible: false,
      skinUrl: SkinURL,
      headers: {
        Authorization: "Bearer " + storage.get("admin"),
      },
    };
  },
  methods: {
    getDataList() {
      getSkinList().then((res) => {
        if (res.data.code === 2000) {
          this.skins = res.data.data.skins;
        }
      })
    },
    deleteClick(name){
      deleteSkin(name).then((res) => {
        if (res.data.code === 2000) {
          this.$message.success("删除成功");
          this.getDataList();
          this.visible = false;
        }
      })
    },
    apply(name) {
      applySkin(name).then((res) => {
        if (res.data.code === 2000) {
          this.$message.success("设置成功");
        }
      })
    },
    uploadSkin(file) {
      const isZIP =
        file.type === "application/x-zip-compressed";
      if (!isZIP) {
        this.$message.error("格式只能是jzip格式");
      }
      return isZIP;
    },
    skinChange(info) {
      const status = info.file.status;
      if (status === "done") {
        this.getDataList();
        this.$message.success("上传完成");
      } else if (status === "error") {
        this.$message.error("文件上传失败");
      }
    },
    showDetails(index) {
      this.details = this.skins[index];
      this.visible = true;
    }
  },
  created() {
    this.getDataList();
  }
};
</script>

<style lang="less" scoped>
.info-header{
  height: 50px;
  button{
    margin-top: 8px;
    width: 100px;
  }
}

.skin-list {
  display: flex;
  flex-wrap: wrap;
  .skin-card {
    width: 280px;
    height: 260px;
    margin: 10px 20px;
    border-radius: 10px;
    box-shadow:2px 2px 10px #909090;
    .title {
      font-size: 20px;
      text-align: center;
      margin: 10px 0;
    }
    .img {
      width: 100%;
      height: 160px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .skin-btn {
      display: flex;
      margin: 0 10px;
      height: 50px;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.info-card {
  width: 100%;
  background: #fff;
  border-collapse: collapse;
  font-size: 14px;
  .etails-img {
    width: 120px;
    height: 60px;
  }
  .desc {
    width: 120px;
    word-wrap: break-word;
  }
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
      }
    }
  }
}
</style>