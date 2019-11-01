<template>
  <div>
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="click" />
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestory() {
    this.destory()
  },
  methods: {
    click() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: 'your browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    destory() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change)
      }
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    }
  }
}
</script>
