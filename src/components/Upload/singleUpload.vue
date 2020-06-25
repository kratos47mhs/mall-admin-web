<template>
  <div>
    <el-upload
      :action="useOss?ossUploadUrl:minioUploadUrl"
      :before-upload="beforeUpload"
      :data="useOss?dataObj:null"
      :file-list="fileList" :multiple="false"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :show-file-list="showFileList"
      list-type="picture">
      <el-button size="small" type="primary">Click upload</el-button>
      <div class="el-upload__tip" slot="tip">Only upload jpg / png files, and no more than 10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="fileList[0].url" alt="" width="100%">
    </el-dialog>
  </div>
</template>
<script>
  import {policy} from '@/api/oss'

  export default {
    name: 'singleUpload',
    props: {
      value: String
    },
    computed: {
      imageUrl() {
        return this.value;
      },
      imageName() {
        if (this.value != null && this.value !== '') {
          return this.value.substr(this.value.lastIndexOf("/") + 1);
        } else {
          return null;
        }
      },
      fileList() {
        return [{
          name: this.imageName,
          url: this.imageUrl
        }]
      },
      showFileList: {
        get: function () {
          return this.value !== null && this.value !== '' && this.value !== undefined;
        },
        set: function (newValue) {
        }
      }
    },
    data() {
      return {
        dataObj: {
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: '',
          // callback:'',
        },
        dialogVisible: false,
        useOss: true, //Use oss->true;Using MinIO->false
        ossUploadUrl: 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com',
        minioUploadUrl: 'http://localhost:8080/minio/upload',
      };
    },
    methods: {
      emitInput(val) {
        this.$emit('input', val)
      },
      handleRemove(file, fileList) {
        this.emitInput('');
      },
      handlePreview(file) {
        this.dialogVisible = true;
      },
      beforeUpload(file) {
        let _self = this;
        if (!this.useOss) {
          //No fetch strategy is not needed without oss
          return true;
        }
        return new Promise((resolve, reject) => {
          policy().then(response => {
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
            _self.dataObj.key = response.data.dir + '/${filename}';
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data.host;
            // _self.dataObj.callback = response.data.callback;
            resolve(true)
          }).catch(err => {
            console.log(err);
            reject(false)
          })
        })
      },
      handleUploadSuccess(res, file) {
        this.showFileList = true;
        this.fileList.pop();
        let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name;
        if (!this.useOss) {
          //Get image path directly without using OSS
          url = res.data.url;
        }
        this.fileList.push({name: file.name, url: url});
        this.emitInput(this.fileList[0].url);
      }
    }
  }
</script>
<style>

</style>


