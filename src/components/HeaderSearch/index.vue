<template>
  <div :class="{'show': show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.path" :value="item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
import path from 'path'

export default {
  name: 'HeaderSearch',
  data() {
    return {
      search: '',
      show: false,
      options: []
    }
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    searchPool(list) {
      this.initFuse(list)
    },
    routes() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    show(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      }
      else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    click() {
      this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    querySearch(query) {
      if (query !== '') {
        this.options = this.fuse.search(query)
      }
      else {
        this.options = []
      }
    },
    change(val) {
      this.$router.push(val.path)
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    },
    generateRoutes(routes, basePath = '/', prefixTitle = []) {
      let res = []

      for (const route of routes) {
        if (route.hidden) { continue }

        const data = {
          path: path.resolve(basePath, route.path),
          title: [...prefixTitle]
        }

        if (route.meta && route.meta.title) {
          data.title = [...data.title, route.meta.title]

          if (route.redirect !== 'noRedirect') {
            res.push(data)
          }
        }

        if (route.children) {
          const tempRoutes = this.generateRoutes(route.children, data.path, data.title)
          if (tempRoutes.length > 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    /deep/ .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
