<template>
  <div class="">
    <div class="common_imguploadpreview_wrapper">
      <!--{{innerFileList}}-->
      <div v-if="innerFileList.length===0">
        暂无{{fileType==='image'?'图片':'文件'}}
      </div>
      <a v-if="innerFileList.length!==0" class="close">
        <span class="iconfont icon-crosswide"></span>
      </a>
      <div v-if="innerFileList.length>0" v-for="(item, index) in innerFileList" class="image-item">
        <img v-if="checkFileType(item.name||item.url)==='image'" :src="$checkOSS(item.name||item.url, '-style_100x100')"
             class="avatar"/>
        <div v-else-if="checkFileType(item.name)==='word'">
          <img src="@/assets/img/filetype/doc.png"/>
        </div>
        <div v-else-if="checkFileType(item.name)==='excel'">
          <img src="@/assets/img/filetype/xls.png"/>
        </div>
        <div v-else-if="checkFileType(item.name)==='pdf'">
          <img src="@/assets/img/filetype/pdf.png"/>
        </div>
        <div v-else-if="checkFileType(item.name)==='file'">
          <img src="@/assets/img/filetype/file.png"/>
        </div>
        <ul class="operator">
          <li :class="{disabled:disabled===true}">
            <a class="el-icon-delete" @click="deleteFile(index)"></a>
          </li>
        </ul>
      </div>
    </div>

    <el-upload
      ref="uploadAvatar"
      :action="action"
      :limit='limit'
      :auto-upload="true"
      :show-file-list='showFileList'
      :before-upload="handleBeforeUpload"
      :on-preview="handlePreview"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :on-progress="handleProgress"
      :on-success="uploadSuccess"
      :on-error="handleError"
      :on-exceed="uploadAvatarExceeded"
      :file-list="innerFileList"
      :data="params"
      :disabled="disabled">

      <el-button v-waves size="small" type="primary" :disabled="disabled">点击上传</el-button>
      <div v-if="fileType!==''" slot="tip" class="el-upload__tip">
        只能上传{{fileTypeDictionary.filter(item => item.name === this.fileType)[0].suffixList.join('、')}}文件，且不超过10MB
      </div>
    </el-upload>
  </div>

</template>

<script>
  export default {
    name: "CommonUploadImage",
    props: {
      params: {
        type: Object,
        required: false,
        default: function () {
          return {
            bucketName: 'funyvalley',
            folderName: 'icon'
          }
        }
      },
      action: {
        type: String,
        required: true,
        default: ''
      },
      listType: {
        type: String,
        required: false,
        default: 'text'
      },
      limit: {
        type: Number,
        required: false,
        default: 1
      },
      imageUrlSuffix: {
        type: String,
        required: false,
        default: '-style_100x100'
      },
      previewUrl: {
        type: String,
        required: false,
        default: ''
      },
      newFile: {
        type: String,
        required: false,
        default: ''
      },
      multiple: {
        type: Boolean,
        required: false,
        default: false
      },
      returnUrlList: {
        type: String,
        required: false,
        default: ''
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      fileType: {
        type: String,
        required: false,
        default: ''
      },
      fileSize: {
        type: Number,
        required: false,
        default: 10
      },
    },
    data() {
      return {
        portraitParams: {
          bucketName: 'funyvalley',
          folderName: 'icon'
        },
        fileList: [],
        innerFileType: '',
        innerFileList: [],
        showFileList: false,
        fileTypeDictionary: [{
          name: 'image',
          suffixList: ['jpg', 'jpeg', 'png']
        }, {
          name: 'excel',
          suffixList: ['csv', 'xls', 'xlsx']
        }, {
          name: 'word',
          suffixList: ['doc']
        }, {
          name: 'pdf',
          suffixList: ['pdf']
        }],
        innerUrlList: [],
        usingResponseFlag: false,
        uploadFlag: true,
      }
    },
    computed: {
      // innerFileList: {
      //   get() {
      //     return this.fileList.map((item, index) => {
      //       return {
      //         name: index,
      //         url: item + this.imageUrlSuffix
      //       }
      //     });
      //   },
      //   set(val) {
      //     alert('dsdsds')
      //     this.$emit("update:fileList", val);
      //   }
      // },
    },
    watch: {
      fileList(value) {
        // alert('fileList')
      },
      newFile(value) {
      },
      returnUrlList(value) {
        console.log('returnUrlList', value)
        this.usingResponseFlag = true;

        let rawUrlList = [];
        if (!value instanceof Array) {
          rawUrlList = value;
        } else {
          if (value !== null && value !== '' && value !== {}) {
            rawUrlList = [value];
          }
        }
        this.innerFileList = [];

        this.updateFile(rawUrlList)

      },
      innerFileList(value) {
        this.$emit("update:fileList", value);
      }
    },

    mounted() {
      this.innerFileList = [];
      console.log('mounted', this.returnUrlList)

      console.log(this.returnUrlList instanceof Array)
      let rawUrlList = [];
      if (!this.returnUrlList instanceof Array) {
        rawUrlList = this.returnUrlList;
      } else {
        if (this.returnUrlList !== null && this.returnUrlList !== '' && this.returnUrlList !== {}) {
          rawUrlList = [this.returnUrlList];
        } else {
          rawUrlList = '';
        }
      }
      console.log('rawUrlList', rawUrlList)
      this.updateFile(rawUrlList);
    },
    methods: {
      updateFile(value) {
        // console.log(value)
        let valueArr = [];

        // value.forEach(item => {
        //   if (typeof item === 'string' && item !== '' && item !== null && this.checkFileType(item) === 'image') {
        //     valueArr.push(item)
        //     //
        //   } else if (typeof item === 'string' && item !== '' && item !== null && this.checkFileType(item) !== 'image') {
        //     valueArr.push(item)
        //   }
        // });

        // this.innerFileList = [];
        console.log(value.length)
        if (value.length > 0 && value !== '') {

          value.forEach((item, index) => {
            this.$set(this.innerFileList, index, {
              name: index,
              url: item,
              type: this.fileTypeDictionary.filter(item2 => item2 === this.checkFileType(item)).name
            })
          });
        }


        this.$emit('update:return-file-list', this.innerFileList);
        this.updateUrlList();
        // console.log(this.innerFileList)
      },
      updateUrlList() {
        if (this.multiple) {
          this.$emit('update:returnUrlList', this.innerFileList.map(item => {
            return item.url;
          }))
        } else {
          if (this.innerFileList.length === 0) {
            this.$emit('update:returnUrlList', '')
          } else {
            this.$emit('update:returnUrlList', this.innerFileList.map(item => {
              return item.url;
            })[0])
          }
        }
        // console.log(this.innerFileList.map(item => {
        //   return item.url;
        // })[0])
      },
      handleBeforeUpload(file) {
        console.log('handleBeforeUpload', file)
        console.log(this.fileType)
        console.log(this.checkFileType(file.name))
        this.uploadFlag = true;
        console.log('this.$refs[uploadAvatar]', this.$refs['uploadAvatar'])
        if (this.fileType === '' && this.checkFileType(file.name) === '') {
          this.$message({
            message: '未知的文件类型',
            type: 'error'
          });
          this.uploadFlag = false;
        } else if (this.fileType !== '' && this.checkFileType(file.name) !== this.fileType) {
          this.$message({
            message: '文件必须为' + this.fileTypeDictionary.filter(item => item.name === this.fileType)[0].suffixList.join('、') + '类型文件',
            type: 'error'
          });
          this.uploadFlag = false;
        }
        if (file.size > 1024 * 1024 * this.fileSize) {
          this.$message({
            message: `文件不得大于${this.fileSize}M`,
            type: 'error'
          });
          this.uploadFlag = false;

        }

        if (!this.uploadFlag) {
          // alert('!this.uploadFlag')
          console.log(this.fileList)
          console.log(this.$refs.uploadAvatar.clearFiles)
          this.$refs.uploadAvatar.abort(file);
          // return;
        } else {
          // alert('approve upload')
          this.showFileList = true;
          this.$emit('before-upload', file);
        }
        console.log('this.uploadFlag', this.uploadFlag)
        return this.uploadFlag;
      },
      handleProgress(event, file, fileList) {
        let params = [event, file, fileList];
        console.log('handleProgress', ...params)

        this.showFileList = true;
        // if (!this.uploadFlag) {
        //   alert('handleProgress')
        //   this.$refs.uploadAvatar.abort(file);
        // }
      },
      uploadSuccess(response, file, fileList) {

        this.showFileList = false;

        fileList.forEach((item, index) => {
          this.$set(this.innerFileList, index, item)
        });
        console.log('uploadSuccess', fileList);
        console.log('uploadSuccess', this.innerFileList);
        // this.currentFileType = this.checkFileType(this.innerUrlList)

        let params = [response, file, fileList];
        this.$emit('on-success', ...params);
      },
      handleError(err, file, fileList) {
        console.warn('handleError', err)
        // this.showFileList = false;

        this.$refs.uploadAvatar.abort(file);
        this.$message.error('文件上传失败')
        let params = [err, file, fileList];
        this.$emit('on-error', ...params);
      },
      handleChange(file, fileList) {
        console.log('file', file)
        console.log('fileList', fileList)
        // fileList.forEach((item, index) => {
        //   this.$set(this.innerFileList, index, item)
        // });
        if (!this.uploadFlag) {
          // alert('cccc')
          this.fileList = [];
          this.$refs.uploadAvatar.abort(file);
        }
      },
      handlePreview(file) {
        console.log(file);
        if (!this.uploadFlag) {
          // alert('!this.uploadFlag')
          console.log(this.fileList)
          console.log(this.$refs.uploadAvatar.clearFiles)
          this.$refs.uploadAvatar.clearFiles();
          this.$refs.uploadAvatar.abort(file);
          // this.innerFileList.splice()
          // return;
        } else {
          // this.innerFileList.push(file);
          let params = [this.innerFileList, file];
          this.$emit('on-preview', params);
        }
      },


      handleRemove(file, fileList) {
        if (!this.disabled) {
          this.$refs.uploadAvatar.abort(file);
          this.$emit('on-remove', '');
        }
      },


      uploadAvatarExceeded(files, fileList) {
        this.$emit('on-exceed', '');

        console.log('uploadAvatarExceeded', fileList)
        this.$message({
          message: `当前上传模块最多接受${this.limit}个文件，请删除已上传文件重新上传`,
          type: 'error'
        });
      },

      deleteFile(index) {
        if (!this.disabled) {
          this.innerFileList.splice(index, 1);
          console.log(this.innerFileList)
          console.log(this.innerFileList.length)
          this.updateUrlList();
          this.$emit('update:return-file-list', this.innerFileList);
        }

      },
      checkFileType(url) {
        console.log('checkFileType', url)
        let resultFileType = '';

        url = url.toString();
        if (url === null || url.lastIndexOf('.') === -1) {
          resultFileType = 'file';
        } else {
          let index1 = url.lastIndexOf('.') + 1;
          let index2 = url.length;
          let fileSuffix = url.substring(index1, index2);

          let fileTypeMatchFlag = false;
          this.fileTypeDictionary.forEach((item1, index1) => {
            item1.suffixList.forEach((item2, index2) => {
              if (item2 === fileSuffix) {
                resultFileType = this.fileTypeDictionary[index1].name;

                fileTypeMatchFlag = true;
              }
            });
            if (!fileTypeMatchFlag && index1 === this.fileTypeDictionary.length - 1) {
              resultFileType = 'file';
            }
          });
        }

        return resultFileType;
      },


    }

  }
</script>

<style scoped>

</style>
