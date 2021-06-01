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
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId);
    //在组件销毁的时候取消屏幕适配
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化echartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, "chalk");
      //对图表进行初始化配置
      const initOption = {
        title: {
          text: "┃ 商家销售统计",
          left: 20,
          top: 20,
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true, //距离包含坐标轴上的位置
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              color: "#2D3443",
            },
          },
        },
        series: [
          {
            type: "bar",
            //文字的显示
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              // 颜色渐变
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#5052EE" }, //百分之0的颜色值
                { offset: 1, color: "#AB6EE5" }, //百分之100的颜色值
              ]),
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
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
      const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValue,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
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
    //当浏览器大小发生变化的时候，会调用的方法，来完成屏幕的适配
    screenAdapter () {
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      //和分辨率大小相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize, //柱的宽度
            itemStyle: {
              //柱的圆角
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      //手动的调用图表的resize方法才能产生效果
      this.chartInstance.resize()
    }
  },
};
</script>

<style lang="less" scoped>
</style>