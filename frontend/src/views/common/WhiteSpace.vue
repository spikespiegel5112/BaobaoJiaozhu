<template>
  <div class="common_whitespace_item" :class="parseSize() + parseLine()">
    <span v-if="line === true" :style="style"></span>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    size: {
      type: String,
      default: 'md',
      required: false
    },
    line: {
      type: Boolean,
      default: false,
      required: false
    },
    lineColor: {
      type: String,
      default: '',
      required: false
    }
  },
  computed: {
    style() {
      let result;
      if (this.lineColor && this.lineColor !== '') {
        result = {
          'background-color': this.lineColor
        };
      }
      return result;
    }
  },
  methods: {
    parseSize() {
      const sizeList = ['sm', 'md', 'lg', 'xl'];
      let result = '';
      if (sizeList.find(item => item === this.size)) {
        result = this.size;
      }
      return result;
    },
    parseLine() {
      return this.line === true ? ' line' : '';
    }
  }
};
</script>

<style lang="scss" scoped>
.common_whitespace_item {
  width: 100%;
  height: 15px;
  &.sm {
    height: 10px;
  }
  &.md {
    height: 15px;
  }
  &.lg {
    height: 24px;
  }
  &.xl {
    height: 32px;
  }

  &.line {
    height: 0;
    &:before {
      content: '';
      display: inline-block;
      width: 0;
      height: 100%;
      vertical-align: top;
    }
    span {
      display: inline-block;
      width: 100%;
      height: 1px;
      background-color: #979797;
      vertical-align: top;
    }
  }
}
</style>
