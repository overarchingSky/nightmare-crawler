<template>
  <div class="create-release-task-form md-scrollbar">
    <md-steppers :md-active-step.sync="active" md-alternative md-vertical md-linear>
      <md-step id="first" md-label="任务名称" :md-done.sync="steps[0]">
        <p>请为该任务指定一个名称</p>
        <md-field>
          <md-input
            name="task-name"
            id="task-name"
            v-model="form.taskName"
          />
        </md-field>
        
        <md-button class="md-raised md-primary" @click="setDone(0,'second')">下一步</md-button>
      </md-step>

      <md-step id="second" md-label="发布频率" :md-done.sync="steps[1]">
        
        <md-radio v-model="form.type" value="type1">弹性间隔
          <p>设置一个弹性时间间隔，每次发布时间，由间隔内的随机值确定</p>
        </md-radio>
        <validation-observer v-slot="{ invalid }">
        <form class="from md-primary" v-show="form.type === 'type1'" style="wdith:370px;display:flex;flex-direction:row;align-items:center;">
            <md-field>
              <label for="first-name">最小时间间隔</label>
              <validation-provider rules="required|digits" v-slot="{ errors }">
                  <md-input
                    name="task-name"
                    id="task-name"
                    v-model="form.taskName"
                  />
                  <span class="md-error" v-if="errors[0]">{{errors[0]}</span>
              </validation-provider>
            </md-field>
            <span style="margin:0 20px">—</span> 
            <md-field>
              <label for="first-name">最大时间间隔</label>
              <md-input
                name="task-name"
                id="task-name"
                v-model="form.taskName"
              />
            </md-field>
          </form>
          <md-radio v-model="form.type" value="type2" class="md-primary">固定间隔</md-radio>
        <md-radio v-model="form.type" value="type3" class="md-primary">定点执行</md-radio>
        <md-button class="md-raised md-primary" @click="setDone(1,'third')" >下一步</md-button>
        </validation-observer>
        
      </md-step>

      <md-step id="third" md-label="完成" :md-done.sync="steps[2]">
        <md-empty-state
          md-label="恭喜您，已完成配置！"
          md-description="快点击下方保存按钮保存吧">
        </md-empty-state>
      </md-step>
      
    </md-steppers>
    <!-- <form novalidate class="md-layout md-gutter">
      <md-field class="firstName">
        <label for="first-name">task name</label>
        <md-input
          name="first-name"
          id="first-name"
          autocomplete="given-name"
          v-model="form.firstName"
        />
      </md-field>
      <md-field class="gender">
        <label for="gender">频次</label>
        <md-select name="gender" id="gender" v-model="form.gender" md-dense>
          <md-option></md-option>
          <md-option value="M">M</md-option>
          <md-option value="F">F</md-option>
        </md-select>
      </md-field>
      <md-field class="age">
        <label for="age">Age</label>
        <md-input type="number" id="age" name="age" autocomplete="age" v-model="form.age" />
      </md-field>
      <md-field class="email">
        <label for="email">Email</label>
        <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" />
      </md-field>
    </form> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
export default {
  name: "create-release-task-form",
  data() {
    return {
      active: 'first',
      steps:[false,false,false],
      // first: false,
      // second: false,
      // third: false,
      form: {
        type:'',
        firstName: null,
        lastName: null,
        gender: null,
        age: null,
        email: null
      }
    };
  },
  methods: {
    setDone (step, index) {
        this.steps[step] = true
        if(step === this.steps.length - 2){
          this.steps[this.steps.length - 1] = true
        }
        //this.secondStepError = null

        if (index) {
          this.active = index
        }
      },
  }
};
</script>
<style lang="scss">
.create-release-task-form{
  overflow-y:auto;
  .md-radio-label{
    height:auto;
  }
  .from{
    padding:0 38px;
  }
  .md-field{
    flex:1;
  }
  .md-radio{
    display:flex;
  }
}
</style>
