<template>
  <div class="editor" ref="editor">
    <div id="toolbar"></div>
    <div id="editor"></div>
    <!--<button v-on:click="getContent">查看内容</button>-->
  </div>
</template>

<script>
  import E from 'wangeditor'

  export default {
    props: {
      editorContent: {
        type: String,
        default: '',
        required: false
      },
      base64: {
        type: Boolean,
        default: true,
        required: false
      },
      imageServer: {
        type: String,
        default: '',
        required: false
      },
      config: {
        type: Array,
        default: [
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          'link',  // 插入链接
          'list',  // 列表
          'justify',  // 对齐方式
          'quote',  // 引用
          'emoticon',  // 表情
          'image',  // 插入图片
          'table',  // 表格
          'video',  // 插入视频
          'code',  // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
        ],
        required: false
      }
    },
    data() {
      return {
        editorInstance: {},
        editorContentInner: ''
      }
    },
    computed: {
      layoutHeight() {
        return this.$store.state.layoutHeight;
      },
      editorStyle() {
        return {
          height: this.$store.state.layoutHeight - 260 + 'px',
        }
      }
    },
    watch: {
      editorContent(value) {
        console.log(value)
        this.editorInstance.txt.html(value)
      },
      config(value){
        console.log(value)
        // debugger
        // this.editorInstance.menus = value;
        // this.editorInstance.create();
      },
      layoutHeight(value) {

      }
    },
    mounted() {
      this.editorInstance = new E(this.$refs.editor);
      this.editorInstance.menus =  [
        'head',
        'bold',
        'italic',
        'underline'
      ];

      if (this.imageServer === '') {
        this.editorInstance.customConfig.uploadImgShowBase64 = this.base64;   // 使用 base64 保存图片
      } else {
        this.editorInstance.customConfig.uploadImgServer = (process.env.NODE_ENV === 'production' ? this.$localHref : this.$baseUrl) + this.imageServer;
        this.editorInstance.customConfig.uploadImgParams = {
          // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
          // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
          // token: 'abcdef12345',
          userName: "admin",
          uId: "123456",
          part: "主要成果（产品）",
          id: 'WU_FILE_0',
          name: 'dsds',
          type: 'image/jpeg',
          lastModifiedDate: new Date(),
          size: '114111'
        }
      }
      this.editorInstance.customConfig.onchange = (html) => {
        this.editorContentInner = html;
        this.$emit('change', html)
      };
      this.editorInstance.customConfig.zIndex = 0;
      this.editorInstance.create();
      this.getHeight();

    },
    methods: {
      getContent() {
        // alert(this.editorContent)
      },
      getHeight() {
        document.querySelectorAll('.w-e-text-container')[0].style.height = this.layoutHeight - 260 + 'px'
      }
    }
  }
</script>
