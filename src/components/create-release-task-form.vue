<template>
  <div class="create-release-task-form md-scrollbar">
    <md-steppers :md-active-step.sync="active" md-alternative md-vertical md-linear>

      <md-step id="first" md-label="任务名称" :md-done.sync="steps[0]">
        <!-- <p>请为该任务指定一个名称</p> -->
        <validation-observer name="taskName" v-slot="{ invalid }">
          <md-field>
            <validation-provider rules="required">
              <md-textarea v-model="form.taskName" placeholder="为任务取一个名字吧" md-autogrow></md-textarea>
            </validation-provider>
          </md-field>
          <md-button class="next md-raised md-primary" :disabled="invalid" @click="setDone(0,'second')">下一步</md-button>
        </validation-observer>
      </md-step>

      <md-step id="second" md-label="发布频率" :md-done.sync="steps[1]">
        <i>发布频率尽量控制在一个合适的范围，一般推荐60分钟以上</i>
        </br>
        <i>发布频率过快会增加被官方识别出来的概率!</i>
        <validation-observer v-slot="{ invalid }">
          <validation-provider rules="required">
            <md-radio v-model="form.type" :value="taskType['弹性间隔']" class="md-primary">弹性间隔（推荐）
              <p>设置一个弹性时间间隔，每次发布时间，由间隔内的随机值确定</p>
              <p v-if="form.intervalSection[0] && form.intervalSection[1]">当前每隔{{form.intervalSection[0] || 'N'}}~{{form.intervalSection[1] || 'N'}}分钟执行一次发布任务</p>
            </md-radio>
          </validation-provider>
          <form class="form md-primary" v-if="form.type === taskType['弹性间隔']">
              <md-field>
                <label for="first-name">最小时间间隔</label>
                <validation-provider :rules="`required|max_value:${form.intervalSection[1]-1}|min_value:1`">
                    <md-input
                      type="number"
                      v-model.number="form.intervalSection[0]"
                    />
                </validation-provider>
              </md-field>
              <span style="margin:0 20px">—</span> 
                <validation-provider name="max" :rules="`required|min_value:${form.intervalSection[0]+1}`" v-slot="{ errors  }">
                  <md-field>
                    <label>最大时间间隔</label>
                    <md-input type="number" v-model="form.intervalSection[1]"/>
                    <span class="md-errors" v-if="errors[0]">{{errors[0]}}</span>
                  </md-field>
                </validation-provider>
              <div style="min-width:3em;margin-left:20px;">分钟</div>
            </form>
            <md-radio v-model="form.type" :value="taskType['固定间隔']" class="md-primary">
              固定间隔
              <p>每隔{{form.interval || 'N'}}分钟执行一次发布任务</p>
              <validation-provider tag="div" v-if="form.type === taskType['固定间隔']" name="interval" rules="required|min_value:1" v-slot="{ errors  }" @click.stop style="display:flex;flex-direction:row;align-items:center;">
                <md-field>
                  <label>设置间隔时间</label>
                  <md-input type="number" v-model="form.interval"/>
                  <span class="md-errors" v-if="errors[0]">{{errors[0]}}</span>
                </md-field>
                <span style="margin-left:20px;">分钟</span>
              </validation-provider>
                
            </md-radio>
          <md-button class="next md-raised md-primary" :disabled="invalid"  @click="setDone(1,'third')" >下一步</md-button>
        </validation-observer>
      </md-step>

      <md-step id="third" md-label="完成" :md-done.sync="steps[2]">
        <md-empty-state
          md-label="恭喜您，已完成配置！"
          md-description="快点击下方保存按钮保存吧">
          <md-button title="保存" class="save-task md-raised md-primary" @click="handleSaveTask">
            <md-icon>check</md-icon>
          </md-button>
        </md-empty-state>
        <!-- <slot name="action"/> -->
      </md-step>
    </md-steppers>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld form '@/components/HelloWorld.vue'
const { ipcRenderer } = window.electron
import { taskType } from '@enums/task-type'
export default {
  name: "create-release-task-form",
  props:['showCreateTaskPanel'],
  data() {
    return {
      active: 'first',
      taskType,
      steps:[false,false,false],
      form: {
        id:Date.now(),
        taskName:'',
        intervalSection:[],
        interval:'',
        type:''
      }
    };
  },
  methods: {
    setDone (step, index) {
          this.steps[step] = true
          if(step === this.steps.length - 2){
            this.steps[this.steps.length - 1] = true
          }

          if (index) {
            this.active = index
          }
        
      },
      handleSaveTask(){
        // 保存任务到本地
        // ipcRenderer.once('saved-task',() => {
        //   // 关闭dialog
        //   this.$emit('update:showCreateTaskPanel',false)
        //   // 刷新任务列表
        //   this.$emit('on-add-task')
        // })
        ipcRenderer.send('save-task',this.form)
      }
  }
};
</script>
<style lang="scss">
.create-release-task-form{
  overflow-y:auto;
  .md-radio-label{
    height:auto;
  }
  .form{
    display:flex;
    flex-direction:row;
    padding:0 38px;
    align-items:center;
  }
  .md-field{
    flex:1;
  }
  .md-radio{
    display:flex;
  }
  .next{
    margin:0;
  }
}
</style>
