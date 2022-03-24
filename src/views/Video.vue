<template>
  <div>
    <div class="info-header">
      <div>
        <span>视频来源：</span>
        <a-radio-group v-model="videoFrom" @change="fromChange">
          <a-radio value="user"> 用户上传 </a-radio>
          <a-radio value="admin"> 管理员导入 </a-radio>
        </a-radio-group>
      </div>
      <a-button type="primary" @click="visible = true">导入视频</a-button>
    </div>
    <a-table rowKey="vid" :columns="columns" :dataSource="data" :pagination="pagination" @change="pageChange">
      <span slot="cover" slot-scope="record">
        <img height="60px" :src="record.cover" />
      </span>
      <span slot="created_at" slot-scope="record">
        {{record.created_at | toTime}}
      </span>
      <span slot="copyright" slot-scope="record">
        {{record.copyright | toCopyright}}
      </span>
      <span v-if="videoFrom == 'user'" class="operate" slot="action" slot-scope="record">
        <a @click="viewVideo(record.vid, record.video_type)">查看视频</a>
        <a @click="viewAuthor(record.uid)">作者</a>
        <a @click="deleteVideoClick(record.vid)">删除</a>
      </span>
      <span v-else class="operate" slot="action" slot-scope="record">
        <a @click="addResource(record.vid)">添加资源</a>
        <a @click="viewResource(record.vid)">管理资源</a>
        <a @click="deleteVideoClick(record.vid)">删除</a>
      </span>
    </a-table>
    <!--导入视频-->
    <a-modal :width="700" v-model="visible" title="注意事项">
      <p>1.目前视频导入格式仅支持mp4和hls格式的视频，封面图导入格式仅支持jpg、jpeg、png。</p>
      <p>2.导入视频的所有者默认uid为0且播放量不计入排行榜。如需计入排行，可在网站配置页面修改导入视频所属用户ID。</p>
      <p>
        <span>3.导入视频请使用原始分辨率链接或者连续的分辨率。</span>
        <span>对于非连续分辨率(如360p,720p不含480p)可能会出现加载出错的问题。</span>
        <span>因此在录入不同分辨率视频时，不要存在间隔。</span>
      </p>
      <p>4.相较于普通用户，管理员导入的数据验证较少，不能保证数据的可用。因此导入前请确保视频和图片可用</p>
      <p>5.如果视频只有一个分辨率的链接，请使用‘原始分辨率’选项。</p>
      <p>6.视频录入不会对分辨率进行验证，录入前请核对好不同分辨率的链接。</p>
      <p>7.如果没有预先准备好视频和封面的URL，可以在导入页面上传，上传返回的URl需要手动复制到对于的输入框。</p>
      <p>8.在导入页面上传的视频，不会进行转码处理，所以视频格式只能为mp4。</p>
      <p>
        <span>9.点击确定后会进入视频导入页面，在该页面下只会创建视频数据，没有视频资源。</span>
        <span>在创建视频后需要前往视频管理，在管理员导入的视频下进行视频资源添加。</span>
      </p>
      <template slot="footer">
        <a-button @click="visible=false">取消</a-button>
        <a-button type="primary" @click="addVideoClick()">开始导入</a-button>
      </template>
    </a-modal>
    <!--作者信息-->
    <a-modal v-model="visibleAuthor" title="作者信息">
      <table class="info-card">
        <tr>
          <td>头像</td>
          <td>
            <a-avatar v-if="author.avatar" :size="50" :src="author.avatar" />
            <a-avatar v-else :size="80" icon="user" />
          </td>
        </tr>
        <tr>
          <td>昵称</td>
          <td>{{ author.name }}</td>
        </tr>
        <tr>
          <td>UID</td>
          <td>{{ author.uid }}</td>
        </tr>
        <tr>
          <td>性别</td>
          <td>{{ author.gender | toGender }}</td>
        </tr>
        <tr>
          <td>个性签名</td>
          <td>{{ author.sign }}</td>
        </tr>
      </table>
      <template slot="footer">
        <a-button type="primary" @click="visibleAuthor=false">确定</a-button>
      </template>
    </a-modal>
    <!-- 播放视频 -->
    <div class="review-video" v-show="visibleVideo" title="查看视频">
      <video id="reviewPlayer" preload="auto" controls/>
      <a-button type="primary" @click="close()">关闭</a-button>
    </div>
    <!-- 管理资源 -->
    <a-modal v-model="visibleResource" title="管理资源">
      <div class="resources">
        <div class="resource-item" v-for="(item,index) in resources" :key="index">
          <div class="resource-info">
            <p class="resource-episode">{{index + 1}}P</p>
            <p>&nbsp;{{ item.title }}</p>
          </div>
          <div class="resource-info">
            <p>上传于&nbsp;{{ item.created_at }}</p>
            <a-button type="link" @click="deleteResourceRequest(item.uuid, index)">删除</a-button>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="visibleResource=false">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  { title: "VID", key: "vid", dataIndex: "vid", align: "center", width: "80px" },
  { title: "封面", key: "cover ", scopedSlots: { customRender: "cover" }, align: "center" },
  { title: "标题", key: "title ", dataIndex: "title", align: "center" },
  { title: "简介", key: "desc", dataIndex: "desc", align: "center", width: "180px" },
  { title: "上传时间", key: "created_at", scopedSlots: { customRender: "created_at" }, align: "center" },
  { title: "允许转载", key: "copyright", scopedSlots: { customRender: "copyright" }, align: "center" },
  { title: "操作", key: "action", scopedSlots: { customRender: "action" }, align: "center", width:"180px" },
];
import Hls from "hls.js";
import { utcToBeijing } from "@/utils/time.js";
import { getUserByID } from "@/api/user.js";
import { videoResource } from "@/api/review.js";
import { getVideoList, deleteVideo, getResourceList, deleteResource } from "@/api/video.js";
export default {
  data() {
    return {
      videoFrom: 'user',
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      author: {},
      columns,
      data: [],
      resources:[],
      pagination: {
        pageSize: 5,
        current: 1,
        total: 0,
      },
      visible: false,//显示对话框
      visibleAuthor: false,//显示作者信息对话框
      visibleVideo: false,//显示视频对话框
      visibleResource: false,//显示视频资源信息
    };
  },
  methods: {
    getVideoListRequest() {
      getVideoList(this.pagination.current, this.pagination.pageSize, this.videoFrom).then((res) => {
        if (res.data.code === 2000) {
          this.data = res.data.data.videos;
          if (this.pagination.total == 0) {
            this.pagination.total = res.data.data.count;
          }
        }
      }).catch((err) => { 
        this.$message.error(err.response.data.msg);
      });
    },
    //查看视频
    viewVideo(vid, type){
      let src = "";
      //获取到视频链接
      videoResource(vid).then((res) => {
        if(res.data.code === 2000){
          let video = res.data.data.video;
          if(video.original === "") {
            src = video.res360;
          } else {
            src =video.original;
          }
          this.initPlayer(src, type);
        }
      })
    },
    initPlayer(src, type) {
      this.visibleVideo = true;
      let player = document.getElementById("reviewPlayer");
      if(type == "hls"){
        this.hls = new Hls();
        this.hls.loadSource(src);
        this.hls.attachMedia(player);
        this.hls.on(Hls.Events.ERROR, () => {
          console.log('加载失败');
        });
      }else{
        player.src = src;
      }  
    },
    close(){
      if(this.hls != null){
        this.hls.stopLoad();
        this.hls.destroy();
        this.hls = null;
      }
      this.visibleVideo = false;
    },
    //查看作者
    viewAuthor(uid){
      getUserByID(uid).then((res) => {
        if (res.data.code === 2000) {
          this.author = res.data.data.user;
          this.visibleAuthor = true;
        }
      })
    },
    //删除视频
    deleteVideoClick(id) {
      deleteVideo(id).then((res)=>{
        if(res.data.code === 2000){
          this.$message.success("删除成功");
          this.getVideoListRequest();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //切换页面
    pageChange(pagination) {
      this.pagination = pagination;
      this.getVideoListRequest();
    },
    //添加视频
    addVideoClick(){
      this.$router.push({ name: "ImportVideo" });
    },
    //视频来源改变
    fromChange() {
      let newQuery = JSON.parse(JSON.stringify(this.$route.query));
      newQuery.from = this.videoFrom;
      this.$router.replace({ query: newQuery });
      this.getVideoListRequest();
    },
    //添加视频资源
    addResource(vid) {
      this.$router.push({name:"ImportVideo",params: { vid: vid }})
    },
    //显示资源
    viewResource(vid) {
      getResourceList(vid).then((res) => {
        if (res.data.code === 2000) {
          this.resources = res.data.data.resources;
        }
      })
      this.visibleResource = true;
    },
    //删除资源
    deleteResourceRequest(id,index) {
      deleteResource(id).then((res) => {
        if (res.data.code === 2000) {
          this.$message.success("删除成功");
          this.resources.splice(index,1);
        }
      })
    }
  },
  created() {
    this.videoFrom = this.$route.query.from;
    this.getVideoListRequest();
  },
  filters: {
    toCopyright(copyright) {
      if (copyright) return "否";
      else return "是";
    },
    toTime(time) {
      return utcToBeijing(time);
    },
    toGender(gender) {
      if (gender == 1) return "男";
      else if (gender == 2) return "女";
      else return "未知";
    },
  },
};
</script>

<style lang="less" scoped>
.operate > a {
  margin-left: 10px;
}

.info-header{
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 30px;
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
.review-video{
  width: 520px;
  background: rgb(238, 238, 238);
  width: 520px;
  height: 336px;
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 10;
  margin: -200px 0 0 -260px;
  video{
    width: 480px;
    height: 270px;
    margin: 10px 20px 0 20px;
  }
  button{
    float: right;
    margin: 10px 20px;
  }
}

.resources {
  height: 300px;
  overflow-y: scroll;
}

.resource-item{
  display: flex;
  padding: 0 10px;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: #eeeeee;

  p {
    margin: 0;
    font-size: 16px;
  }

  .resource-episode {
    font-weight: 600;
  }

  .resource-info{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>