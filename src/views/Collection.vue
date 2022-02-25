<template>
  <div>
    <a-table rowKey="id" :columns="columns" :dataSource="data" :pagination="pagination" @change="pageChange" >
      <span slot="cover" slot-scope="record">
        <img height="60px" width="100px" :src="record.cover" />
      </span>
      <span slot="created_at" slot-scope="record">
        {{ record.created_at | toTime }}
      </span>
      <span class="operate" slot="action" slot-scope="record">
        <a @click="deleteItem(record.id)">删除</a>
      </span>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: "ID",
    key: "id",
    dataIndex: "id",
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
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { utcToBeijing } from "@/utils/time.js";
import { getCollectionList, deleteCollection } from "@/api/collection.js";
export default {
  data() {
    return {
      columns,
      data: [],
      pagination: {
        pageSize: 8,
        current: 1,
        total: 0,
      },
    };
  },
  methods: {
    getDataList() {
      getCollectionList(this.pagination.current, this.pagination.pageSize).then((res) => {
        if (res.data.code === 2000) {
          this.data = res.data.data.collections;
          if (this.pagination.total == 0) {
            this.pagination.total = res.data.data.count;
          }
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //删除合集
    deleteItem(id) {
      deleteCollection(id).then((res) => {
        if (res.data.code === 2000) {
          this.$message.success("删除成功");
          this.getDataList();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    pageChange(pagination) {
      this.pagination = pagination;
      this.getDataList();
    },
  },
  created() {
    this.getDataList();
  },
  filters: {
    toTime(time) {
      return utcToBeijing(time);
    },
  },
};
</script>

<style scoped>

</style>