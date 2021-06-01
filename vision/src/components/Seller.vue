<!--商家销量统计的横向柱状图-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      curPage: 1,
      totalPage: 0,
      timerId: null,
    };
  },
  mounted() {
    this.initChart(), this.getData();
  },
  destroyed() {
    clearInterval(this.timerId);
  },
  methods: {
    // 初始化echartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, "chalk");
      //对图标对象进行鼠标事件监听
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      }),
        this.chartInstance.on("mouseout", () => {
          this.startInterval();
        });
    },
    // 获取服务器数据
    async getData() {
      const { data: ret } = await this.$http.get("seller");
      this.allData = ret;
      this.allData.sort((a, b) => a.value - b.value);
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1;
      this.updataChart();
      this.startInterval(); //启动定时器
    },
    // 更新图表
    updataChart() {
      const start = (this.curPage - 1) * 5;
      const end = this.curPage * 5;
      const showData = this.allData.slice(start, end);
      const sellerNames = showData.map((item) => item.name);
      const sellerValue = showData.map((item) => item.value);
      const option = {
        title: {
          text: "┃ 商家销售统计",
          textStyle: {
            fontSize: 66,
          },
          left: 20,
          top: 20
        },
        grid: {
          top:'20%',
          left:'3%',
          right:'6%',
          bottom:'3%',
          containLabel:true//距离包含坐标轴上的位置
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: sellerNames,
        },
        series: [
          {
            type: "bar",
            data: sellerValue,
          },
        ],
      };
      this.chartInstance.setOption(option);
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.curPage++;
        if (this.curPage > this.totalPage) {
          this.curPage = 1;
        }
        this.updataChart();
      }, 3000);
    },
  },
};
</script>

<style lang="less" scoped>
</style>