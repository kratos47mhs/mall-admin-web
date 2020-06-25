<template>
  <div>
    <el-upload
      :action="useOss?ossUploadUrl:minioUploadUrl"
      :before-upload="beforeUpload"
      :data="useOss?dataObj:null"
      :file-list="fileList"
      :limit="maxCount"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      list-type="picture-card"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" alt="" width="100%">
    </el-dialog>
  </div>
</template>
<script>
  import {policy} from '@/api/oss'

  export default {
    name: 'multiUpload',
    props: {
      //Picture property array
      value: Array,
      //Maximum number of uploaded pictures
      maxCount: {
        type: Number,
        default: 5
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
          host: ''
        },
        dialogVisible: false,
        dialogImageUrl: null,
        useOss: true, //Use oss->true;Using MinIO->false
        ossUploadUrl: 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com',
        minioUploadUrl: 'http://localhost:8080/minio/upload',
      };
    },
    computed: {
      fileList() {
        let fileList = [];
        for (let i = 0; i < this.value.length; i++) {
          fileList.push({url: this.value[i]});
        }
        return fileList;
      }
    },
    methods: {
      emitInput(fileList) {
        let value = [];
        for (let i = 0; i < fileList.length; i++) {
          value.push(fileList[i].url);
        }
        this.$emit('input', value)
      },
      handleRemove(file, fileList) {
        this.emitInput(fileList);
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl = file.url;
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
            resolve(true)
          }).catch(err => {
            console.log(err);
            reject(false)
          })
        })
      },
      handleUploadSuccess(res, file) {
        let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name;
        if (!this.useOss) {
          //Get image path directly without using OSS
          url = res.data.url;
        }
        this.fileList.push({name: file.name, url: url});
        this.emitInput(this.fileList);
      },
      handleExceed(files, fileList) {
        this.$message({
          message: 'Can only upload at maximum' + this.maxCount + 'Pictures',
          type: 'warning',
          duration: 1000
        });
      },
    }
  }
</script>
<style>

</style>


