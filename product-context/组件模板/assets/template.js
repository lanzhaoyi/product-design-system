/**
 * FasTreat 后台静态模板 - 共享引导脚本
 *
 * 职责：
 *   1. 按顺序加载 Vue3 + Element Plus + icons：优先读本地 node_modules（离线可用），
 *      失败时自动回退 CDN；
 *   2. 注册 Element Plus 组件、全部图标（PascalCase + kebab-case 双注册）与 FtIcon；
 *   3. 挂载页面：以 <div id="app"> 的 innerHTML 作为模板，页面通过 window.__TPL_PAGE__
 *      传入 Options API 配置（data / computed / methods / mounted ...）。
 *
 * 约定：
 *   - 页面标记必须使用 kebab-case（in-DOM 模板，属性名会被 HTML 解析器小写化）；
 *   - 页面末尾先定义 window.__TPL_PAGE__，再引入本文件；
 *   - 通过 ?embed=1 打开时视为被框架页 iframe 内嵌，模板说明区不渲染。
 *
 * 该文件仅用于静态模板参考，不参与 npm 构建（vite 只打包 index.html 入口）。
 */
;(function () {
  'use strict'

  // 本地依赖（相对 html/ 目录），缺失时回退 CDN
  var DEPS = [
    {
      local: '../node_modules/vue/dist/vue.global.prod.js',
      cdn: 'https://unpkg.com/vue@3.4.21/dist/vue.global.prod.js',
      ready: function () {
        return !!window.Vue
      }
    },
    {
      local: '../node_modules/element-plus/dist/index.full.min.js',
      cdn: 'https://unpkg.com/element-plus@2.9.7/dist/index.full.min.js',
      ready: function () {
        return !!window.ElementPlus
      }
    },
    {
      local: '../node_modules/@element-plus/icons-vue/dist/index.iife.min.js',
      cdn: 'https://unpkg.com/@element-plus/icons-vue@2.3.1/dist/index.iife.min.js',
      ready: function () {
        return !!window.ElementPlusIconsVue
      }
    }
  ]

  // Vue 内置的 HTML 原生标签名，避免 kebab-case 图标名与其冲突（如 Document -> document）
  var NATIVE_TAGS = [
    'html', 'body', 'base', 'head', 'link', 'meta', 'style', 'title', 'address',
    'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'hgroup', 'main', 'nav', 'section', 'search', 'blockquote', 'dd', 'div', 'dl',
    'dt', 'figcaption', 'figure', 'hr', 'li', 'menu', 'ol', 'p', 'pre', 'ul', 'a',
    'b', 'abbr', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i',
    'kbd', 'mark', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'span', 'strong',
    'sub', 'sup', 'time', 'u', 'var', 'wbr', 'area', 'audio', 'map', 'track',
    'video', 'embed', 'object', 'param', 'source', 'canvas', 'script', 'noscript',
    'del', 'ins', 'caption', 'col', 'colgroup', 'table', 'thead', 'tbody', 'td',
    'th', 'tr', 'button', 'datalist', 'fieldset', 'form', 'input', 'label',
    'legend', 'meter', 'optgroup', 'option', 'output', 'progress', 'select',
    'textarea', 'details', 'dialog', 'summary', 'template', 'slot', 'component',
    'transition', 'keep-alive', 'teleport', 'suspense'
  ]

  function toKebab(name) {
    return name
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase()
  }

  function pad(n) {
    return n < 10 ? '0' + n : '' + n
  }

  /** 简单时间格式化，支持 YYYY MM DD HH mm ss */
  function formatTime(value, pattern) {
    if (value === null || value === undefined || value === '') return '-'
    pattern = pattern || 'YYYY-MM-DD HH:mm:ss'
    var date =
      value instanceof Date
        ? value
        : typeof value === 'number'
          ? new Date(value)
          : new Date(String(value).replace(/-/g, '/'))
    if (isNaN(date.getTime())) return String(value)
    var map = {
      YYYY: date.getFullYear(),
      MM: pad(date.getMonth() + 1),
      DD: pad(date.getDate()),
      HH: pad(date.getHours()),
      mm: pad(date.getMinutes()),
      ss: pad(date.getSeconds())
    }
    return pattern.replace(/YYYY|MM|DD|HH|mm|ss/g, function (key) {
      return map[key]
    })
  }

  /** 由种子生成稳定的假数据，保证多次刷新/分页数据一致 */
  function seedRandom(seed) {
    var value = seed
    return function () {
      value = (value * 9301 + 49297) % 233280
      return value / 233280
    }
  }

  var STATUS_DICT = [
    { label: 'Active', value: '0', tag: 'success' },
    { label: 'Pending', value: '1', tag: 'warning' },
    { label: 'Disabled', value: '2', tag: 'info' },
    { label: 'Rejected', value: '3', tag: 'danger' }
  ]

  var FIRST_NAMES = [
    'Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
    'Isabella', 'Lucas', 'Mia', 'Logan', 'Amelia', 'James', 'Harper', 'Elijah',
    'Chloe', 'Benjamin', 'Ella', 'Henry'
  ]
  var LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis',
    'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Martin', 'Jackson',
    'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Walker'
  ]
  var CLINICIANS = [
    { id: 101, name: 'Dr. Alan Reed', dept: 'Psychiatry', role: 'Physician' },
    { id: 102, name: 'Dr. Bella Chen', dept: 'Family Medicine', role: 'Nurse Practitioner' },
    { id: 103, name: 'Dr. Chris Nolan', dept: 'Psychiatry', role: 'Physician' },
    { id: 104, name: 'Dr. Dana White', dept: 'Hormone Health', role: 'Physician' },
    { id: 105, name: 'Dr. Evan Brooks', dept: 'Therapy', role: 'Therapist' },
    { id: 106, name: 'Dr. Fiona Gale', dept: 'Family Medicine', role: 'Physician' },
    { id: 107, name: 'Dr. Grace Lin', dept: 'Therapy', role: 'Therapist' },
    { id: 108, name: 'Dr. Hugo Marsh', dept: 'Hormone Health', role: 'Nurse Practitioner' }
  ]
  var CASE_TYPES = ['ADHD Assessment', 'Follow-up Visit', 'Medication Review', 'Hormone Therapy', 'Therapy Session']
  var CHANNELS = ['Video Call', 'Phone Call', 'In Clinic', 'Async Message']

  /** 生成患者列表假数据（列表模板 / 详情模板共用） */
  function mockPatients(total) {
    total = total || 43
    var rand = seedRandom(20260928)
    var list = []
    for (var i = 1; i <= total; i++) {
      var first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]
      var last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]
      var clinician = CLINICIANS[Math.floor(rand() * CLINICIANS.length)]
      var status = STATUS_DICT[Math.floor(rand() * STATUS_DICT.length)]
      var age = 18 + Math.floor(rand() * 45)
      var created = new Date(
        2026,
        Math.floor(rand() * 9),
        1 + Math.floor(rand() * 27),
        8 + Math.floor(rand() * 10),
        Math.floor(rand() * 60)
      )
      list.push({
        patientId: 10000 + i,
        patientNo: 'PT-2026-' + pad(i).padStart(4, '0'),
        name: first + ' ' + last,
        initials: (first[0] + last[0]).toUpperCase(),
        gender: i % 3 === 0 ? 'Female' : i % 3 === 1 ? 'Male' : 'Other',
        age: age,
        email: (first + '.' + last).toLowerCase() + '@example.com',
        phone: '+1 416 ' + (200 + Math.floor(rand() * 700)) + ' ' + (1000 + Math.floor(rand() * 8999)),
        province: ['ON', 'BC', 'AB', 'QC'][Math.floor(rand() * 4)],
        clinicianId: clinician.id,
        clinician: clinician.name,
        caseType: CASE_TYPES[Math.floor(rand() * CASE_TYPES.length)],
        channel: CHANNELS[Math.floor(rand() * CHANNELS.length)],
        status: status.value,
        statusLabel: status.label,
        statusTag: status.tag,
        isVip: rand() > 0.78,
        visitCount: 1 + Math.floor(rand() * 12),
        lastVisit: created.getTime() + 86400000 * Math.floor(rand() * 20),
        createTime: created.getTime()
      })
    }
    return list
  }

  /** 生成预约列表假数据（表单模板 / 多选模板共用） */
  function mockAppointments(count) {
    count = count || 6
    var patients = mockPatients(count)
    return patients.map(function (patient, index) {
      var clinician = CLINICIANS[index % CLINICIANS.length]
      return {
        id: 20000 + index,
        appointmentNo: 'AP-' + pad(index + 1).padStart(3, '0'),
        patientId: patient.patientId,
        patientName: patient.name,
        clinicianId: clinician.id,
        clinicianName: clinician.name,
        startTime: new Date(2026, 8, 28 + index, 9 + index, 0).getTime(),
        duration: [30, 45, 60][index % 3],
        caseType: patient.caseType,
        channel: patient.channel,
        status: index % 2 === 0 ? '0' : '1'
      }
    })
  }

  var Tpl = {
    version: '1.0.0',
    dict: {
      status: STATUS_DICT,
      clinicians: CLINICIANS,
      caseTypes: CASE_TYPES,
      channels: CHANNELS
    },
    mock: {
      patients: mockPatients,
      appointments: mockAppointments
    },
    formatTime: formatTime,
    /** 是否被框架页 iframe 内嵌（内嵌时不渲染模板说明） */
    isEmbed: function () {
      return (
        new URLSearchParams(window.location.search).get('embed') === '1' ||
        window.self !== window.top
      )
    },
    /** 状态字典 -> el-tag type */
    statusTag: function (value) {
      var hit = STATUS_DICT.filter(function (item) {
        return String(item.value) === String(value)
      })[0]
      return hit ? hit.tag : 'info'
    },
    statusLabel: function (value) {
      var hit = STATUS_DICT.filter(function (item) {
        return String(item.value) === String(value)
      })[0]
      return hit ? hit.label : value
    },
    /** 客户端分页 */
    paginate: function (list, pageNum, pageSize) {
      var start = (pageNum - 1) * pageSize
      return list.slice(start, start + pageSize)
    }
  }
  window.Tpl = Tpl

  function loadScript(src, onSuccess, onError) {
    var script = document.createElement('script')
    script.src = src
    script.async = false
    script.onload = onSuccess
    script.onerror = function () {
      document.head.removeChild(script)
      onError()
    }
    document.head.appendChild(script)
  }

  function loadDeps(index, onDone) {
    if (index >= DEPS.length) return onDone(null)
    var dep = DEPS[index]
    if (dep.ready()) return loadDeps(index + 1, onDone)
    loadScript(
      dep.local,
      function () {
        loadDeps(index + 1, onDone)
      },
      function () {
        // 本地 node_modules 不可用时回退 CDN
        loadScript(
          dep.cdn,
          function () {
            loadDeps(index + 1, onDone)
          },
          function () {
            onDone(dep.cdn)
          }
        )
      }
    )
  }

  function registerIcons(app, icons) {
    Object.keys(icons).forEach(function (name) {
      app.component(name, icons[name])
      var kebab = toKebab(name)
      if (NATIVE_TAGS.indexOf(kebab) === -1) app.component(kebab, icons[name])
    })
  }

  /** 统一图标入口：<ft-icon name="User" />，对齐项目内的 <svg-icon> 用法 */
  function createFtIcon() {
    return {
      name: 'FtIcon',
      props: {
        name: { type: String, required: true }
      },
      setup: function (props) {
        return function () {
          var icons = window.ElementPlusIconsVue || {}
          var icon = icons[props.name]
          return window.Vue.h(
            window.ElementPlus.ElIcon,
            null,
            icon ? { default: function () { return window.Vue.h(icon) } } : null
          )
        }
      }
    }
  }

  function renderFallback(failedSrc) {
    var container = document.getElementById('app')
    if (!container) return
    container.removeAttribute('v-cloak')
    container.className = 'tpl-fallback'
    container.innerHTML =
      '<h2>模板依赖加载失败</h2>' +
      '<p>静态模板依赖 Vue 3 / Element Plus / icons，加载顺序为：</p>' +
      '<ol>' +
      '<li>本地 <code>../node_modules</code>（仓库根目录执行 <code>npm install</code> 或 <code>pnpm install</code> 后可用）</li>' +
      '<li>CDN 兜底（需要可访问外网）</li>' +
      '</ol>' +
      '<p>失败地址：<code>' + failedSrc + '</code></p>' +
      '<p>页面结构（HTML/CSS）本身可以正常阅读，安装依赖或联网后刷新即可恢复交互。</p>'
  }

  function bootstrap() {
    var Vue = window.Vue
    var ElementPlus = window.ElementPlus
    var icons = window.ElementPlusIconsVue || {}
    var page = window.__TPL_PAGE__ || {}

    var app = Vue.createApp(page)
    app.use(ElementPlus)
    registerIcons(app, icons)
    app.component('FtIcon', createFtIcon())
    app.component('ft-icon', createFtIcon())
    app.mount('#app')

    var container = document.getElementById('app')
    if (container) container.removeAttribute('v-cloak')
    var loading = document.getElementById('tpl-boot-loading')
    if (loading && loading.parentNode) loading.parentNode.removeChild(loading)
  }

  loadDeps(0, function (failedSrc) {
    if (failedSrc) return renderFallback(failedSrc)
    try {
      bootstrap()
    } catch (error) {
      /* eslint-disable no-console */
      console.error('[tpl] bootstrap failed:', error)
      renderFallback(error && error.message ? error.message : 'bootstrap error')
    }
  })
})()
