<template>
  <div class="bg">
    <div v-if="!resource.vid" class="opinion-card info">
      <div class="title">
        <p>导入视频</p>
      </div>
      <a-form-model ref="video" :model="video" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="标题" prop="title">
          <a-input v-model="video.title" />
        </a-form-model-item>
        <a-form-model-item label="封面URL" prop="cover">
          <div class="upload">            
            <a-input v-model="video.cover"></a-input>
            <a-upload name="cover" :showUploadList="false" :action="cover" :headers="headers" :before-upload="uploadCover" @change="coverChange">
              <a-button type="primary">上传封面</a-button>
            </a-upload>
          </div>
        </a-form-model-item>
        <a-form-model-item label="简介">
          <a-input v-model="video.desc" :maxLength="200" :autosize="{ minRows: 3, maxRows: 3 }" type="textarea" />
        </a-form-model-item>
        <a-form-model-item label="编码类型">
          <a-radio-group v-model="video.type">
            <a-radio value="mp4"> mp4 </a-radio>
            <a-radio value="hls"> hls </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <div class="submit-box">
          <div></div>
          <a-button type="primary" @click="submitVideo"> 提交 </a-button>
        </div>
      </a-form-model>
    </div>
    <div v-else class="opinion-card video">
      <div class="title">
        <p>导入资源</p>
      </div>
      <a-form-model ref="resource" :model="resource" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="标题" prop="title">
          <a-input v-model="resource.title" />
        </a-form-model-item>
        <a-form-model-item label="分辨率">
          <a-radio-group v-model="res">
            <a-radio value="original"> 原始分辨率 </a-radio>
            <a-radio value="multiple"> 多分辨率 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <div v-if="res == 'original'">
          <a-form-model-item label="视频URL">
            <a-input v-model="resource.original" />
          </a-form-model-item>
        </div>
        <div v-else>
          <a-form-model-item label="360P视频URL">
            <a-input v-model="resource.res360" />
          </a-form-model-item>
          <a-form-model-item label="480P视频URL">
            <a-input v-model="resource.res480" />
          </a-form-model-item>
          <a-form-model-item label="720P视频URL">
            <a-input v-model="resource.res720" />
          </a-form-model-item>
          <a-form-model-item label="1080P视频URL">
            <a-input v-model="resource.res1080" />
          </a-form-model-item>
        </div>      
        <div class="submit-box">
            <a-upload name="video" :showUploadList="false" :action="videoUrl" :headers="headers" :before-upload="uploadVideo" @change="videoChange">
              <a-button class="upload-btn" type="primary" :disabled="upload"> 上传视频 </a-button>
            </a-upload>
          <a-button type="primary" @click="submitResource"> 提交 </a-button>
        </div>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import storage from "@/utils/stored-data.js";
import { addVideo, addResource } from "@/api/video.js";
import { CoverUrl, VideoUrl } from "@/utils/request.js";
export default {
  data() {
    return {
      upload: false,//是否禁用上传视频
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      res: 'original',
      video: {
        title: "",
        cover:"",
        desc: "",
        type: "mp4",
      },
      resource: {
        vid: 0,
        title: "",
        res360: "",
        res480: "",
        res720: "",
        res1080: "",
        original: "",   
      },
      cover: CoverUrl,
      videoUrl: VideoUrl,
      headers: {
        Authorization: "Bearer " + storage.get("token"),
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        cover: [{ required: true, message: "请输入图片链接", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitVideo() {
      this.$refs.video.validate((valid) => {
        if (valid) {
          addVideo(this.video).then((res)=>{
            if (res.data.code === 2000){
              this.$message.success("导入成功");
              Object.keys(this.video).forEach((key) => {
                this.video[key] = "";
              });
            }
          }).catch((err) => { 
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    submitResource() {
      if (!this.resource.original && !this.resource.res360) {
        this.$message.error("请输入视频链接");
        return;
      }
      addResource(this.resource).then((res)=>{
        if (res.data.code === 2000){
          this.$message.success("导入成功");
          Object.keys(this.resource).forEach((key) => {
            if (key != 'vid') {
              this.resource[key] = "";
            }
          });
        }
      }).catch((err) => { 
        this.$message.error(err.response.data.msg);
      });
    },
    uploadCover(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("格式只能是jpg/jpeg/png格式");
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("图片大小不能超过5M");
      }
      return isJpgOrPng && isLt5M;
    },
    coverChange(info) {
      const status = info.file.status;
      if (status === "done") {
        this.video.cover = info.file.response.data.url;
        this.$message.success("上传完成");
      } else if (status === "error") {
        this.$message.error("文件上传失败");
      }
    },
    uploadVideo(file) {
      const isVideo = file.type === "video/mp4";
      if (!isVideo) {
        this.$message.error("格式只能是mp4格式");
      }
      const isLt500M = file.size / 1024 / 1024 < 500;
      if (!isLt500M) {
        this.$message.error("视频大小不能超过500M");
      }
      return isVideo && isLt500M;
    },
    videoChange(info) {
      this.upload = true;
      const status = info.file.status;
      if (status === "done") {
        this.$success({
          title: '上传成功',
          content: info.file.response.data.url,
        });
        this.$message.success("上传完成");
        this.upload = false;
      } else if (status === "error") {
        this.$message.error("文件上传失败");
      }
    },
  },
  created() {
    if (this.$route.params.vid) {
      this.resource.vid = this.$route.params.vid
    }
  }
};
</script>

<style lang="less" scoped>
.bg {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #fff;
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    min-width: 300vw;
    min-height: 300vw;
    background-color: rgb(84, 85, 183);
    transform: translate(-50%, 0) rotateZ(0);
    border-radius: 45%;
    bottom: 22vh;
    animation: rotate 10s linear infinite;
  }

  &::after {
    bottom: 20vh;
    opacity: 0.5;
  }

  @keyframes rotate {
    0% {
      transform: translate(-50%, 0) rotateZ(0);
    }

    50% {
      transform: translate(-50%, 0) rotateZ(180deg);
    }

    100% {
      transform: translate(-50%, 0) rotateZ(360deg);
    }
  }
}

.opinion-card {
  position: absolute;
  z-index: 20;
  top: 50%;
  left: 50%;
  background-color: #fff;
  border-radius: 20px;

  .title {
    height: 60px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;

    p {
      margin: 0;
      padding-left: 20px;
      font-size: 20px;
      font-weight: 500;
    }
  }
}

.upload {
  display: flex;
  height: 40px;
  align-items: center;
}

.info {
  margin: -260px 0 0 -380px;
  width: 760px;
  height: 440px;
}

.video {
  margin: -300px 0 0 -380px;
  width: 760px;
  height: 520px;
}

.btn-next {
  margin-left: calc(100% - 120px);
}

.submit-box {
  margin: 0 30px;
  display: flex;
  justify-content: space-between;
}

.upload-btn {
  margin-left: 20px;
}
</style>