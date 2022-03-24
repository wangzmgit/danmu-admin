<template>
  <div>
    <div class="today-data">
      <div v-for="(item, index) in today" :key="index" class="data-card">
        <div class="data-icon">
          <a-icon :type="item.icon" />
        </div>
        <div class="data-content">
          <p>{{ item.title }}</p>
          <count-to :startVal="0" :endVal="item.data" :duration="3000"></count-to>
        </div>
      </div>
    </div>
    <div class="chart">
      <ve-line :data="chartData" :settings="chartSettings"></ve-line>
    </div>
    <div class="bottom-card">
      <div class="data-card" v-for="(item, index)  in server" :key="index">
        <div class="data-card-item" :style="`background:${item.color}`" @click="bottomCard(item.name)">
          <div class="data-icon">
            <a-icon :type="item.icon" />
          </div>
          <div class="data-content">
            <p>{{ item.title }}</p>
            <span>{{ item.data }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CountTo from "vue-count-to";
import VeLine from "v-charts/lib/line.common";
import { getTotalData, getRecentData, getUpdate } from "@/api/dashboard.js";
export default {
  data() {
    return {
      today: [
        {
          icon: "user-add",
          title: "用户数",
          data: 0,
        },
        {
          icon: "video-camera",
          title: "视频数",
          data: 0,
        },
        {
          icon: "check-circle",
          title: "待审核视频",
          data: 0,
        },
        {
          icon: "message",
          title: "消息",
          data: 0,
        },
      ],
      server: [
        {
          name: "version",
          icon: "code",
          color: "#2c72b2",
          title: "版本",
          data: "1.0.0",
        },
        {
          name: "redis",
          icon: "database",
          color: "#47a361",
          title: "Redis",
          data: "正常",
        },
        {
          name: "ffmpeg",
          icon: "code-sandbox",
          color: "#47a361",
          title: "FFmpeg",
          data: "正常",
        },
      ],
      chartData: {
        columns: ["date", "user", "video"],
        rows: [],
      },
      chartSettings: {
        labelMap: {
          user: "新增用户",
          video: "新增视频",
        },
      },
    };
  },
  methods: {
    totalData() {
      getTotalData().then((res) => {
        if (res.data.code === 2000) {
          let temp = res.data.data.data;
          this.today[0].data = temp.user;
          this.today[1].data = temp.video;
          this.today[2].data = temp.review;
          this.server[0].data = temp.version;
          if (!temp.redis) {
            this.server[1].color = "#ce5542";
            this.server[1].data = "异常";
          }
          if (!temp.ffmpeg) {
            this.server[2].color = "#ce5542";
            this.server[2].data = "异常";
          }
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    recentData() {
      getRecentData().then((res) => {
        if (res.data.code === 2000) {
          this.chartData.rows = res.data.data.data.reverse();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    checkUpdate() {
      getUpdate().then((res) => {
        if (res.data.code === 2000) {
          if (res.data.data.version) {
            this.$notification.open({
              message: "检测到新版本",
              description: "新版本号为" + res.data.data.version,
            });
          } else {
            this.$message.info("没有更新");
          }
        }
      }).catch(() => {
        this.$message.error("检查更新失败");
      });
    },
    bottomCard(name) {
      switch(name) {
        case "version":
          this.checkUpdate();
          break;
      }
    }
  },
  components: {
    CountTo,
    VeLine,
  },
  created() {
    this.totalData();
    this.recentData();
  },
};
</script>
<style lang="less" scoped>
.today-data {
  display: flex;
  margin-top: 20px;
  justify-content: space-around;

  .data-card {
    width: 20%;
    display: flex;
    align-items: center;
    border-radius: 10px;

    &:nth-child(1) {
      background: #40c9c6;
    }

    &:nth-child(2) {
      background: #36a3f7;
    }

    &:nth-child(3) {
      background: #f4516c;
    }

    &:nth-child(4) {
      background: #34bfa3;
    }
  }
}

//卡片图标
.data-icon {
  width: 25%;
  color: #fff;
  font-size: 50px;
  margin-left: 5%;
}

//卡片文字内容
.data-content {
  width: 70%;
  height: 60px;
  color: #fff;
  font-size: 16px;
  margin-left: 20px;
  p {
    margin: 0 0 10px 0;
  }
}

//图表
.chart {
  margin-top: 20px;
}

//底部卡片
.bottom-card {
  display: flex;
  margin-top: 20px;
  justify-content: space-around;

  .data-card {
    width: 20%;
  }

  .data-card-item {
    display: flex;
    align-items: center;
    border-radius: 10px;
  }
}
</style>