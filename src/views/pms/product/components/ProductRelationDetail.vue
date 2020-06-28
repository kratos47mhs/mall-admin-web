<template>
  <div style="margin-top: 50px">
    <el-form :model="value"
             label-width="120px"
             ref="productRelationForm"
             size="small"
             style="width: 680px">
      <el-form-item label="Related subjects：">
        <el-transfer
          :data="subjectList"
          :filter-method="filterMethod"
          :titles="subjectTitles"
          filter-placeholder="Please enter the subject name"
          filterable
          style="display: inline-block"
          v-model="selectSubject">
        </el-transfer>
      </el-form-item>
      <el-form-item label="Association preference：">
        <el-transfer
          :data="prefrenceAreaList"
          :filter-method="filterMethod"
          :titles="prefrenceAreaTitles"
          filter-placeholder="Please enter a preferred name"
          filterable
          style="display: inline-block"
          v-model="selectPrefrenceArea">
        </el-transfer>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button @click="handlePrev" size="medium">Previous，Fill in product attributes</el-button>
        <el-button @click="handleFinishCommit" size="medium" type="primary">Finish，Submit Product</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchListAll as fetchSubjectList} from '@/api/subject'
  import {fetchList as fetchPrefrenceAreaList} from '@/api/prefrenceArea'

  export default {
    name: "ProductRelationDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        //List of all subjects
        subjectList: [],
        //Subject title
        subjectTitles: ['To be Selected', 'Chosen'],
        //List of all subjects
        prefrenceAreaList: [],
        //Titles of all prefrenced Area
        prefrenceAreaTitles: ['To be Selected', 'Chosen']
      };
    },
    created() {
      this.getSubjectList();
      this.getPrefrenceAreaList();
    },
    computed: {
      //Selected Subjects
      selectSubject: {
        get: function () {
          let subjects = [];
          if (this.value.subjectProductRelationList == null || this.value.subjectProductRelationList.length <= 0) {
            return subjects;
          }
          for (let i = 0; i < this.value.subjectProductRelationList.length; i++) {
            subjects.push(this.value.subjectProductRelationList[i].subjectId);
          }
          return subjects;
        },
        set: function (newValue) {
          this.value.subjectProductRelationList = [];
          for (let i = 0; i < newValue.length; i++) {
            this.value.subjectProductRelationList.push({subjectId: newValue[i]});
          }
        }
      },
      //Selected preferences
      selectPrefrenceArea: {
        get: function () {
          let prefrenceAreas = [];
          if (this.value.prefrenceAreaProductRelationList == null || this.value.prefrenceAreaProductRelationList.length <= 0) {
            return prefrenceAreas;
          }
          for (let i = 0; i < this.value.prefrenceAreaProductRelationList.length; i++) {
            prefrenceAreas.push(this.value.prefrenceAreaProductRelationList[i].prefrenceAreaId);
          }
          return prefrenceAreas;
        },
        set: function (newValue) {
          this.value.prefrenceAreaProductRelationList = [];
          for (let i = 0; i < newValue.length; i++) {
            this.value.prefrenceAreaProductRelationList.push({prefrenceAreaId: newValue[i]});
          }
        }
      }
    },
    methods: {
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
      getSubjectList() {
        fetchSubjectList().then(response => {
          let list = response.data;
          for (let i = 0; i < list.length; i++) {
            this.subjectList.push({
              label: list[i].title,
              key: list[i].id
            });
          }
        });
      },
      getPrefrenceAreaList() {
        fetchPrefrenceAreaList().then(response => {
          let list = response.data;
          for (let i = 0; i < list.length; i++) {
            this.prefrenceAreaList.push({
              label: list[i].name,
              key: list[i].id
            });
          }
        });
      },
      handlePrev() {
        this.$emit('prevStep')
      },
      handleFinishCommit() {
        this.$emit('finishCommit', this.isEdit);
      }
    }
  }
</script>

<style scoped>

</style>
