<template>
  <div>
    <a-table rowKey="vid" :columns="columns" :dataSource="data" :pagination="pagination" @change="pageChange">
      <span slot="cover" slot-scope="record">
        <img height="60px" :src="record.cover" v-image-preview="record.cover"/>
      </span>
      <span slot="created_at" slot-scope="record">
        {{record.created_at | toTime}}
      </span>
      <span slot="copyright" slot-scope="record">
        {{record.copyright | toCopyright}}
      </span>
      <span class="operate" slot="action" slot-scope="record">
        <a @click="viewVideo(record.vid,record.video_type)">查看视频</a>
        <a @click="reviewVideo(record.vid,2000)">通过</a>
        <a @click="showReviewModal(record.vid)">不通过</a>
      </span>
    </a-table>
    <div class="review-video" v-show="visible" title="查看视频">
      <video id="reviewPlayer" preload="auto" controls/>
      <a-button type="primary" @click="close()">关闭</a-button>
    </div>
    <a-modal v-model="reviewVisible">
      <a-form-model-item label="原因">
        <a-select class="reason" v-model="selectStatus">
          <a-select-option value="4001">视频内容存在问题</a-select-option>
          <a-select-option value="4002">视频信息存在问题</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="备注">
          <a-input v-model="form.remarks" :autosize="{ minRows: 2, maxRows: 3 }" :maxLength="20" type="textarea"/>
        </a-form-model-item>
      <template slot="footer">
        <a-button @click="reviewVisible = false">取消</a-button>
        <a-button type="primary" @click="fail()">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "VID",
    key: "vid",
    dataIndex: "vid",
    align: "center",
    width: "80px",
  },
  {
    title: "封面",
    key: "cover ",
    scopedSlots: { customRender: "cover" },
    align: "center",
  },
  {
    title: "标题",
    key: "title ",
    dataIndex: "title",
    align: "center",
  },
  {
    title: "分区",
    key: "partition",
    dataIndex: "partition",
    align: "center",
  },
  {
    title: "简介",
    key: "desc",
    dataIndex: "desc",
    align: "center",
  },
  {
    title: "上传时间",
    key: "created_at",
    scopedSlots: { customRender: "created_at" },
    align: "center",
  },
  {
    title: "允许转载",
    key: "copyright",
    scopedSlots: { customRender: "copyright" },
    align: "center",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
    width:"200px",
  },
];
import Hls from "hls.js";
import { utcToBeijing } from "@/utils/time.js";
import { getReviewList, review, videoResource } from "@/api/review.js";
export default {
  data() {
    return {
      columns,
      data: [],
      hls:null,
      visible:false,//显示对话框
      reviewVisible:false,//审核对话框
      selectStatus:"",//选择的状态码
      pagination: {
        pageSize: 6,
        current: 1,
        total: 0,
      },
      form:{
        vid:0,
        status:0,
        remarks:"",
      }
    };
  },
  methods: {
    getVideoList() {
      getReviewList(this.pagination.current, this.pagination.pageSize).then((res) => {
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
    viewVideo(vid,type){
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
          this.initPlayer(src,type);
        }
      })
    },
    initPlayer(src, type) {
      this.visible = true;
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
      this.visible = false;
    },
    //切换页面
    pageChange(pagination) {
      this.pagination = pagination;
      this.getVideoList();
    },
    //显示不通过的对话框
    showReviewModal(vid){
      this.form.vid = vid;
      this.reviewVisible = true;
    },
    //不通过视频
    fail(){
      if(this.selectStatus == ""){
        this.$message.error("请选择不通过的原因");
        return;
      }
      this.reviewVideo(this.form.vid,Number(this.selectStatus))
    },
    reviewVideo(vid,code){
      this.form.vid = vid;
      this.form.status = code;
      review(this.form).then((res) => {
        if (res.data.code === 2000) {
          this.getVideoList();
          this.reviewVisible = false;
        }
      }).catch((err) => { 
        this.$message.error(err.response.data.msg);
      });
    }
  },
  created() {
    this.getVideoList();
  },
  filters: {
    toCopyright(copyright) {
      if (copyright) return "否";
      else return "是";
    },
    toTime(time) {
      return utcToBeijing(time);
    },
  },
};
</script>

<style scoped>
.operate > a {
  margin-left: 10px;
}

.reason{
  width: 100%;
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
}

.review-video>video{
  width: 480px;
  height: 270px;
  margin: 10px 20px 0 20px;
}

.review-video>button{
  float: right;
  margin: 10px 20px;
}
</style>