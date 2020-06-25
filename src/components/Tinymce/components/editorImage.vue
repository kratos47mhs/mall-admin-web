<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" @click=" dialogVisible=true" icon='el-icon-upload'
               size="mini" type="primary">upload image
    </el-button>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <el-upload :before-upload="beforeUpload"
                 :data="dataObj"
                 :file-list="fileList"
                 :multiple="true"
                 :on-remove="handleRemove"
                 :on-success="handleSuccess"
                 :show-file-list="true"
                 action="http://macro-oss.oss-cn-shenzhen.aliyuncs.com"
                 class="editor-slide-upload"
                 list-type="picture-card">
        <el-button size="small" type="primary">Click upload</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button @click="handleSubmit" type="primary">OK</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import {policy} from '@/api/oss'

  export default {
    name: 'editorSlideUpload',
    props: {
      color: {
        type: String,
        default: '#1890ff'
      }
    },
    data() {
      return {
        dialogVisible: false,
        listObj: {},
        fileList: [],
        dataObj: {
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: ''
        }
      }
    },
    methods: {
      checkAllSuccess() {
        return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
      },
      handleSubmit() {
        const arr = Object.keys(this.listObj).map(v => this.listObj[v]);
        if (!this.checkAllSuccess()) {
          this.$message('Please wait for all pictures to upload successfully or there is a network problem, please refresh the page and upload again!');
          return
        }
        console.log(arr);
        this.$emit('successCBK', arr);
        this.listObj = {};
        this.fileList = [];
        this.dialogVisible = false;
      },
      handleSuccess(response, file) {
        const uid = file.uid;
        const objKeyArr = Object.keys(this.listObj);
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            this.listObj[objKeyArr[i]].url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name;
            this.listObj[objKeyArr[i]].hasSuccess = true;
            return
          }
        }
      },
      handleRemove(file) {
        const uid = file.uid;
        const objKeyArr = Object.keys(this.listObj);
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            delete this.listObj[objKeyArr[i]];
            return
          }
        }
      },
      beforeUpload(file) {
        const _self = this;
        const fileName = file.uid;
        this.listObj[fileName] = {};
        return new Promise((resolve, reject) => {
          policy().then(response => {
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
            _self.dataObj.key = response.data.dir + '/${filename}';
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data.host;
            _self.listObj[fileName] = {hasSuccess: false, uid: file.uid, width: this.width, height: this.height};
            resolve(true)
          }).catch(err => {
            console.log(err);
            reject(false)
          })
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .upload-container .editor-slide-upload {
    margin-bottom: 20px;
  }
</style>
