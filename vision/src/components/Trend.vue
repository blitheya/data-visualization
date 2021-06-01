<template>
  <div class="com-container">
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstane: null,
      allData: null, //从服务器获取的所有数据
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.chartInstane = this.$echarts.init(this.$refs.trend_ref);
      const initOption = {
        xAxis: {
          type:'category'
        },
        yAxis: {
          type: 'value'
        }
      };
      this.chartInstane.setOption(initOption);
    },
    async getData() {
      // await this.$http.get()
      const {data: ret} = await this.$http.get('trend')
      console.log(ret)
      this.allData = ret
      this.updataChart();
    },
    updataChart() {
      //处理数据
      const timeArr = this.allData.common.month
      const valueArr = this.allData.map.data
      const seriesArr = valueArr.map(item => {
        return {
          type: 'line',
          data: item.data
        }
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        series: seriesArr
      };
      this.chartInstane.setOption(dataOption);
    },
    screenAdapter() {
      const adapterOption = {};
      this.chartInstane.setOption(dataOption);
      this.chartInstane.resize();
    },
  },
};
</script>

<style lang="less" scoped>
</style>