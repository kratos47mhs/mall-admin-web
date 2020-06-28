<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             label-width="150px"
             ref="homeAdvertiseFrom"
             size="small">
      <el-form-item label="Ad name：" prop="name">
        <el-input class="input-width" v-model="homeAdvertise.name"></el-input>
      </el-form-item>
      <el-form-item label="Ad placement：">
        <el-select v-model="homeAdvertise.type">
          <el-option
            :key="type.value"
            :label="type.label"
            :value="type.value"
            v-for="type in typeOptions">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Starting time：" prop="startTime">
        <el-date-picker
          placeholder="Select Date"
          type="datetime"
          v-model="homeAdvertise.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="Ending Time：" prop="endTime">
        <el-date-picker
          placeholder="Select Date"
          type="datetime"
          v-model="homeAdvertise.endTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="Online/Offline：">
        <el-radio-group v-model="homeAdvertise.status">
          <el-radio :label="0">Offline</el-radio>
          <el-radio :label="1">Online</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Ad Image：">
        <single-upload v-model="homeAdvertise.pic"></single-upload>
      </el-form-item>
      <el-form-item label="Sort：">
        <el-input class="input-width" v-model="homeAdvertise.sort"></el-input>
      </el-form-item>
      <el-form-item label="Advertising link：" prop="url">
        <el-input class="input-width" v-model="homeAdvertise.url"></el-input>
      </el-form-item>
      <el-form-item label="Advertising notes：">
        <el-input
          :rows="5"
          class="input-width"
          placeholder="Please Enter"
          type="textarea"
          v-model="homeAdvertise.note">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit('homeAdvertiseFrom')" type="primary">Submit</el-button>
        <el-button @click="resetForm('homeAdvertiseFrom')" v-if="!isEdit">Reset</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import SingleUpload from '@/components/Upload/singleUpload'
  import {createHomeAdvertise, getHomeAdvertise, updateHomeAdvertise} from '@/api/homeAdvertise'

  const defaultTypeOptions = [
    {
      label: 'PC Home Carousel',
      value: 0
    },
    {
      label: 'APP Home Carousel',
      value: 1
    }
  ];
  const defaultHomeAdvertise = {
    name: null,
    type: 1,
    pic: null,
    startTime: null,
    endTime: null,
    status: 0,
    url: null,
    note: null,
    sort: 0
  };
  export default {
    name: 'HomeAdvertiseDetail',
    components: {SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        homeAdvertise: null,
        rules: {
          name: [
            {required: true, message: 'Please enter an ad name', trigger: 'blur'},
            {min: 2, max: 140, message: '2 to 140 characters in length', trigger: 'blur'}
          ],
          url: [
            {required: true, message: 'Please enter the advertising link', trigger: 'blur'}
          ],
          startTime: [
            {required: true, message: 'Please select a start time', trigger: 'blur'}
          ],
          endTime: [
            {required: true, message: 'Please select an expiration time', trigger: 'blur'}
          ],
          pic: [
            {required: true, message: 'Please select an advertising image', trigger: 'blur'}
          ]
        },
        typeOptions: Object.assign({}, defaultTypeOptions)
      }
    },
    created() {
      if (this.isEdit) {
        getHomeAdvertise(this.$route.query.id).then(response => {
          this.homeAdvertise = response.data;
        });
      } else {
        this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('Whether to Submit Data', 'Prompt', {
              confirmButtonText: 'Confirm',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateHomeAdvertise(this.$route.query.id, this.homeAdvertise).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: 'Successfully modified',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createHomeAdvertise(this.homeAdvertise).then(response => {
                  this.$refs[formName].resetFields();
                  this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
                  this.$message({
                    message: 'Submitted successfully',
                    type: 'success',
                    duration: 1000
                  });
                });
              }
            });

          } else {
            this.$message({
              message: 'Verification Failed',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


