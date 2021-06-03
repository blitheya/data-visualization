<template>
  <div class="com-container">
    <div class="com-chart" ref="trend_ref"></div>
    <span class="iconfont arr-left" :style="comStyle" @click="toLeft">&#xe6ef;</span>
    <span class="iconfont arr-right" :style="comStyle" @click="toRight">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstane: null,
      allData: null, //从服务器获取的所有数据
      currentIndex: 0,
      titleFontSize: 0
    };
  },
  computed: {
    catName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentIndex].name;
      }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    }
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.chartInstane = this.$echarts.init(this.$refs.trend_ref, "chalk");
      const initOption = {
        title: {
          text: "┃ 热销商品的占比",
          left: 20,
          top: 20,
        },
        legend: {
          top: "15%",
          icon: "circle",
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            const thirdCategory = arg.data.children;
            let totle = 0;
            thirdCategory.forEach((item) => (totle += item.value));
            let retStr = "";
            thirdCategory.forEach((item) => {
              retStr += `
              ${item.name}:${parseInt((item.value / totle) * 100) + "%"}<br/>
              `;
            });
            return retStr;
          },
        },
        series: [
          {
            type: "pie",
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
          },
        ],
      };
      this.chartInstane.setOption(initOption);
    },
    async getData() {
      // await this.$http.get()
      const { data: ret } = await this.$http.get("hotproduct");
      this.allData = ret;
      this.updataChart();
    },
    updataChart() {
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => item.name
      );
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
          };
        }
      );
      const dataOption = {
        legend: {
          data: legendData,
        },
        series: [
          {
            data: seriesData,
          },
        ],
      };
      this.chartInstane.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%','60%']
          }
        ],
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };
      this.chartInstane.setOption(adapterOption);
      this.chartInstane.resize();
    },
    toLeft() {
      this.currentIndex--;
      this.currentIndex < 0
        ? (this.currentIndex = this.allData.length - 1)
        : this.currentIndex;

      this.updataChart();
    },
    toRight() {
      this.currentIndex++;
      this.currentIndex > this.allData.length - 1
        ? (this.currentIndex = 0)
        : this.currentIndex;
      this.updataChart();
    },
  },
};
</script>

<style lang="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #fff;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #fff;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: #fff;
}
</style>